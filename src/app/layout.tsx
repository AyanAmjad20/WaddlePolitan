import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: { default: "WaddlePolitan — Wildlife around TMU", template: "%s | WaddlePolitan" },
  description: "Spot campus wildlife, share a sighting, and explore Toronto Metropolitan University. A local frontend demo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col"><AppShell>{children}</AppShell></body>
    </html>
  );
}
