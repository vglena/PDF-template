import { readFile } from "node:fs/promises";
import path from "node:path";
import type { EditableTemplate } from "./types";

const templateRoot = path.join(process.cwd(), "src", "templates", "tasacion");

export async function getTasacionTemplate(): Promise<EditableTemplate> {
  const page001 = await readFile(
    path.join(templateRoot, "pages", "page-001.html"),
    "utf8",
  );
  const page002 = await readFile(
    path.join(templateRoot, "pages", "page-002.html"),
    "utf8",
  );
  const page003 = await readFile(
    path.join(templateRoot, "pages", "page-003.html"),
    "utf8",
  );
  const page004 = await readFile(
    path.join(templateRoot, "pages", "page-004.html"),
    "utf8",
  );
  const page005 = await readFile(
    path.join(templateRoot, "pages", "page-005.html"),
    "utf8",
  );
  const page006 = await readFile(
    path.join(templateRoot, "pages", "page-006.html"),
    "utf8",
  );
  const page007 = await readFile(
    path.join(templateRoot, "pages", "page-007.html"),
    "utf8",
  );
  const page008 = await readFile(
    path.join(templateRoot, "pages", "page-008.html"),
    "utf8",
  );
  const page009 = await readFile(
    path.join(templateRoot, "pages", "page-009.html"),
    "utf8",
  );
  const page010 = await readFile(
    path.join(templateRoot, "pages", "page-010.html"),
    "utf8",
  );
  const page011 = await readFile(
    path.join(templateRoot, "pages", "page-011.html"),
    "utf8",
  );
  const page012 = await readFile(
    path.join(templateRoot, "pages", "page-012.html"),
    "utf8",
  );
  const page013 = await readFile(
    path.join(templateRoot, "pages", "page-013.html"),
    "utf8",
  );
  const page014 = await readFile(
    path.join(templateRoot, "pages", "page-014.html"),
    "utf8",
  );
  const page015 = await readFile(
    path.join(templateRoot, "pages", "page-015.html"),
    "utf8",
  );
  const page016 = await readFile(
    path.join(templateRoot, "pages", "page-016.html"),
    "utf8",
  );
  const page017 = await readFile(
    path.join(templateRoot, "pages", "page-017.html"),
    "utf8",
  );
  const page018 = await readFile(
    path.join(templateRoot, "pages", "page-018.html"),
    "utf8",
  );
  const page019 = await readFile(
    path.join(templateRoot, "pages", "page-019.html"),
    "utf8",
  );
  const page020 = await readFile(
    path.join(templateRoot, "pages", "page-020.html"),
    "utf8",
  );
  const page021 = await readFile(
    path.join(templateRoot, "pages", "page-021.html"),
    "utf8",
  );
  const page022 = await readFile(
    path.join(templateRoot, "pages", "page-022.html"),
    "utf8",
  );
  const page023 = await readFile(
    path.join(templateRoot, "pages", "page-023.html"),
    "utf8",
  );

  return {
    id: "tasacion-base",
    name: "Tasacion base",
    pages: [
      {
        pageNumber: 1,
        html: page001,
        status: "draft",
      },
      {
        pageNumber: 2,
        html: page002,
        status: "draft",
      },
      {
        pageNumber: 3,
        html: page003,
        status: "draft",
      },
      {
        pageNumber: 4,
        html: page004,
        status: "draft",
      },
      {
        pageNumber: 5,
        html: page005,
        status: "draft",
      },
      {
        pageNumber: 6,
        html: page006,
        status: "draft",
      },
      {
        pageNumber: 7,
        html: page007,
        status: "draft",
      },
      {
        pageNumber: 8,
        html: page008,
        status: "draft",
      },
      {
        pageNumber: 9,
        html: page009,
        status: "draft",
      },
      {
        pageNumber: 10,
        html: page010,
        status: "draft",
      },
      {
        pageNumber: 11,
        html: page011,
        status: "draft",
      },
      {
        pageNumber: 12,
        html: page012,
        status: "draft",
      },
      {
        pageNumber: 13,
        html: page013,
        status: "draft",
      },
      {
        pageNumber: 14,
        html: page014,
        status: "draft",
      },
      {
        pageNumber: 15,
        html: page015,
        status: "draft",
      },
      {
        pageNumber: 16,
        html: page016,
        status: "draft",
      },
      {
        pageNumber: 17,
        html: page017,
        status: "draft",
      },
      {
        pageNumber: 18,
        html: page018,
        status: "draft",
      },
      {
        pageNumber: 19,
        html: page019,
        status: "draft",
      },
      {
        pageNumber: 20,
        html: page020,
        status: "draft",
      },
      {
        pageNumber: 21,
        html: page021,
        status: "draft",
      },
      {
        pageNumber: 22,
        html: page022,
        status: "draft",
      },
      {
        pageNumber: 23,
        html: page023,
        status: "draft",
      },
    ],
  };
}
