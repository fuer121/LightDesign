import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GenProvider } from "@/components/GenContext";
import Header from "@/components/Header";
import { ErrorCatcher } from "@/components/ErrorCatcher";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "LightDesign — AI 电商产品主图生成",
  description: "上传商品照片，输入卖点文案，快速获得可上架的专业主图",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-900">
        <ErrorCatcher />
        <GenProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </GenProvider>
      </body>
    </html>
  );
}
