import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getTasacionTemplate } from "./template";
import type { Annex, EditableDocument } from "./types";

const dataDir = path.join(process.cwd(), "data");
const documentsPath = path.join(dataDir, "documents.json");
const annexesDir = path.join(dataDir, "annexes");

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(documentsPath, "utf8");
  } catch {
    await writeFile(documentsPath, "[]", "utf8");
  }
}

async function readDocuments(): Promise<EditableDocument[]> {
  await ensureStore();
  const raw = await readFile(documentsPath, "utf8");
  return JSON.parse(raw) as EditableDocument[];
}

async function writeDocuments(documents: EditableDocument[]) {
  await ensureStore();
  await writeFile(documentsPath, JSON.stringify(documents, null, 2), "utf8");
}

export async function createDocumentFromTemplate() {
  const template = await getTasacionTemplate();
  const now = new Date().toISOString();
  const document: EditableDocument = {
    id: crypto.randomUUID(),
    templateId: template.id,
    name: `${template.name} - nuevo documento`,
    pages: template.pages.map((page) => ({
      pageNumber: page.pageNumber,
      html: page.html,
    })),
    annexes: [],
    createdAt: now,
    updatedAt: now,
  };

  const documents = await readDocuments();
  documents.unshift(document);
  await writeDocuments(documents);
  return document;
}

export async function getDocument(id: string) {
  const documents = await readDocuments();
  return documents.find((document) => document.id === id) ?? null;
}

export async function updateDocument(id: string, input: Pick<EditableDocument, "name" | "pages">) {
  const documents = await readDocuments();
  const index = documents.findIndex((document) => document.id === id);

  if (index === -1) {
    return null;
  }

  const updated: EditableDocument = {
    ...documents[index],
    name: input.name,
    pages: input.pages.map((page, pageIndex) => ({
      pageNumber: pageIndex + 1,
      html: page.html,
    })),
    updatedAt: new Date().toISOString(),
  };

  documents[index] = updated;
  await writeDocuments(documents);
  return updated;
}

export async function addAnnex(documentId: string, fileName: string, fileBuffer: Buffer): Promise<Annex | null> {
  const documents = await readDocuments();
  const index = documents.findIndex((d) => d.id === documentId);

  if (index === -1) return null;

  const annexId = crypto.randomUUID();
  const docAnnexDir = path.join(annexesDir, documentId);
  await mkdir(docAnnexDir, { recursive: true });

  const filePath = path.join(docAnnexDir, `${annexId}.pdf`);
  await writeFile(filePath, fileBuffer);

  const annex: Annex = { id: annexId, name: fileName, filePath };
  documents[index] = {
    ...documents[index],
    annexes: [...(documents[index].annexes ?? []), annex],
    updatedAt: new Date().toISOString(),
  };

  await writeDocuments(documents);
  return annex;
}

export async function removeAnnex(documentId: string, annexId: string): Promise<boolean> {
  const documents = await readDocuments();
  const index = documents.findIndex((d) => d.id === documentId);

  if (index === -1) return false;

  const annex = (documents[index].annexes ?? []).find((a) => a.id === annexId);
  if (!annex) return false;

  try {
    await unlink(annex.filePath);
  } catch {
    // file may already be gone
  }

  documents[index] = {
    ...documents[index],
    annexes: documents[index].annexes.filter((a) => a.id !== annexId),
    updatedAt: new Date().toISOString(),
  };

  await writeDocuments(documents);
  return true;
}
