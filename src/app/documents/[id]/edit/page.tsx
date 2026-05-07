import { notFound } from "next/navigation";
import { DocumentEditor } from "@/components/DocumentEditor";
import { getDocument } from "@/lib/documents";

type EditDocumentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  const { id } = await params;
  const document = await getDocument(id);

  if (!document) {
    notFound();
  }

  return <DocumentEditor document={document} />;
}
