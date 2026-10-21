import type { ReactNode } from "react";

// One horizontal band of a page: 96px padding top and bottom, a hairline
// divider below, content centered with a max width of 1200px.
// band = diagonal stripes (use it at most once per page).
export default function Section({ band = false, children }: { band?: boolean; children: ReactNode }) {
  return (
    <section className={`border-b border-divider py-24 ${band ? "band" : ""}`}>
      <div className="mx-auto w-full max-w-[1200px] px-6">{children}</div>
    </section>
  );
}
