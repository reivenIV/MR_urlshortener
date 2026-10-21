import type { ComponentProps } from "react";

type Props = ComponentProps<"input"> & { invalid?: boolean };

// A text <input> with the design's style, defined ONCE.
// invalid = red border (and tells screen readers the value is wrong).
export default function TextInput({ invalid = false, className = "", ...props }: Props) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={`min-w-0 border bg-surface px-2 py-1 text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ink ${
        invalid ? "border-danger" : "border-hairline"
      } ${className}`}
      {...props}
    />
  );
}
