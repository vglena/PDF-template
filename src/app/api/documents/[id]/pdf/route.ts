import { NextResponse } from "next/server";
import { getDocument } from "@/lib/documents";
import { renderDocumentPdf } from "@/lib/pdf";

type PdfRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: PdfRouteContext) {
  const { id } = await params;
  const document = await getDocument(id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const pdf = await renderDocumentPdf(document);
  const body = new Uint8Array(pdf);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${document.id}.pdf"`,
    },
  });
}
