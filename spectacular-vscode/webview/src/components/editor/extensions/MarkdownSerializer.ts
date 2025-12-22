/**
 * Custom markdown serialization for TipTap editor
 * Handles status tags, wikilinks, and standard markdown elements
 */

// Regex patterns for parsing markdown
const STATUS_TAG_REGEX = /#status\/([a-zA-Z-]+)/g;
const WIKILINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Check if a line is a list item (numbered, bulleted, or task)
 */
function isListItem(line: string): boolean {
  // Match lines that start with optional whitespace followed by list markers
  // Markers: -, *, +, 1., 2., etc., or task list items [ ] or [x]
  return /^\s*(-|\*|\+|\d+\.|\[[ xX]\])\s/.test(line);
}

/**
 * Fix line breaks for items that should be on separate lines.
 * This handles cases where AI-generated content puts items on the same line.
 * IMPORTANT: Skips list items to preserve their indentation/nesting structure.
 */
function fixLineBreaks(markdown: string): string {
  let processed = markdown;

  // Fix bold key-value pairs on same line (e.g., "**Key1**: value **Key2**: value")
  // Add newline before **Key**: when preceded by non-newline content
  // Look for pattern: some content followed by space then **Bold**:
  processed = processed.replace(
    /([^\n])\s+(\*\*[^*]+\*\*\s*:)/g,
    '$1\n$2'
  );

  // Process line by line to preserve list item structure
  const lines = processed.split('\n');
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // CRITICAL: If this is a list item, preserve it as-is (no processing)
    if (isListItem(line)) {
      processedLines.push(line);
      continue;
    }

    // For non-list lines, apply existing fixes
    let processedLine = line;

    // Fix numbered sub-items on same line (e.g., "text 1.1. Item")
    // Only if not already a list item
    processedLine = processedLine.replace(
      /\s+(\d+\.\d+\.)\s+(?=\S)/g,
      '\n$1 '
    );

    // Fix main numbered items on same line (e.g., "text 1. Item")
    // Only if not already a list item
    processedLine = processedLine.replace(
      /\s+(\d+\.)\s+(?=[^\s\d])/g,
      '\n$1 '
    );

    processedLines.push(processedLine);
  }

  processed = processedLines.join('\n');

  // Ensure numbered lists have a blank line before them when preceded by text
  // Pattern: non-list content followed directly by "1. " at start of line
  // This helps markdown parsers recognize lists
  processed = processed.replace(
    /([^\n])\n(\d+\.\s)/g,
    (match, before, listItem) => {
      // Don't add extra line if before is already a list item or empty
      if (/^\s*$/.test(before) || /^\d+\./.test(before) || /^[-*]/.test(before)) {
        return match;
      }
      return `${before}\n\n${listItem}`;
    }
  );

  // Similarly for sub-items after headings or paragraphs
  processed = processed.replace(
    /([^\n])\n(\d+\.\d+\.\s)/g,
    (match, before, listItem) => {
      // Don't add extra line if before is already a list/sub-item
      if (/^\s*$/.test(before) || /^\d+\./.test(before)) {
        return match;
      }
      return `${before}\n\n${listItem}`;
    }
  );

  return processed;
}

/**
 * Normalize list indentation to ensure proper nesting is recognized.
 * This function validates and standardizes indentation levels for nested lists.
 * TEMPORARILY DISABLED FOR TESTING
 */
// @ts-ignore - temporarily unused for testing
function normalizeListIndentation(markdown: string): string {
  console.log('=== normalizeListIndentation INPUT ===');
  console.log(markdown.substring(0, 500));

  const lines = markdown.split('\n');
  const normalized: string[] = [];
  let inList = false;
  let listStack: { indent: number; marker: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this is a list item
    const listMatch = line.match(/^(\s*)(-|\*|\+|\d+\.|\[[ xX]\])\s+(.*)$/);

    if (listMatch) {
      const indent = listMatch[1];
      const marker = listMatch[2];
      const content = listMatch[3];
      const indentLength = indent.length;

      if (!inList) {
        // Starting a new list - no indentation for first item
        listStack = [{ indent: 0, marker }];
        normalized.push(`${marker} ${content}`);
        inList = true;
      } else {
        // Already in a list - determine nesting level
        // Find the appropriate parent level
        let nestingLevel = 0;

        // Remove stack entries with greater or equal indentation
        while (
          listStack.length > 0 &&
          listStack[listStack.length - 1].indent >= indentLength
        ) {
          listStack.pop();
        }

        // Current nesting level is the stack depth
        nestingLevel = listStack.length;

        // Add current item to stack
        listStack.push({ indent: indentLength, marker });

        // Normalize indentation: 3 spaces per nesting level (CommonMark standard for nested lists)
        // This ensures markdown-it/TipTap properly recognizes the nested structure
        const normalizedIndent = '   '.repeat(nestingLevel);
        normalized.push(`${normalizedIndent}${marker} ${content}`);
      }
    } else {
      // Not a list item
      if (line.trim() === '') {
        // Empty line - preserve but might continue list context
        normalized.push(line);
      } else {
        // Non-empty, non-list line - end list context
        normalized.push(line);
        inList = false;
        listStack = [];
      }
    }
  }

  const result = normalized.join('\n');
  console.log('=== normalizeListIndentation OUTPUT ===');
  console.log(result.substring(0, 500));
  return result;
}

/**
 * Pre-process markdown content to convert custom syntax to HTML
 * that TipTap can parse, then post-process when serializing back
 */
export function preprocessMarkdown(markdown: string): string {
  let processed = markdown;

  // Strip checkmarks and other prefixes from list items BEFORE processing
  // This prevents breaking list structure
  // Match checkmark/x/✓/✗ followed by optional space, then list item
  processed = processed.replace(/^([✓✗xX]\s+)?(\d+\.)/gm, '$2');
  processed = processed.replace(/^(\s+)([✓✗xX]\s+)?(-|\d+\.)/gm, '$1$3');

  // CRITICAL: Normalize list indentation to preserve nesting hierarchy
  // This must run BEFORE fixLineBreaks to ensure list structure is intact
  // TEMPORARILY DISABLED to test if marked can handle original indentation
  // processed = normalizeListIndentation(processed);

  // Fix line break issues for non-list content
  // (fixLineBreaks now skips list items automatically)
  processed = fixLineBreaks(processed);

  // Convert #status/xxx to span elements
  processed = processed.replace(STATUS_TAG_REGEX, (_match, status) => {
    return `<span data-type="status-tag" data-status="${status}"></span>`;
  });

  // Convert [[wikilink]] and [[wikilink|label]] to span elements
  processed = processed.replace(WIKILINK_REGEX, (_match, target, label) => {
    const labelAttr = label ? ` data-label="${label}"` : '';
    return `<span data-type="wikilink" data-target="${target}"${labelAttr}></span>`;
  });

  return processed;
}

/**
 * Post-process HTML content from TipTap back to markdown
 */
export function postprocessToMarkdown(html: string): string {
  let processed = html;

  // Convert status tag spans back to #status/xxx
  processed = processed.replace(
    /<span[^>]*data-type="status-tag"[^>]*data-status="([^"]+)"[^>]*>.*?<\/span>/g,
    (_match, status) => `#status/${status}`
  );

  // Convert wikilink spans back to [[target]] or [[target|label]]
  processed = processed.replace(
    /<span[^>]*data-type="wikilink"[^>]*data-target="([^"]+)"(?:[^>]*data-label="([^"]+)")?[^>]*>.*?<\/span>/g,
    (_match, target, label) => {
      if (label && label !== target) {
        return `[[${target}|${label}]]`;
      }
      return `[[${target}]]`;
    }
  );

  return processed;
}

/**
 * Convert TipTap JSON content to clean markdown string
 */
export function tiptapToMarkdown(editor: { getHTML: () => string }): string {
  const html = editor.getHTML();
  const postProcessed = postprocessToMarkdown(html);
  return htmlToMarkdown(postProcessed);
}

/**
 * Basic HTML to Markdown converter
 * Handles common elements and preserves custom syntax
 */
function htmlToMarkdown(html: string): string {
  let md = html;

  // Handle headings
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  // Handle bold and italic
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Handle code
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Handle links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Handle images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Handle lists
  md = md.replace(/<ul[^>]*>(.*?)<\/ul>/gis, (_, content) => {
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
  });
  md = md.replace(/<ol[^>]*>(.*?)<\/ol>/gis, (_, content) => {
    let index = 0;
    return content.replace(/<li[^>]*>(.*?)<\/li>/gi, () => `${++index}. ${arguments[1]}\n`) + '\n';
  });

  // Handle task lists
  md = md.replace(/<li[^>]*data-checked="true"[^>]*>(.*?)<\/li>/gi, '- [x] $1\n');
  md = md.replace(/<li[^>]*data-checked="false"[^>]*>(.*?)<\/li>/gi, '- [ ] $1\n');

  // Handle blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, content) => {
    return content.split('\n').map((line: string) => `> ${line}`).join('\n') + '\n\n';
  });

  // Handle horizontal rules
  md = md.replace(/<hr[^>]*\/?>/gi, '\n---\n\n');

  // Handle paragraphs
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Handle line breaks
  md = md.replace(/<br[^>]*\/?>/gi, '\n');

  // Handle code blocks
  md = md.replace(/<pre[^>]*><code[^>]*class="language-([^"]*)"[^>]*>(.*?)<\/code><\/pre>/gis,
    (_, lang, code) => `\`\`\`${lang}\n${decodeHtmlEntities(code)}\n\`\`\`\n\n`);
  md = md.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gis,
    (_, code) => `\`\`\`\n${decodeHtmlEntities(code)}\n\`\`\`\n\n`);

  // Clean up remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = decodeHtmlEntities(md);

  // Clean up extra whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };

  return text.replace(/&[^;]+;/g, (entity) => entities[entity] || entity);
}
