import React, { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../hooks/useTheme';
import { vscodeApi } from '../vscodeApi';
import type { CSSProperties } from 'react';

interface MarkdownRendererProps {
  content: string;
  currentFilePath?: string;
  onNavigate?: (path: string) => void;
}

// Check if link text looks like a task (e.g., "task-01-create-html-structure")
function isTaskLink(text: string): boolean {
  return /^task-\d+/.test(text);
}

// Copy icon component
function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

// Check icon component
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Status icons for #status/* tags
function StatusDoneIcon() {
  return (
    <svg className="inline-block w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatusPendingIcon() {
  return (
    <svg className="inline-block w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

function StatusInProgressIcon() {
  return (
    <svg className="inline-block w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2 A10 10 0 0 1 12 22" fill="none" stroke="white" strokeWidth="2" />
    </svg>
  );
}

function StatusBlockedIcon() {
  return (
    <svg className="inline-block w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M6 6l12 12M6 18L18 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StatusSkippedIcon() {
  return (
    <svg className="inline-block w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12h8M15 9l3 3-3 3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Status tag configuration
const STATUS_CONFIG: Record<string, { icon: React.FC; label: string; className: string }> = {
  'done': { icon: StatusDoneIcon, label: 'Done', className: 'text-green-600 dark:text-green-400' },
  'complete': { icon: StatusDoneIcon, label: 'Complete', className: 'text-green-600 dark:text-green-400' },
  'pending': { icon: StatusPendingIcon, label: 'Pending', className: 'text-gray-500 dark:text-gray-400' },
  'in-progress': { icon: StatusInProgressIcon, label: 'In Progress', className: 'text-blue-600 dark:text-blue-400' },
  'blocked': { icon: StatusBlockedIcon, label: 'Blocked', className: 'text-red-600 dark:text-red-400' },
  'skipped': { icon: StatusSkippedIcon, label: 'Skipped', className: 'text-gray-500 dark:text-gray-400' },
};

// Render a status tag with icon
function StatusTag({ status }: { status: string }) {
  const config = STATUS_CONFIG[status.toLowerCase()];
  if (!config) {
    // Unknown status, render as plain text
    return <span className="text-gray-500">#{`status/${status}`}</span>;
  }
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 ${config.className}`} title={config.label}>
      <Icon />
      <span className="text-xs font-medium">{config.label}</span>
    </span>
  );
}

// Parse text to find and replace #status/* tags
const STATUS_TAG_REGEX = /#status\/([a-zA-Z-]+)/g;

function parseTextWithStatusTags(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  // Reset regex lastIndex
  STATUS_TAG_REGEX.lastIndex = 0;

  while ((match = STATUS_TAG_REGEX.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the status tag component
    parts.push(<StatusTag key={key++} status={match[1]} />);
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export function MarkdownRenderer({ content, currentFilePath, onNavigate }: MarkdownRendererProps) {
  const { isDark } = useTheme();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyClick = useCallback(async (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Use VS Code API to copy to clipboard
      vscodeApi.copyToClipboard(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string | undefined) => {
    if (!href) return;

    // Handle relative markdown links
    if (href.endsWith('.md') && !href.startsWith('http')) {
      e.preventDefault();

      if (onNavigate && currentFilePath) {
        // Resolve relative path from current file's directory
        const currentDir = currentFilePath.replace(/\\/g, '/').split('/').slice(0, -1).join('/');
        let targetPath: string;

        if (href.startsWith('./')) {
          targetPath = `${currentDir}/${href.slice(2)}`;
        } else if (href.startsWith('../')) {
          const parentDir = currentDir.split('/').slice(0, -1).join('/');
          targetPath = `${parentDir}/${href.slice(3)}`;
        } else {
          targetPath = `${currentDir}/${href}`;
        }

        // Normalize path
        targetPath = targetPath.replace(/\/+/g, '/');
        onNavigate(targetPath);
      }
      return;
    }

    // External links open in browser via VS Code
    if (href.startsWith('http')) {
      e.preventDefault();
      vscodeApi.openExternal(href);
    }
  };

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const isInline = !className && !String(children).includes('\n');

            if (!isInline && language) {
              return (
                <div className="relative group">
                  <div className="absolute top-2 right-2 text-xs text-light-text-muted dark:text-dark-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {language}
                  </div>
                  <SyntaxHighlighter
                    style={(isDark ? oneDark : oneLight) as { [key: string]: CSSProperties }}
                    language={language}
                    PreTag="div"
                    customStyle={{
                      margin: '1em 0',
                      borderRadius: '3px',
                      fontSize: '14px',
                      padding: '16px',
                    }}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              );
            }

            if (!isInline) {
              return (
                <SyntaxHighlighter
                  style={(isDark ? oneDark : oneLight) as { [key: string]: CSSProperties }}
                  language="text"
                  PreTag="div"
                  customStyle={{
                    margin: '1em 0',
                    borderRadius: '3px',
                    fontSize: '14px',
                    padding: '16px',
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto">
                <table>{children}</table>
              </div>
            );
          },
          // Custom paragraph renderer that handles status tags
          p({ children }) {
            if (typeof children === 'string') {
              return <p>{parseTextWithStatusTags(children)}</p>;
            }
            // Handle array of children (mixed content)
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                const parsed = parseTextWithStatusTags(child);
                return parsed.length === 1 && typeof parsed[0] === 'string' ? child : parsed;
              }
              return child;
            });
            return <p>{processedChildren}</p>;
          },
          // Custom table cell renderer that handles status tags
          td({ children }) {
            if (typeof children === 'string') {
              return <td>{parseTextWithStatusTags(children)}</td>;
            }
            // Handle array of children (mixed content)
            const processedChildren = React.Children.map(children, (child) => {
              if (typeof child === 'string') {
                const parsed = parseTextWithStatusTags(child);
                return parsed.length === 1 && typeof parsed[0] === 'string' ? child : parsed;
              }
              return child;
            });
            return <td>{processedChildren}</td>;
          },
          a({ href, children }) {
            const isMarkdownLink = href?.endsWith('.md') && !href?.startsWith('http');
            const linkText = String(children);
            const isTask = isTaskLink(linkText);
            const isCopied = copiedText === linkText;

            if (isTask) {
              return (
                <span className="inline-flex items-center gap-1 group/task">
                  <a
                    href={href}
                    onClick={(e) => handleLinkClick(e, href)}
                    className="cursor-pointer"
                    title={`Navigate to ${href}`}
                  >
                    {children}
                  </a>
                  <button
                    onClick={(e) => handleCopyClick(e, linkText)}
                    className={`
                      inline-flex items-center justify-center p-0.5 rounded
                      transition-all duration-200
                      ${isCopied
                        ? 'text-light-accent-green dark:text-dark-accent-green'
                        : 'text-light-text-muted dark:text-dark-text-muted opacity-0 group-hover/task:opacity-100 hover:text-light-text-primary dark:hover:text-dark-text-primary'
                      }
                    `}
                    title={isCopied ? 'Copied!' : `Copy "${linkText}"`}
                  >
                    {isCopied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </span>
              );
            }

            return (
              <a
                href={href}
                onClick={(e) => handleLinkClick(e, href)}
                className={isMarkdownLink ? 'cursor-pointer' : ''}
                title={isMarkdownLink ? `Navigate to ${href}` : href}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
