"use client";

import { useState } from "react";
import { MAX_NOTES_LENGTH, MAX_TAG_NAME_LENGTH, MAX_TAGS_PER_URL, MAX_TITLE_LENGTH } from "@/lib/constants";
import type { LinkChanges, Tag, UrlCardWithTags } from "@/lib/types";
import { IconButton } from "./button";
import ChangeUrlDialog from "./change-url-dialog";
import ChipList from "./chip-list";
import EditableText from "./editable-text";
import { CheckIcon, ChevronIcon, CopyIcon, XIcon } from "./icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003/v1";

type Props = {
  link: UrlCardWithTags;
  allTags: Tag[];
  onDelete: () => void;
  onUpdate: (changes: LinkChanges) => void;
  onAddTag: (name: string) => void;
  onRemoveTag: (tagId: number) => void;
};

// One card = one short link. It only displays data and reports user actions
// to its parent (LinksBoard), which talks to the API.
export default function UrlCardView({ link, allTags, onDelete, onUpdate, onAddTag, onRemoveTag }: Props) {
  const [copied, setCopied] = useState(false);
  const [changingUrl, setChangingUrl] = useState(false);

  // Short links are served by the backend, not this app, e.g. http://localhost:3003/aB3x9Qz
  const shortUrl = `${API_URL.replace(/\/v1$/, "")}/${link.short_code}`;

  async function copyShortUrl() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000); // back to the copy icon after 1 second
  }

  // created_at is UTC; toLocaleDateString shows it in the browser's timezone.
  const createdOn = new Date(link.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  let clickLabel = `${link.click_count} clicks`;
  if (link.click_count === 1) {
    clickLabel = "1 click";
  }

  return (
    <article className="relative flex flex-col gap-3 border border-hairline bg-surface p-6">
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete link"
        title="Delete link"
        className="absolute right-4 top-4 p-1 text-muted transition-colors duration-150 hover:text-ink focus-visible:outline-2 focus-visible:outline-ink"
      >
        <XIcon />
      </button>

      <div className="pr-8">
        <EditableText
          value={link.title}
          placeholder="title"
          onSave={(title) => onUpdate({ title })}
          maxLength={MAX_TITLE_LENGTH}
          className="text-xl font-semibold tracking-tight"
        />
        <EditableText
          value={link.notes}
          placeholder="notes"
          onSave={(notes) => onUpdate({ notes })}
          maxLength={MAX_NOTES_LENGTH}
          className="text-body text-muted"
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <IconButton onClick={copyShortUrl} label={copied ? "Copied!" : "Copy short link"}>
          {copied ? <CheckIcon /> : <CopyIcon />}
        </IconButton>
        <span className="truncate font-mono">{shortUrl.replace(/^https?:\/\//, "")}</span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <IconButton onClick={() => setChangingUrl(true)} label="Change URL">
          <ChevronIcon />
        </IconButton>
        {/* truncate = cut with "…"; title = tooltip with the full URL on hover */}
        <span className="truncate text-muted" title={link.raw_url}>
          {link.raw_url}
        </span>
      </div>

      <ChipList
        kind="tag"
        items={link.all_tags}
        allItems={allTags}
        onAdd={onAddTag}
        onRemove={onRemoveTag}
        max={MAX_TAGS_PER_URL}
        nameMaxLength={MAX_TAG_NAME_LENGTH}
      />

      {/* mt-auto pushes this row to the bottom, so cards of different heights line up */}
      <div className="mt-auto flex justify-between pt-2">
        <span className="eyebrow text-muted">{clickLabel}</span>
        <span className="eyebrow text-muted">{createdOn}</span>
      </div>

      {changingUrl && (
        <ChangeUrlDialog
          link={link}
          onSave={(raw_url) => {
            onUpdate({ raw_url });
            setChangingUrl(false);
          }}
          onClose={() => setChangingUrl(false)}
        />
      )}
    </article>
  );
}
