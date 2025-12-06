import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../hooks/useTheme';
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

export function MarkdownRenderer({ content, currentFilePath, onNavigate }: MarkdownRendererProps) {
  const { isDark } = useTheme();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopyClick = useCallback(async (e: React.MouseEvent, text: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(text);
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

    // External links open in browser
    if (href.startsWith('http')) {
      e.preventDefault();
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="markdown-content prose dark:prose-invert max-w-none">
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
                      margin: 0,
                      borderRadius: '6px',
                      fontSize: '14px',
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
                    margin: 0,
                    borderRadius: '6px',
                    fontSize: '14px',
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
