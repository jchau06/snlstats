import type { Metadata } from "next";
import "../src/styles/globals.css";
import { Header } from "@/src/components/ui/Header";
import { Footer } from "@/src/components/ui/Footer";

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
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}