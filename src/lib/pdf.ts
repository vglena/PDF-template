import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { chromium } from "playwright";
import type { EditableDocument } from "./types";

export async function renderDocumentPdf(document: EditableDocument) {
  const styles = await readFile(
    path.join(process.cwd(), "src", "templates", "tasacion", "styles.css"),
    "utf8",
  );

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <style>
      ${styles}
      body { margin: 0; background: white; }
    </style>
  </head>
  <body>
    <div class="document-pages">
      ${document.pages.map((page) => page.html).join("\n")}
    </div>
  </body>
</html>`;

  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  let mainPdfBytes: Uint8Array;
  try {
    const page = await browser.newPage({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "networkidle" });
    mainPdfBytes = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
  } finally {
    await browser.close();
  }

  const annexes = document.annexes ?? [];
  if (annexes.length === 0) {
    return mainPdfBytes;
  }

  // Merge main PDF with annexed PDFs
  const merged = await PDFDocument.create();

  const mainDoc = await PDFDocument.load(mainPdfBytes);
  const mainPages = await merged.copyPages(mainDoc, mainDoc.getPageIndices());
  for (const p of mainPages) merged.addPage(p);

  for (const annex of annexes) {
    try {
      const annexBytes = await readFile(annex.filePath);
      const annexDoc = await PDFDocument.load(annexBytes);
      const annexPages = await merged.copyPages(annexDoc, annexDoc.getPageIndices());
      for (const p of annexPages) merged.addPage(p);
    } catch {
      // skip unreadable annex files
    }
  }

  return Buffer.from(await merged.save());
}
