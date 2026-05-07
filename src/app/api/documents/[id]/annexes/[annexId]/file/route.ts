import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { getDocument } from "@/lib/documents";

type AnnexFileRouteContext = {
  params: Promise<{ id: string; annexId: string }>;
};

export async function GET(_request: Request, { params }: AnnexFileRouteContext) {
  const { id, annexId } = await params;

  const document = await getDocument(id);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const annex = (document.annexes ?? []).find((a) => a.id === annexId);
  if (!annex) {
    return NextResponse.json({ error: "Annex not found" }, { status: 404 });
  }

  let fileBytes: Buffer;
  try {
    fileBytes = await readFile(annex.filePath);
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return new NextResponse(fileBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${annex.name}"`,
    },
  });
}
