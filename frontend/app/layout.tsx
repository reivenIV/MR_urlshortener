import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Roads",
  description: "Shorten the way.",
};

// Wraps every page: the sidebar + the current page next to it.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Phones: sidebar on top (flex-col). From md: sidebar on the left (flex-row). */}
      <body className="min-h-full flex flex-col bg-surface font-sans text-ink md:flex-row">
        <Sidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* 6 vertical hairlines over the full height, painted BEHIND the pages
              (z-0, ignore the mouse). 6 columns with a line on both outer edges.
              Hidden on phones: too narrow for the columns to read. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden grid-cols-6 md:grid">
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className="border-r border-grid-line first:border-l" />
            ))}
          </div>
          {/* z-10: pages sit above the grid lines */}
          <div className="relative z-10 flex flex-1 flex-col">{children}</div>
        </div>
      </body>
    </html>
  );
}
