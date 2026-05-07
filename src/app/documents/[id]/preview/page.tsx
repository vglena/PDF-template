import Link from "next/link";
import { notFound } from "next/navigation";
import { FileDown, Pencil } from "lucide-react";
import { PdfPreview } from "@/components/PdfPreview";
import { getDocument } from "@/lib/documents";

type PreviewDocumentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PreviewDocumentPage({ params }: PreviewDocumentPageProps) {
  const { id } = await params;
  const document = await getDocument(id);

  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-paper">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-5 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{document.name}</h1>
            <p className="text-sm text-neutral-600">Vista previa A4</p>
          </div>
          <div className="flex gap-2">
            <Link className="action-button" href={`/documents/${document.id}/edit`}>
              <Pencil size={16} />
              Editar
            </Link>
            <a className="primary-button" href={`/api/documents/${document.id}/pdf`}>
              <FileDown size={16} />
              Exportar PDF
            </a>
          </div>
        </div>
      </header>
      <div className="px-5 py-6">
        <PdfPreview pages={document.pages} />
        {(document.annexes ?? []).length > 0 && (
          <div className="mx-auto mt-8 max-w-[794px]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Anexos
            </h2>
            <div className="flex flex-col gap-6">
              {document.annexes.map((annex) => (
                <div key={annex.id} className="overflow-hidden rounded-md border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2">
                    <span className="text-sm font-medium text-ink">{annex.name}</span>
                    <a
                      href={`/api/documents/${document.id}/annexes/${annex.id}/file`}
                      download={annex.name}
                      className="text-xs text-neutral-500 underline hover:text-ink"
                    >
                      Descargar
                    </a>
                  </div>
                  <iframe
                    src={`/api/documents/${document.id}/annexes/${annex.id}/file`}
                    title={annex.name}
                    className="h-[1000px] w-full bg-neutral-50"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
