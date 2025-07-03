import { Mark, mergeAttributes } from '@tiptap/core';

export interface AutoLinkOptions {
  HTMLAttributes: {
    [key: string]: any;
  };
}

export const AutoLink = Mark.create<AutoLinkOptions>({
  name: 'autoLink',

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'text-leaf-alt font-semibold branch-underline cursor-help',
      },
    };
  },

  addAttributes() {
    return {
      'data-link-key': {
        default: null,
        parseHTML: element => element.getAttribute('data-link-key'),
        renderHTML: attributes => {
          if (!attributes['data-link-key']) {
            return {};
          }
          return { 'data-link-key': attributes['data-link-key'] };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="auto-link"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { 'data-type': 'auto-link' }), 0];
  },
}); 