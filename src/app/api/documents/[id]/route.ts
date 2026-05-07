import { NextResponse } from "next/server";
import { getDocument, updateDocument } from "@/lib/documents";

type DocumentRouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: DocumentRouteContext) {
  const { id } = await params;
  const document = await getDocument(id);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}

export async function PUT(request: Request, { params }: DocumentRouteContext) {
  const { id } = await params;
  const input = await request.json();
  const document = await updateDocument(id, input);

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  return NextResponse.json(document);
}
