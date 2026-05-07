# Template Editor

A web-based document editor for creating, editing, and exporting professional documents as PDFs. Built with Next.js, it lets you manage HTML-based document templates, edit their content page by page through a rich text editor, attach PDF annexes, and generate a final merged PDF with a single click.

## Features

- **Template-based documents** — Define reusable HTML/CSS templates with any number of pages
- **Rich text editing** — Per-page WYSIWYG editor powered by Tiptap (bold, italic, tables, images, font styles, and more)
- **PDF generation** — Renders documents to pixel-perfect PDFs using a headless Chromium browser
- **Annex support** — Attach external PDF files that get merged into the final exported document
- **Document management** — Create, list, edit, and preview multiple documents
- **Live preview** — See the final PDF before downloading

## Tech Stack

- [Next.js 15](https://nextjs.org/) — React framework with App Router and API routes
- [Tiptap](https://tiptap.dev/) — Headless rich text editor
- [Playwright](https://playwright.dev/) — Headless Chromium for server-side PDF rendering
- [pdf-lib](https://pdf-lib.js.org/) — PDF merging
- [Tailwind CSS](https://tailwindcss.com/) — Styling

## Requirements

- [Node.js](https://nodejs.org/) v18 or higher
- npm

## Installation

```bash
npm install
```

This will install all dependencies and automatically download the Chromium browser required for PDF generation.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production

```bash
npm run build
npm start
```

## Adding Templates

Templates live in `src/templates/<template-name>/`. Each template consists of:

- `template.html` — Base layout
- `styles.css` — Stylesheet applied during PDF rendering
- `pages/page-001.html`, `page-002.html`, ... — Individual page HTML files

Documents are stored as JSON in `data/documents.json`, and annex files are stored under `data/annexes/`.

## Deployment

The project includes a `Dockerfile` for containerized deployments. It uses the system Chromium instead of downloading a separate browser binary, keeping the image size down.

```bash
docker build -t template-editor .
docker run -p 3000:3000 template-editor
```

It is also ready to deploy on [Railway](https://railway.app/) — just connect the GitHub repository and Railway will detect the `Dockerfile` automatically.

