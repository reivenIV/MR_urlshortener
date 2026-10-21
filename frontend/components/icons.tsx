// Small inline SVG icons (no icon library needed).
// stroke="currentColor": the icon takes the text color of its parent.
const svgProps = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export function XIcon() {
  return <svg {...svgProps}><path d="M18 6 6 18M6 6l12 12" /></svg>;
}

export function CopyIcon() {
  return (
    <svg {...svgProps}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </svg>
  );
}

export function CheckIcon() {
  return <svg {...svgProps}><path d="M20 6 9 17l-5-5" /></svg>;
}

export function ChevronIcon() {
  return <svg {...svgProps}><path d="m9 18 6-6-6-6" /></svg>;
}

export function PlusIcon() {
  return <svg {...svgProps}><path d="M12 5v14M5 12h14" /></svg>;
}

export function HomeIcon() {
  return (
    <svg {...svgProps}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9v11h14V9" />
    </svg>
  );
}

export function LinkIcon() {
  return (
    <svg {...svgProps}>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </svg>
  );
}
