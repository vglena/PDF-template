"use client";

import { useEffect } from "react";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { Extension, Node } from "@tiptap/core";
import FontFamily from "@tiptap/extension-font-family";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// Custom extension that adds fontSize to TextStyle marks
export const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize?.replace("px", "") || null,
            renderHTML: (attributes: Record<string, string | null>) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}px` };
            },
          },
        },
      },
    ];
  },
});

const DivNode = Node.create({
  name: "div",
  group: "block",
  content: "block*",

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => (attributes.class ? { class: attributes.class } : {}),
      },
      "data-page-number": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-page-number"),
        renderHTML: (attributes) =>
          attributes["data-page-number"] ? { "data-page-number": attributes["data-page-number"] } : {},
      },
      "data-placeholder": {
        default: null,
        parseHTML: (element) => element.getAttribute("data-placeholder"),
        renderHTML: (attributes) =>
          attributes["data-placeholder"] ? { "data-placeholder": attributes["data-placeholder"] } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "div" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0];
  },
});

const SpanNode = Node.create({
  name: "span",
  group: "inline",
  inline: true,
  content: "inline*",

  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => (attributes.class ? { class: attributes.class } : {}),
      },
    };
  },

  parseHTML() {
    return [{ tag: "span" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", HTMLAttributes, 0];
  },
});

type PageEditorProps = {
  html: string;
  onChange: (html: string) => void;
  onFocus: (editor: Editor) => void;
};

export function PageEditor({ html, onChange, onFocus }: PageEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      DivNode,
      SpanNode,
      TextStyle,
      FontFamily,
      FontSize,
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: html,
    editorProps: {
      attributes: {
        class: "editor-surface",
      },
    },
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
    onFocus: ({ editor: activeEditor }) => {
      onFocus(activeEditor);
    },
  });

  useEffect(() => {
    if (!editor || editor.getHTML() === html) {
      return;
    }
    editor.commands.setContent(html, false);
  }, [editor, html]);

  if (!editor) {
    return null;
  }

  return (
    <EditorContent
      editor={editor}
      className="min-w-0 overflow-auto rounded-md border border-neutral-200 bg-neutral-100 p-4"
    />
  );
}
