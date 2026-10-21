"use client";

import { useEffect, useRef, useState } from "react";
import { checkUrl } from "@/lib/check-url";
import type { UrlCard } from "@/lib/types";
import Button from "./button";
import UrlInput from "./url-input";

type Props = {
  link: UrlCard;
  onSave: (raw_url: string) => Promise<void>;
  onClose: () => void;
};

// Popup to replace the original URL. The short code stays the same.
export default function ChangeUrlDialog({ link, onSave, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [newUrl, setNewUrl] = useState("https://");
  const [error, setError] = useState<string | null>(null);

  // showModal(): the browser's built-in popup, with a backdrop. Escape closes it.
  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  async function submit() {
    const value = newUrl.trim();
    const problem = checkUrl(value);
    if (problem) {
      setError(problem);
      return;
    }
    try {
      await onSave(value);
    } catch (err) {
      // the frontend's own check passed, but the backend rejected it anyway
      let message = "Something went wrong. Try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[min(32rem,calc(100%-2rem))] border border-hairline bg-surface p-8 text-ink backdrop:bg-ink/40"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault(); // stay on the page instead of submitting the form
          submit();
        }}
        className="flex flex-col gap-5"
      >
        <h2 className="text-2xl font-semibold tracking-tight">Change URL</h2>
        <p className="text-body text-muted">
          Short code <code className="border border-hairline px-1 font-mono text-ink">{link.short_code}</code> stays the same.
        </p>
        <div className="flex flex-col gap-1">
          <p className="eyebrow text-muted">Current URL</p>
          <p className="text-body break-all">{link.raw_url}</p>
        </div>
        <label className="flex flex-col gap-1">
          <span className="eyebrow text-muted">New URL</span>
          <UrlInput
            autoFocus
            invalid={error !== null}
            value={newUrl}
            onChange={(value) => {
              setNewUrl(value);
              setError(null);
            }}
            inputClassName="py-2 text-body"
          />
        </label>
        {/* role="alert": screen readers read the error out as soon as it appears */}
        {error && (
          <p role="alert" className="text-body text-danger">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>Cancel</Button>
          {/* The one primary button of this popup */}
          <Button type="submit" variant="primary">
            Save
          </Button>
        </div>
      </form>
    </dialog>
  );
}
