import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary";
type Size = "md" | "icon";

// The button style, defined ONCE. Also used for links that look like buttons:
//   <Link className={buttonClasses({ variant: "primary" })}>
// primary   = black, ONE per page (the main action)
// secondary = outline, for every other action
export function buttonClasses({ variant = "secondary", size = "md" }: { variant?: Variant; size?: Size } = {}) {
  const base =
    "inline-flex shrink-0 items-center justify-center gap-2 transition duration-150 " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
  const variants = {
    primary: "bg-accent font-medium text-surface hover:opacity-85",
    secondary: "border border-hairline bg-surface text-ink hover:border-ink",
  };
  const sizes = {
    md: "px-[22px] py-[11px] text-body",
    icon: "h-7 w-7",
  };
  return `${base} ${variants[variant]} ${sizes[size]}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

// A <button> with the design's style. Every other prop (onClick, type...) is passed through.
export default function Button({ variant, size, className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`${buttonClasses({ variant, size })} ${className}`} {...props} />;
}

// Square outline button showing only an icon. aria-label names it for screen
// readers; title shows the same text as a tooltip on hover.
export function IconButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <Button size="icon" onClick={onClick} aria-label={label} title={label}>
      {children}
    </Button>
  );
}
