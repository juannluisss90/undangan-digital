import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "UndanganKu - Undangan Digital",
  description: "Buat undangan digital cantik untuk momen spesialmu",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ margin: 0, padding: 0, overflowX: 'hidden' }}>
      {children}
    </div>
  );
}   