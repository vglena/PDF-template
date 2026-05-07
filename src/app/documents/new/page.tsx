import { redirect } from "next/navigation";
import { createDocumentFromTemplate } from "@/lib/documents";

async function createDocument() {
  "use server";
  const document = await createDocumentFromTemplate();
  redirect(`/documents/${document.id}/edit`);
}

export default function NewDocumentPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-8">
      <div className="mx-auto max-w-3xl rounded-md border border-neutral-200 bg-white p-6">
        <h1 className="text-2xl font-semibold">Crear documento desde plantilla</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Se creara una copia independiente de la plantilla de tasacion con la pagina 1
          reconstruida. Los cambios del nuevo documento no alteran el archivo maestro.
        </p>
        <form action={createDocument} className="mt-5">
          <button className="primary-button" type="submit">
            Crear documento
          </button>
        </form>
      </div>
    </main>
  );
}
