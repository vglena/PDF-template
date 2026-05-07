import { NextResponse } from "next/server";
import { createDocumentFromTemplate } from "@/lib/documents";

export async function POST() {
  const document = await createDocumentFromTemplate();
  return NextResponse.json(document, { status: 201 });
}
