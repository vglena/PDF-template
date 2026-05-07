import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Plantilla de tasación</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Reconstrucción editable página por página desde el PDF base.
          </p>
        </div>
        <Link
          href="/documents/new"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white"
        >
          Crear documento
        </Link>
      </div>
    </main>
  );
}
