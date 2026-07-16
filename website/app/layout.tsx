import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Taobao Maternal & Infant Transaction Analysis | Alva Ding",
  description:
    "An interactive bilingual SQL analytics case study of 29,971 Taobao maternal and infant transactions.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
