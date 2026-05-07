import { NextResponse } from "next/server";
import { addAnnex, getDocument } from "@/lib/documents";

type AnnexesRouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: AnnexesRouteContext) {
  const { id } = await params;

  const document = await getDocument(id);
  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const annex = await addAnnex(id, file.name, buffer);

  if (!annex) {
    return NextResponse.json({ error: "Failed to add annex" }, { status: 500 });
  }

  return NextResponse.json(annex, { status: 201 });
}
