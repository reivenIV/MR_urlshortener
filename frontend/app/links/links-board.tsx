"use client";

import { useEffect, useState } from "react";
import NewLinkForm from "@/components/new-link-form";
import UrlCardView from "@/components/url-card";
import * as api from "@/lib/api";
import type { Tag, UrlCard, UrlCardWithTags } from "@/lib/types";

// The form + grid of cards. Holds the data and calls the real API.
export default function LinksBoard() {
  const [links, setLinks] = useState<UrlCardWithTags[] | null>(null);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    api.getLinks().then(setLinks).catch((err) => {
      let message = "Could not load your links. Try refreshing the page.";
      if (err instanceof Error) {
        message = err.message;
      }
      setLoadError(message);
    });
    api.getTags().then(setAllTags); // tag suggestions are optional: if this fails, the list is just empty
  }, []);

  // A brand-new card has no tags yet, and it's the most recently updated
  // one, so it belongs at the top (the list is sorted newest-updated-first).
  function addCard(created: UrlCard) {
    setLinks((current) => [{ ...created, all_tags: [], click_count: 0 }, ...(current ?? [])]);
  }

  // Put the given card in place of the old one with the same id.
  function replaceCard(updated: UrlCardWithTags) {
    setLinks((current) => {
      if (!current) {
        return current;
      }
      const next: UrlCardWithTags[] = [];
      for (const l of current) {
        if (l.id === updated.id) {
          next.push(updated);
        } else {
          next.push(l);
        }
      }
      return next;
    });
  }

  async function addTag(link: UrlCardWithTags, name: string) {
    const tag = await api.addTagToLink(link.id, name, allTags);
    replaceCard({ ...link, all_tags: [...link.all_tags, tag] });
    setAllTags(await api.getTags()); // the tag may be new: refresh suggestions
  }

  async function removeTag(link: UrlCardWithTags, tagId: number) {
    await api.removeTagFromLink(link.id, tagId);
    const remainingTags: Tag[] = [];
    for (const t of link.all_tags) {
      if (t.id !== tagId) {
        remainingTags.push(t);
      }
    }
    replaceCard({ ...link, all_tags: remainingTags });
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="mt-8">
        <NewLinkForm onCreated={addCard} />
      </div>

      {loadError && (
        <p role="alert" className="mt-16 text-body text-danger">
          {loadError}
        </p>
      )}

      {!links && !loadError && <p className="mt-16 text-body text-muted">Loading…</p>}

      {links && (
        <div className="mt-16 flex flex-col gap-10">
          {/* 1 column on phones, 2 from "md" (768px), 3 from "lg" (1024px).
              gap-6 = 24px of space between cards (same as the page side padding). */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <UrlCardView
                key={link.id}
                link={link}
                allTags={allTags}
                onDelete={() => api.deleteLink(link.id).then(() => setLinks((cur) => cur && cur.filter((l) => l.id !== link.id)))}
                onUpdate={(changes) => api.updateLink(link.id, changes).then((updated) => replaceCard({ ...link, ...updated }))}
                onAddTag={(name) => addTag(link, name)}
                onRemoveTag={(tagId) => removeTag(link, tagId)}
              />
            ))}
          </div>

          {links.length === 0 && <p className="text-body text-muted">No links yet.</p>}
        </div>
      )}
    </div>
  );
}
