"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, LinkIcon } from "./icons";
import { LogoMark } from "./logo";

// The sidebar buttons. To add a page: add one line here.
const items = [
  { href: "/", label: "Home", icon: <HomeIcon /> },
  { href: "/links", label: "Links", icon: <LinkIcon /> },
];

// Navigation shown on every page (it's rendered by app/layout.tsx).
// Phones: a bar across the top. From "md" (768px): a column on the left.
export default function Sidebar() {
  // The current URL path, e.g. "/links". "use client" is needed for this hook.
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="relative z-20 flex shrink-0 items-center gap-2 border-b border-hairline bg-surface px-4 py-3 md:sticky md:top-0 md:h-screen md:w-56 md:flex-col md:items-stretch md:border-b-0 md:border-r md:py-6"
    >
      {/* The logo is a picture, so aria-label gives the link its name for screen readers */}
      <Link href="/" aria-label="Mini Roads" className="mr-auto md:mr-0 md:mb-8 md:px-3">
        <LogoMark />
      </Link>
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            // aria-current tells screen readers which page is the current one
            aria-current={active ? "page" : undefined}
            // Active: ink text + a thin ink bar on the left. Others: muted, ink on hover.
            className={`flex items-center gap-2 border-l-2 px-3 py-2 text-body transition-colors duration-150 ${
              active ? "border-ink font-medium text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
