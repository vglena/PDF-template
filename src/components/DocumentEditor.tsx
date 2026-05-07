"use client";

import { useRef, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Eye, FileDown, Paperclip, Plus, Save, Trash2, Upload, X } from "lucide-react";
import type { Editor } from "@tiptap/react";
import type { Annex, EditableDocument } from "@/lib/types";
import { EditorToolbar } from "./EditorToolbar";
import { PageEditor } from "./PageEditor";

type DocumentEditorProps = {
  document: EditableDocument;
};

export function DocumentEditor({ document }: DocumentEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(document.name);
  const [pages, setPages] = useState(document.pages);
  const [annexes, setAnnexes] = useState<Annex[]>(document.annexes ?? []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploadingAnnex, setIsUploadingAnnex] = useState(false);
  const annexInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeEditor, setActiveEditor] = useState<Editor | null>(null);


  const normalizedPages = useMemo(
    () =>
      pages.map((page, index) => ({
        ...page,
        pageNumber: index + 1,
      })),
    [pages],
  );

  const updatePageHtml = (index: number, html: string) => {
    setPages((current) =>
      current.map((page, i) => (i === index ? { ...page, html } : page)),
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const observers: IntersectionObserver[] = [];
    pageRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting && entry.intersectionRatio >= 0.3) {
            setActiveIndex(index);
          }
        },
        { threshold: 0.3, root: container },
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages.length]);

  const scrollToPage = (index: number) => {
    setActiveIndex(index);
    pageRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const addPage = () => {
    const newIndex = pages.length;
    setPages((current) => [
      ...current,
      {
        pageNumber: current.length + 1,
        html: `<div class="pdf-page" data-page-number="${current.length + 1}"><h1>Nueva pagina</h1><p>Contenido editable.</p></div>`,
      },
    ]);
    setActiveIndex(newIndex);
    // scroll after render
    setTimeout(() => pageRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const duplicatePage = () => {
    setPages((current) => {
      const clone = {
        pageNumber: activeIndex + 2,
        html: current[activeIndex]?.html ?? "",
      };
      return [...current.slice(0, activeIndex + 1), clone, ...current.slice(activeIndex + 1)];
    });
    setActiveIndex(activeIndex + 1);
    setTimeout(() => pageRefs.current[activeIndex + 1]?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const deletePage = () => {
    if (pages.length === 1) {
      setMessage("El documento debe conservar al menos una pagina.");
      return;
    }

    setPages((current) => current.filter((_, index) => index !== activeIndex));
    setActiveIndex(Math.max(0, activeIndex - 1));
  };

  const uploadAnnex = async (file: File) => {
    setIsUploadingAnnex(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`/api/documents/${document.id}/annexes`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        setMessage("No se pudo subir el anexo.");
        return;
      }
      const annex = (await response.json()) as Annex;
      setAnnexes((current) => [...current, annex]);
    } finally {
      setIsUploadingAnnex(false);
    }
  };

  const deleteAnnex = async (annexId: string) => {
    const response = await fetch(`/api/documents/${document.id}/annexes/${annexId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setAnnexes((current) => current.filter((a) => a.id !== annexId));
    } else {
      setMessage("No se pudo eliminar el anexo.");
    }
  };

  const save = () => {
    startTransition(async () => {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, pages: normalizedPages }),
      });

      if (!response.ok) {
        setMessage("No se pudieron guardar los cambios.");
        return;
      }

      setMessage("Cambios guardados.");
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/95 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-w-64 rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium"
            aria-label="Nombre del documento"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button className="action-button" type="button" onClick={addPage}>
              <Plus size={16} />
              Pagina
            </button>
            <button className="action-button" type="button" onClick={duplicatePage}>
              <Copy size={16} />
              Duplicar
            </button>
            <button className="action-button" type="button" onClick={deletePage}>
              <Trash2 size={16} />
              Borrar
            </button>
            <Link className="action-button" href={`/documents/${document.id}/preview`}>
              <Eye size={16} />
              Vista previa
            </Link>
            <a className="action-button" href={`/api/documents/${document.id}/pdf`}>
              <FileDown size={16} />
              PDF
            </a>
            <button className="primary-button" type="button" onClick={save} disabled={isPending}>
              <Save size={16} />
              Guardar
            </button>
          </div>
        </div>
        {message ? (
          <p className="mx-auto mt-2 max-w-7xl text-sm text-neutral-600">{message}</p>
        ) : null}
      </header>

      <div className="sticky top-[57px] z-10 shadow-sm">
        <EditorToolbar editor={activeEditor} />
      </div>

      <main className="mx-auto grid max-w-7xl grid-cols-[220px_minmax(0,1fr)] gap-5 px-5 py-5">
        <aside className="rounded-md border border-neutral-200 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase text-neutral-500">Paginas</p>
          <div className="flex flex-col gap-2">
            {normalizedPages.map((page, index) => (
              <button
                key={`${page.pageNumber}-${index}`}
                type="button"
                onClick={() => scrollToPage(index)}
                className={`rounded-md border px-3 py-2 text-left text-sm ${
                  index === activeIndex
                    ? "border-ink bg-ink text-white"
                    : "border-neutral-200 bg-white text-ink"
                }`}
              >
                Pagina {page.pageNumber}
              </button>
            ))}
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase text-neutral-500">Anexos</p>
            <div className="flex flex-col gap-2">
              {annexes.map((annex) => (
                <div
                  key={annex.id}
                  className="flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2 py-1.5"
                >
                  <Paperclip size={13} className="shrink-0 text-neutral-400" />
                  <span className="min-w-0 flex-1 truncate text-xs text-ink" title={annex.name}>
                    {annex.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteAnnex(annex.id)}
                    className="shrink-0 text-neutral-400 hover:text-red-500"
                    aria-label="Eliminar anexo"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <input
              ref={annexInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void uploadAnnex(file);
                  e.target.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => annexInputRef.current?.click()}
              disabled={isUploadingAnnex}
              className="action-button mt-2 w-full justify-center text-xs disabled:opacity-50"
            >
              <Upload size={13} />
              {isUploadingAnnex ? "Subiendo..." : "Subir PDF"}
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <div
            ref={scrollContainerRef}
            className="max-h-[calc(100vh-112px-44px)] overflow-auto"
          >
            <div className="flex flex-col gap-5">
            {normalizedPages.map((page, index) => (
              <div
                key={`page-${index}`}
                ref={(el) => { pageRefs.current[index] = el; }}
              >
                <PageEditor
                  html={page.html}
                  onChange={(html) => updatePageHtml(index, html)}
                  onFocus={(editor) => setActiveEditor(editor)}
                />
              </div>
            ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
