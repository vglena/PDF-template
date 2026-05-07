export type EditableTemplate = {
  id: string;
  name: string;
  pages: TemplatePage[];
};

export type TemplatePage = {
  pageNumber: number;
  html: string;
  status: "draft" | "reviewed";
};

export type Annex = {
  id: string;
  name: string;
  filePath: string;
};

export type EditableDocument = {
  id: string;
  templateId: string;
  name: string;
  pages: EditableDocumentPage[];
  annexes: Annex[];
  createdAt: string;
  updatedAt: string;
};

export type EditableDocumentPage = {
  pageNumber: number;
  html: string;
};
