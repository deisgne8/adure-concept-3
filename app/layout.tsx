import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adure Abhi Dev",
  description: "Fresh Next.js and Tailwind project on abhi-dev.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
