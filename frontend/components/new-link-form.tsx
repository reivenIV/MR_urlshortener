"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as api from "@/lib/api";
import { checkUrl } from "@/lib/check-url";
import type { UrlCard } from "@/lib/types";
import Button from "./button";
import UrlInput from "./url-input";

type Props = {
  // Links passes this in, to add the new card straight to its own list.
  // Home doesn't have a list to update, so it's left out there.
  onCreated?: (url: UrlCard) => void;
};

// "[ https://... ] [ New link ]", used on Home and on Links.
export default function NewLinkForm({ onCreated }: Props) {
  const router = useRouter();
  const [longUrl, setLongUrl] = useState("https://");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    const value = longUrl.trim();
    const problem = checkUrl(value);
    if (problem) {
      setError(problem);
      return;
    }
    try {
      const created = await api.createLink(value);
      setLongUrl("https://"); // ready for the next one
      if (onCreated) {
        onCreated(created);
      } else {
        router.push("/links"); // no list here (Home): go see it there instead
      }
    } catch (err) {
      // the frontend's own check passed, but the backend rejected it anyway
      // (e.g. a host with no real domain, like "hello")
      let message = "Something went wrong. Try again.";
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // stay on the page instead of submitting the form
        submit();
      }}
      className="flex w-full max-w-[40rem] flex-col gap-2"
    >
      {/* Phones: input above the button. From "sm" (640px): side by side. */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <UrlInput
          aria-label="Long URL"
          invalid={error !== null}
          value={longUrl}
          onChange={(value) => {
            setLongUrl(value);
            setError(null); // hide the error as soon as the user types
          }}
          className="flex-1"
          inputClassName="px-3 py-[11px] text-body"
        />
        {/* The one primary button of the page */}
        <Button type="submit" variant="primary">
          New link
        </Button>
      </div>
      {/* role="alert": screen readers read the error out as soon as it appears */}
      {error && (
        <p role="alert" className="text-body text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
