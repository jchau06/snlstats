import type { Metadata } from "next";
import '../src/styles/globals.css';

export const metadata: Metadata = {
  title: "SNL Stats",
  description: "Statistics for Saturday Night Live",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}