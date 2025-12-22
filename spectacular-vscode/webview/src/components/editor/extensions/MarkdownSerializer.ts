/**
 * Custom markdown serialization for TipTap editor
 * Handles status tags, wikilinks, and standard markdown elements
 */

// Regex patterns for parsing markdown
const STATUS_TAG_REGEX = /#status\/([a-zA-Z-]+)/g;
const WIKILINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

/**
 * Fix line breaks for items that should be on separate lines.
 * This handles cases where AI-generated content puts items on the same line.
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

  // Fix numbered sub-items on same line (e.g., "1.1. Item 1.2. Item")
  // Pattern: space followed by digit.digit. and space, then non-whitespace
  // Apply multiple times to handle chains like "1.1. a 1.2. b 1.3. c"
  let prevProcessed = '';
  while (prevProcessed !== processed) {
    prevProcessed = processed;
    processed = processed.replace(
      /\s+(\d+\.\d+\.)\s+(?=\S)/g,
      '\n$1 '
    );
  }

  // Fix main numbered items on same line (e.g., "1. Item 2. Item 3. Item")
  // Pattern: space followed by digit. (not digit.digit.) and space, then non-whitespace
  // Apply multiple times to handle chains
  prevProcessed = '';
  while (prevProcessed !== processed) {
    prevProcessed = processed;
    // Match space, number, period, space, then lookahead for non-whitespace
    // But NOT if followed by another digit (which would make it like "1.2.")
    processed = processed.replace(
      /\s+(\d+\.)\s+(?=[^\s\d])/g,
      '\n$1 '
    );
  }

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

  // First, fix line break issues for proper list/item rendering
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
