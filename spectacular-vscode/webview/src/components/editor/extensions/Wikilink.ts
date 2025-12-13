import { Node, mergeAttributes } from '@tiptap/core';

export interface WikilinkOptions {
  HTMLAttributes: Record<string, unknown>;
  onNavigate?: (target: string) => void;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    wikilink: {
      setWikilink: (target: string, label?: string) => ReturnType;
    };
  }
}

export const Wikilink = Node.create<WikilinkOptions>({
  name: 'wikilink',

  group: 'inline',

  inline: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
      onNavigate: undefined,
    };
  },

  addAttributes() {
    return {
      target: {
        default: '',
        parseHTML: element => element.getAttribute('data-target'),
        renderHTML: attributes => ({
          'data-target': attributes.target,
        }),
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: attributes => ({
          'data-label': attributes.label,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="wikilink"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const target = node.attrs.target as string;
    const label = (node.attrs.label as string) || target;

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'wikilink',
        class: 'wikilink',
        title: `Navigate to ${target}`,
      }),
      `[[${label}]]`,
    ];
  },

  addCommands() {
    return {
      setWikilink: (target: string, label?: string) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { target, label },
        });
      },
    };
  },
});

export default Wikilink;
