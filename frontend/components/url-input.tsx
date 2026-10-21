"use client";

import TextInput from "./text-input";

const PREFIX = "https://";

type Props = {
  value: string; // the full URL, e.g. "https://example.com" — always starts with PREFIX
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
  "aria-label"?: string;
  className?: string; // on the outer box (e.g. flex-1 to grow)
  inputClassName?: string; // on the input itself (padding, text size)
};

// A URL input with "https://" glued to its left as a separate label, not
// part of the input: there's nothing inside the input for the user to
// backspace into, so the protocol can never be deleted or edited.
export default function UrlInput({
  value,
  onChange,
  invalid = false,
  autoFocus,
  "aria-label": ariaLabel,
  className = "",
  inputClassName = "",
}: Props) {
  let rest = value;
  if (rest.startsWith(PREFIX)) {
    rest = rest.slice(PREFIX.length);
  }

  let labelBorder = "border-hairline";
  if (invalid) {
    labelBorder = "border-danger";
  }

  return (
    <div className={`flex ${className}`}>
      <span className={`flex select-none items-center border border-r-0 ${labelBorder} bg-surface px-2 text-muted`}>
        {PREFIX}
      </span>
      <TextInput
        autoFocus={autoFocus}
        aria-label={ariaLabel}
        invalid={invalid}
        value={rest}
        onChange={(e) => onChange(PREFIX + e.target.value)}
        placeholder="example.com"
        className={`-ml-px flex-1 ${inputClassName}`}
      />
    </div>
  );
}
