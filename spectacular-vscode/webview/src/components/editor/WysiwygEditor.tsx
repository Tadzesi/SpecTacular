import { useEffect, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { Markdown } from 'tiptap-markdown';
import { marked } from 'marked';

import { StatusTag } from './extensions/StatusTag';
import { Wikilink } from './extensions/Wikilink';
import { EditorToolbar } from './EditorToolbar';
import { preprocessMarkdown } from './extensions/MarkdownSerializer';

interface WysiwygEditorProps {
  content: string;
  filePath?: string;
  onContentChange?: (content: string, isModified: boolean) => void;
  onNavigate?: (path: string) => void;
  readOnly?: boolean;
}

// Regex to match YAML frontmatter at the start of a file
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

// Extract frontmatter from markdown content
function extractFrontmatter(content: string): { frontmatter: string | null; body: string } {
  const match = content.match(FRONTMATTER_REGEX);
  if (match) {
    return {
      frontmatter: match[0],
      body: content.slice(match[0].length),
    };
  }
  return { frontmatter: null, body: content };
}

export function WysiwygEditor({
  content,
  filePath,
  onContentChange,
  onNavigate,
  readOnly = false,
}: WysiwygEditorProps) {
  const originalContentRef = useRef<string>(content);
  const isInitialLoadRef = useRef(true);
  const currentFilePathRef = useRef<string | undefined>(filePath);
  const frontmatterRef = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable default code block in favor of custom one if needed
        codeBlock: {
          HTMLAttributes: {
            class: 'code-block',
          },
        },
        // Enable nesting for ordered and bulleted lists
        orderedList: {
          HTMLAttributes: {
            class: 'ordered-list',
          },
          keepMarks: true,
          keepAttributes: false,
        },
        bulletList: {
          HTMLAttributes: {
            class: 'bullet-list',
          },
          keepMarks: true,
          keepAttributes: false,
        },
        listItem: {
          HTMLAttributes: {
            class: 'list-item',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'editor-table',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
      Typography,
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
      StatusTag,
      Wikilink.configure({
        onNavigate,
      }),
    ],
    content: '',
    editable: !readOnly,
    editorProps: {
      attributes: {
        class: 'wysiwyg-editor prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4',
      },
      handleClick: (_view, _pos, event) => {
        // Handle wikilink clicks
        const target = event.target as HTMLElement;
        if (target.classList.contains('wikilink') || target.closest('.wikilink')) {
          const wikilinkEl = target.classList.contains('wikilink') ? target : target.closest('.wikilink');
          const targetPath = wikilinkEl?.getAttribute('data-target');
          if (targetPath && onNavigate) {
            // Resolve relative path
            if (filePath) {
              const currentDir = filePath.replace(/\\/g, '/').split('/').slice(0, -1).join('/');
              let resolvedPath = targetPath;
              if (!targetPath.endsWith('.md')) {
                resolvedPath = `${targetPath}.md`;
              }
              if (!resolvedPath.startsWith('/')) {
                resolvedPath = `${currentDir}/${resolvedPath}`;
              }
              onNavigate(resolvedPath);
            }
            return true;
          }
        }

        // Handle link clicks
        if (target.tagName === 'A' || target.closest('a')) {
          const linkEl = target.tagName === 'A' ? target : target.closest('a');
          const href = linkEl?.getAttribute('href');
          if (href) {
            if (href.endsWith('.md')) {
              event.preventDefault();
              if (onNavigate && filePath) {
                const currentDir = filePath.replace(/\\/g, '/').split('/').slice(0, -1).join('/');
                let resolvedPath = href;
                if (href.startsWith('./')) {
                  resolvedPath = `${currentDir}/${href.slice(2)}`;
                } else if (href.startsWith('../')) {
                  const parentDir = currentDir.split('/').slice(0, -1).join('/');
                  resolvedPath = `${parentDir}/${href.slice(3)}`;
                } else if (!href.startsWith('/')) {
                  resolvedPath = `${currentDir}/${href}`;
                }
                onNavigate(resolvedPath);
              }
              return true;
            }
          }
        }

        return false;
      },
    },
    onUpdate: ({ editor }) => {
      if (isInitialLoadRef.current) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const storage = editor.storage as any;
      let markdown = storage.markdown?.getMarkdown?.() ?? editor.getHTML();

      // Re-add frontmatter if it was present in original content
      if (frontmatterRef.current) {
        markdown = frontmatterRef.current + markdown;
      }

      const isModified = markdown !== originalContentRef.current;
      onContentChange?.(markdown, isModified);
    },
  });

  // Update content only when file changes (not during editing)
  useEffect(() => {
    if (!editor) return;

    // Check if this is a new file or initial load
    const isNewFile = filePath !== currentFilePathRef.current;
    const isInitialContent = isInitialLoadRef.current && content !== undefined;

    if ((isNewFile || isInitialContent) && content !== undefined) {
      isInitialLoadRef.current = true;
      currentFilePathRef.current = filePath;
      originalContentRef.current = content;

      // Extract and preserve frontmatter (YAML metadata)
      const { frontmatter, body } = extractFrontmatter(content);
      frontmatterRef.current = frontmatter;

      // Pre-process markdown for custom extensions (only the body, not frontmatter)
      const preprocessed = preprocessMarkdown(body);
      console.log('=== DEBUG: After preprocessing ===');
      console.log(preprocessed.substring(0, 1000));

      // Convert markdown to HTML using marked (better nested list support)
      // marked handles nested lists properly according to CommonMark spec
      const htmlContent = marked.parse(preprocessed, {
        breaks: true,
        gfm: true,
      }) as string;
      console.log('=== DEBUG: After marked.parse ===');
      console.log(htmlContent.substring(0, 1000));

      // Set the HTML content (TipTap will parse it into its document structure)
      editor.commands.setContent(htmlContent, {
        emitUpdate: false,
      });

      // Small delay to ensure content is set before allowing updates
      setTimeout(() => {
        isInitialLoadRef.current = false;
      }, 50);
    }
  }, [content, filePath, editor]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly);
    }
  }, [editor, readOnly]);

  // Get current markdown content
  const getMarkdown = useCallback((): string => {
    if (!editor) return content;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storage = editor.storage as any;
    let markdown = storage.markdown?.getMarkdown?.() ?? editor.getHTML();

    // Re-add frontmatter if present
    if (frontmatterRef.current) {
      markdown = frontmatterRef.current + markdown;
    }

    return markdown;
  }, [editor, content]);

  // Expose getMarkdown method via ref
  useEffect(() => {
    if (editor) {
      (editor as unknown as { getMarkdownContent: () => string }).getMarkdownContent = getMarkdown;
    }
  }, [editor, getMarkdown]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-32 text-light-text-muted dark:text-dark-text-muted">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="wysiwyg-editor-container flex flex-col h-full">
      {!readOnly && <EditorToolbar editor={editor} />}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
}

export default WysiwygEditor;
