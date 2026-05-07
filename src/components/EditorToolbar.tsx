"use client";

import type { Editor } from "@tiptap/react";
import { Bold, ImagePlus, Italic, Rows3, Table2, Trash2 } from "lucide-react";

export const FONT_FAMILIES = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
];

export const FONT_SIZES = ["8", "9", "10", "11", "12", "14", "16", "18", "24"];

type EditorToolbarProps = {
  editor: Editor | null;
};

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const insertImage = () => {
    if (!editor) return;
    const url = window.prompt("URL de la imagen");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-neutral-200 bg-white px-5 py-2">
      {/* Font family */}
      <select
        className="toolbar-select"
        title="Tipo de letra"
        disabled={!editor}
        value=""
        onChange={(e) => {
          if (!editor) return;
          if (e.target.value) {
            editor.chain().focus().setFontFamily(e.target.value).run();
          } else {
            editor.chain().focus().unsetFontFamily().run();
          }
        }}
      >
        <option value="">Fuente</option>
        {FONT_FAMILIES.map((f) => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Font size */}
      <select
        className="toolbar-select w-16"
        title="Tamaño"
        disabled={!editor}
        value=""
        onChange={(e) => {
          if (!editor) return;
          if (e.target.value) {
            editor.chain().focus().setMark("textStyle", { fontSize: e.target.value }).run();
          } else {
            editor.chain().focus().setMark("textStyle", { fontSize: null }).run();
          }
        }}
      >
        <option value="">Tam.</option>
        {FONT_SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="h-5 w-px bg-neutral-200" />

      <button
        type="button"
        disabled={!editor}
        className={`toolbar-button font-bold ${editor?.isActive("bold") ? "bg-neutral-100" : ""}`}
        title="Negrita"
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        disabled={!editor}
        className={`toolbar-button italic ${editor?.isActive("italic") ? "bg-neutral-100" : ""}`}
        title="Cursiva"
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} />
      </button>

      <div className="h-5 w-px bg-neutral-200" />

      <button
        type="button"
        disabled={!editor}
        className="toolbar-button"
        title="Insertar tabla"
        onClick={() =>
          editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
        }
      >
        <Table2 size={16} />
      </button>
      <button
        type="button"
        disabled={!editor}
        className="toolbar-button"
        title="Añadir fila"
        onClick={() => editor?.chain().focus().addRowAfter().run()}
      >
        <Rows3 size={16} />
      </button>
      <button
        type="button"
        disabled={!editor}
        className="toolbar-button"
        title="Borrar tabla"
        onClick={() => editor?.chain().focus().deleteTable().run()}
      >
        <Trash2 size={16} />
      </button>
      <button
        type="button"
        disabled={!editor}
        className="toolbar-button"
        title="Insertar imagen"
        onClick={insertImage}
      >
        <ImagePlus size={16} />
      </button>
    </div>
  );
}
