"use client";

import { useCallback, useRef, useState } from "react";
import { IconButton } from "./button";
import { PlusIcon } from "./icons";
import TextInput from "./text-input";
import { useClickOutside } from "./use-click-outside";

// A tag: just an id and a name.
type Item = { id: number; name: string };

type Props = {
  items: Item[]; // tags on this card
  allItems: Item[]; // every existing tag, for the suggestions
  onAdd: (name: string) => void;
  onRemove: (id: number) => void;
  max?: number; // once items.length reaches this, the "+" button disappears
  nameMaxLength?: number; // longest a new tag's name can be typed
};

// A row of tag chips + a "+" button that opens a small input with suggestions.
// Used once per card.
export default function ChipList({ items, allItems, onAdd, onRemove, max, nameMaxLength }: Props) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const atMax = max !== undefined && items.length >= max;

  const close = useCallback(() => {
    setAdding(false);
    setText("");
  }, []);
  useClickOutside(boxRef, adding, close);

  // Suggestions: existing tags containing the typed text, not already on this
  // card. Stops once it has 5.
  const query = text.trim().toLowerCase();
  const suggestions: Item[] = [];
  for (const item of allItems) {
    let alreadyOnCard = false;
    for (const own of items) {
      if (own.id === item.id) {
        alreadyOnCard = true;
        break;
      }
    }
    if (alreadyOnCard) {
      continue;
    }
    if (!item.name.toLowerCase().includes(query)) {
      continue;
    }
    suggestions.push(item);
    if (suggestions.length === 5) {
      break;
    }
  }

  function add(name: string) {
    if (!name.trim()) return;
    onAdd(name.trim()); // the API reuses an existing tag or creates a new one
    close();
  }

  // The box on the right: the add-tag input (while adding), the "+" button
  // (below the max), or nothing (at the max).
  let addControl = null;
  if (adding) {
    addControl = (
      <div ref={boxRef} className="relative">
        <TextInput
          autoFocus
          aria-label="New tag"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add(text);
            if (e.key === "Escape") close();
          }}
          placeholder="tag name"
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
    );
  } else if (!atMax) {
    addControl = (
      <IconButton onClick={() => setAdding(true)} label="Add tag">
        <PlusIcon />
      </IconButton>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((item) => (
        // "group" + "group-hover:": the x appears while hovering this chip.
        // opacity-0 (not "invisible") keeps the button reachable with Tab;
        // focus-visible shows it when focused by keyboard, and pointer-coarse
        // always shows it on touch screens, which have no hover.
        <span key={item.id} className="group flex items-center gap-1 border border-hairline px-2 py-0.5 font-mono text-xs">
          {item.name}
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove tag ${item.name}`}
            className="leading-none text-muted opacity-0 transition duration-150 hover:text-ink focus-visible:opacity-100 group-hover:opacity-100 pointer-coarse:opacity-100"
          >
            ×
          </button>
        </span>
      ))}

      {items.length === 0 && !adding && <span className="font-mono text-xs text-muted">tags?</span>}

      {addControl}
    </div>
  );
}
