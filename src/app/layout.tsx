import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UndanganKu - Undangan Digital",
  description: "Buat undangan digital cantik untuk momen spesialmu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
