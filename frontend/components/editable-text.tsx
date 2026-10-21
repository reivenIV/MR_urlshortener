"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { IconButton } from "./button";
import { CheckIcon, XIcon } from "./icons";
import TextInput from "./text-input";
import { useClickOutside } from "./use-click-outside";

type Props = {
  value: string | null;
  placeholder: string; // shown in gray when value is empty
  onSave: (value: string | null) => void;
  className?: string; // text size / weight, used for both the text and the input
  maxLength?: number;
};

// Text that turns into an input on double click (or Enter / F2 with the keyboard).
// Save: ✓ button or Enter. Cancel: ✗ button, Escape, or a click outside.
export default function EditableText({ value, placeholder, onSave, className = "", maxLength }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  // true = give focus back to the text when editing ends (keyboard users
  // would otherwise lose their place). Not after a click outside: the user
  // clicked somewhere else on purpose.
  const refocus = useRef(false);

  const cancel = useCallback(() => setEditing(false), []);
  useClickOutside(boxRef, editing, cancel);

  // Runs after the input is gone and the text is back on screen.
  useEffect(() => {
    if (!editing && refocus.current) {
      textRef.current?.focus();
      refocus.current = false;
    }
  }, [editing]);

  function startEditing() {
    setDraft(value ?? "");
    setEditing(true);
  }

  // End editing from the keyboard or the ✓ / ✗ buttons.
  function finish() {
    refocus.current = true;
    setEditing(false);
  }

  function save() {
    onSave(draft.trim() || null); // empty text is saved as null → placeholder again
    finish();
  }

  if (!editing) {
    return (
      // tabIndex + role="button": reachable with Tab and announced as a button
      // by screen readers; Enter or F2 starts editing.
      <p
        ref={textRef}
        tabIndex={0}
        role="button"
        onDoubleClick={startEditing}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === "F2") startEditing();
        }}
        title="Double-click (or Enter) to edit"
        className={`cursor-text break-words focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${className}`}
      >
        {value || <span className="text-muted">{placeholder}</span>}
      </p>
    );
  }

  return (
    <div ref={boxRef} className="flex items-center gap-1">
      <TextInput
        autoFocus
        aria-label={placeholder}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") save();
          if (e.key === "Escape") finish();
        }}
        maxLength={maxLength}
        className={`flex-1 ${className}`}
      />
      <IconButton onClick={save} label="Save">
        <CheckIcon />
      </IconButton>
      <IconButton onClick={finish} label="Cancel">
        <XIcon />
      </IconButton>
    </div>
  );
}
