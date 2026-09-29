// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Initialize the Inter font from Google Fonts
const inter = Inter({ subsets: ["latin"] });

// Metadata is used for SEO (Search Engine Optimization)
export const metadata: Metadata = {
  title: "Dev Portfolio 26-30",
  description: "A dynamic, fully customizable portfolio platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* The body tag applies the font and background colors globally */}
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}