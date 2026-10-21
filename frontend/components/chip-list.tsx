"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { IconButton } from "./button";
import { PlusIcon } from "./icons";
import TextInput from "./text-input";
import { useClickOutside } from "./use-click-outside";

// Anything with an id and a name: a tag.
type Item = { id: number; name: string };

type Props = {
  kind: string; // "tag": used in the placeholder and button labels
  items: Item[]; // items on this card
  allItems: Item[]; // every existing item, for the suggestions
  onAdd: (name: string) => void;
  onRemove: (id: number) => void;
  icon?: ReactNode; // optional small icon shown inside each chip
  max?: number; // once items.length reaches this, the "+" button disappears
  nameMaxLength?: number; // longest a new item's name can be typed
};

// A row of chips + a "+" button that opens a small input with suggestions.
// Used once per card, for tags.
export default function ChipList({ kind, items, allItems, onAdd, onRemove, icon, max, nameMaxLength }: Props) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const atMax = max !== undefined && items.length >= max;

  const close = useCallback(() => {
    setAdding(false);
    setText("");
  }, []);
  useClickOutside(boxRef, adding, close);

  // Suggestions: existing items containing the typed text, not already on this card.
  const query = text.trim().toLowerCase();
  const suggestions = allItems
    .filter((item) => !items.some((own) => own.id === item.id))
    .filter((item) => item.name.toLowerCase().includes(query))
    .slice(0, 5);

  function add(name: string) {
    if (!name.trim()) return;
    onAdd(name.trim()); // the API reuses an existing item or creates a new one
    close();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        // "group" + "group-hover:": the x appears while hovering this chip.
        // opacity-0 (not "invisible") keeps the button reachable with Tab;
        // focus-visible shows it when focused by keyboard, and pointer-coarse
        // always shows it on touch screens, which have no hover.
        <span key={item.id} className="group flex items-center gap-1 border border-hairline px-2 py-0.5 font-mono text-xs">
          {icon}
          {item.name}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${kind} ${item.name}`}
            className="leading-none text-muted opacity-0 transition duration-150 hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100"
          >
            ×
          </button>
        </span>
      ))}

      {items.length === 0 && !adding && <span className="font-mono text-xs text-muted">{kind}s?</span>}

      {adding ? (
        <div ref={boxRef} className="relative">
          <TextInput
            autoFocus
            aria-label={`New ${kind}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") add(text);
              if (e.key === "Escape") close();
            }}
            placeholder={`${kind} name`}
            maxLength={nameMaxLength}
            className="w-32 font-mono text-xs"
          />
          {suggestions.length > 0 && (
            <ul className="absolute left-0 top-full z-30 mt-1 w-40 border border-ink bg-surface">
              {suggestions.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => add(item.name)}
                    className="w-full px-2 py-1 text-left font-mono text-xs hover:bg-hairline focus-visible:bg-hairline focus-visible:outline-none"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : !atMax ? (
        <IconButton onClick={() => setAdding(true)} label={`Add ${kind}`}>
          <PlusIcon />
        </IconButton>
      ) : null}
    </div>
  );
}
