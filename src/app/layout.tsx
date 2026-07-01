import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Alternatif Turizm Devremülk Merkezi | Kiralama ve Satış",
  description:
    "Alternatif Turizm Devremülk Merkezi - devremülk kiralama ve satış. Eliz, Afyon ve daha fazlasında fırsat ilanları.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
