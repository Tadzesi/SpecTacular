import { Node, mergeAttributes } from '@tiptap/core';

export interface StatusTagOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    statusTag: {
      setStatusTag: (status: string) => ReturnType;
    };
  }
}

const STATUS_LABELS: Record<string, string> = {
  'done': 'Done',
  'complete': 'Complete',
  'pending': 'Pending',
  'in-progress': 'In Progress',
  'blocked': 'Blocked',
  'skipped': 'Skipped',
};

export const StatusTag = Node.create<StatusTagOptions>({
  name: 'statusTag',

  group: 'inline',

  inline: true,

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      status: {
        default: 'pending',
        parseHTML: element => element.getAttribute('data-status'),
        renderHTML: attributes => ({
          'data-status': attributes.status,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="status-tag"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const status = node.attrs.status as string;
    const label = STATUS_LABELS[status.toLowerCase()] || status;

    const colorClasses: Record<string, string> = {
      'done': 'status-done',
      'complete': 'status-done',
      'pending': 'status-pending',
      'in-progress': 'status-in-progress',
      'blocked': 'status-blocked',
      'skipped': 'status-skipped',
    };

    const colorClass = colorClasses[status.toLowerCase()] || 'status-pending';

    return [
      'span',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'status-tag',
        class: `status-tag ${colorClass}`,
      }),
      label,
    ];
  },

  addCommands() {
    return {
      setStatusTag: (status: string) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: { status },
        });
      },
    };
  },
});

export default StatusTag;
