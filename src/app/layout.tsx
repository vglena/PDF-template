import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Editor de plantilla documental",
  description: "MVP para reconstruir y editar informes PDF como plantillas HTML.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
