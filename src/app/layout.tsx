import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/Components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// metaタグの情報
export const metadata: Metadata = {
  title: "trello-sample",
  description: "看板",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="flex flex-col min-h-screen">
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
