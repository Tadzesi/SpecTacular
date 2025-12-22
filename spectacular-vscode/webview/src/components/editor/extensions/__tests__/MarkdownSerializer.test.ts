import { describe, it, expect } from 'vitest';
import { preprocessMarkdown } from '../MarkdownSerializer';

describe('MarkdownSerializer - List Preservation', () => {
  describe('nested list indentation preservation', () => {
    it('preserves 2-space indented child items', () => {
      const input = `1. Parent item
  1. Child item with 2 spaces
    1. Grandchild with 4 spaces`;

      const result = preprocessMarkdown(input);

      // Should normalize to consistent 3-space indentation (CommonMark standard)
      expect(result).toContain('1. Parent item');
      expect(result).toContain('   1. Child item');
      expect(result).toContain('      1. Grandchild');
    });

    it('preserves 4-space indented child items', () => {
      const input = `1. Parent item
    1. Child item with 4 spaces
        1. Grandchild with 8 spaces`;

      const result = preprocessMarkdown(input);

      // Should normalize to 3-space per level (CommonMark standard)
      expect(result).toContain('1. Parent item');
      expect(result).toContain('   1. Child item');
      expect(result).toContain('      1. Grandchild');
    });

    it('handles mixed numbered and bulleted lists', () => {
      const input = `1. Numbered parent
  - Bulleted child
    - Bulleted grandchild
2. Second parent`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('1. Numbered parent');
      expect(result).toContain('   - Bulleted child');
      expect(result).toContain('      - Bulleted grandchild');
      expect(result).toContain('2. Second parent');
    });

    it('normalizes inconsistent indentation', () => {
      const input = `1. Parent
   1. Child with 3 spaces
     1. Grandchild with 5 spaces`;

      const result = preprocessMarkdown(input);

      // Should normalize to 3-space per level (CommonMark standard)
      expect(result).toContain('1. Parent');
      expect(result).toContain('   1. Child');
      expect(result).toContain('      1. Grandchild');
    });

    it('handles deep nesting (5 levels)', () => {
      const input = `1. Level 1
  1. Level 2
    1. Level 3
      1. Level 4
        1. Level 5`;

      const result = preprocessMarkdown(input);

      const lines = result.split('\n');
      expect(lines[0]).toContain('1. Level 1');
      expect(lines[1]).toContain('   1. Level 2');
      expect(lines[2]).toContain('      1. Level 3');
      expect(lines[3]).toContain('         1. Level 4');
      expect(lines[4]).toContain('            1. Level 5');
    });

    it('preserves bulleted list structure', () => {
      const input = `- Parent bullet
  - Child bullet
    - Grandchild bullet`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('- Parent bullet');
      expect(result).toContain('   - Child bullet');
      expect(result).toContain('      - Grandchild bullet');
    });

    it('handles asterisk list markers', () => {
      const input = `* Parent
  * Child
    * Grandchild`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('* Parent');
      expect(result).toContain('   * Child');
      expect(result).toContain('      * Grandchild');
    });
  });

  describe('checkmark removal with indentation preservation', () => {
    it('removes checkmarks but preserves top-level items', () => {
      const input = `✓ 1. Checked item
x 2. X-marked item`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('1. Checked item');
      expect(result).toContain('2. X-marked item');
      expect(result).not.toContain('✓');
      expect(result).not.toContain('x ');
    });

    it('removes checkmarks but preserves nested indentation', () => {
      const input = `1. Parent
  ✓ 1. Checked child
    X 1. X-marked grandchild`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('1. Parent');
      expect(result).toContain('   1. Checked child');
      expect(result).toContain('      1. X-marked grandchild');
      expect(result).not.toContain('✓');
      expect(result).not.toContain('X ');
    });
  });

  describe('custom syntax preservation', () => {
    it('preserves status tags in list items', () => {
      const input = `1. Task item #status/done
  1. Subtask #status/pending`;

      const result = preprocessMarkdown(input);

      // Status tags should be converted to span elements
      expect(result).toContain('data-type="status-tag"');
      expect(result).toContain('data-status="done"');
      expect(result).toContain('data-status="pending"');
      // List structure should be preserved
      expect(result).toContain('1. Task item');
      expect(result).toContain('   1. Subtask');
    });

    it('preserves wikilinks in list items', () => {
      const input = `1. See [[other-spec]]
  1. Also check [[another-spec|Another Spec]]`;

      const result = preprocessMarkdown(input);

      // Wikilinks should be converted to span elements
      expect(result).toContain('data-type="wikilink"');
      expect(result).toContain('data-target="other-spec"');
      expect(result).toContain('data-target="another-spec"');
      // List structure should be preserved
      expect(result).toContain('1. See');
      expect(result).toContain('   1. Also check');
    });
  });

  describe('list with non-list content', () => {
    it('handles lists after paragraphs', () => {
      const input = `Some paragraph text.

1. First item
  1. Nested item`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('Some paragraph text.');
      expect(result).toContain('1. First item');
      expect(result).toContain('   1. Nested item');
    });

    it('handles lists before headings', () => {
      const input = `1. List item
  1. Nested item

## Heading`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('1. List item');
      expect(result).toContain('   1. Nested item');
      expect(result).toContain('## Heading');
    });

    it('handles multiple separate lists', () => {
      const input = `1. First list
  1. Nested

Some text between

1. Second list
  1. Also nested`;

      const result = preprocessMarkdown(input);

      const lines = result.split('\n');
      expect(lines).toContain('1. First list');
      expect(lines).toContain('   1. Nested');
      expect(lines).toContain('1. Second list');
      expect(lines).toContain('   1. Also nested');
    });
  });

  describe('edge cases', () => {
    it('handles empty list items', () => {
      const input = `1. Item with content
  1.
2. Another item`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('1. Item with content');
      expect(result).toContain('2. Another item');
    });

    it('handles list items with multiple lines of content', () => {
      const input = `1. Parent item
  1. Child item
     with continuation`;

      const result = preprocessMarkdown(input);

      // List structure should be preserved
      expect(result).toContain('1. Parent item');
      expect(result).toContain('  1. Child item');
    });

    it('handles very deeply nested lists', () => {
      const input = `1. L1
  1. L2
    1. L3
      1. L4
        1. L5
          1. L6`;

      const result = preprocessMarkdown(input);

      expect(result).toContain('1. L1');
      expect(result).toContain('   1. L2');
      expect(result).toContain('      1. L3');
      expect(result).toContain('         1. L4');
      expect(result).toContain('            1. L5');
      expect(result).toContain('               1. L6');
    });
  });
});

describe('MarkdownSerializer - Non-List Functionality', () => {
  it('still processes non-list content correctly', () => {
    const input = `# Heading

Paragraph text here.

**Bold** and *italic*.`;

    const result = preprocessMarkdown(input);

    expect(result).toContain('# Heading');
    expect(result).toContain('Paragraph text here.');
    expect(result).toContain('**Bold**');
    expect(result).toContain('*italic*');
  });

  it('handles status tags outside of lists', () => {
    const input = `Task is #status/done`;

    const result = preprocessMarkdown(input);

    expect(result).toContain('data-type="status-tag"');
    expect(result).toContain('data-status="done"');
  });

  it('handles wikilinks outside of lists', () => {
    const input = `See [[other-page]] for details`;

    const result = preprocessMarkdown(input);

    expect(result).toContain('data-type="wikilink"');
    expect(result).toContain('data-target="other-page"');
  });
});
