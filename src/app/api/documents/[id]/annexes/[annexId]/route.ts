import { NextResponse } from "next/server";
import { removeAnnex } from "@/lib/documents";

type AnnexRouteContext = {
  params: Promise<{ id: string; annexId: string }>;
};

export async function DELETE(_request: Request, { params }: AnnexRouteContext) {
  const { id, annexId } = await params;

  const removed = await removeAnnex(id, annexId);

  if (!removed) {
    return NextResponse.json({ error: "Annex not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
