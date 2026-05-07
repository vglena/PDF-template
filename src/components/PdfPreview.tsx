type PdfPreviewProps = {
  pages: Array<{
    pageNumber: number;
    html: string;
  }>;
};

export function PdfPreview({ pages }: PdfPreviewProps) {
  return (
    <div className="document-pages">
      {pages.map((page) => (
        <div key={page.pageNumber} dangerouslySetInnerHTML={{ __html: page.html }} />
      ))}
    </div>
  );
}
