// Real calls to the backend. Replaces the old fake lib/links.ts.
import type { LinkChanges, Tag, UrlCard, UrlCardWithTags } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3003/v1";

// Small shared fetch wrapper: throws on a non-2xx status, parses JSON only
// when there's actually a body (DELETE /urls/:id comes back empty).
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${init?.method ?? "GET"} ${path} -> ${res.status}: ${body}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as T);
}

// Every card, each with its tags. Already ordered newest-edited-first by the backend.
export async function getLinks(): Promise<UrlCardWithTags[]> {
  return request("/urls/all");
}

export async function deleteLink(id: number): Promise<void> {
  await request(`/urls/${id}`, { method: "DELETE" });
}

// Change title, notes or raw_url. The short code can never change.
export async function updateLink(id: number, changes: LinkChanges): Promise<UrlCard> {
  return request(`/urls/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
}

export async function createLink(raw_url: string): Promise<UrlCard> {
  return request("/urls", { method: "POST", body: JSON.stringify({ raw_url }) });
}

// All existing tags, A→Z (used for the suggestions).
export async function getTags(): Promise<Tag[]> {
  const tags = await request<Tag[]>("/tags/all");
  return [...tags].sort((a, b) => a.name.localeCompare(b.name));
}

// Link a tag to a url by name: reuse it if it already exists, create it otherwise.
// Returns the tag, so the caller can add it to that card's tags in local state
// (there's no single "get one url with its tags" endpoint to re-fetch from).
export async function addTagToLink(url_id: number, name: string, existingTags: Tag[]): Promise<Tag> {
  const lower = name.trim().toLowerCase();
  let tag = existingTags.find((t) => t.name === lower);
  if (!tag) {
    tag = await request<Tag>("/tags", { method: "POST", body: JSON.stringify({ name }) });
  }
  await request("/tags_urls", { method: "POST", body: JSON.stringify({ url_id, tag_id: tag.id }) });
  return tag;
}

// Unlink a tag from a url; the tag itself keeps existing.
export async function removeTagFromLink(url_id: number, tag_id: number): Promise<void> {
  await request("/tags_urls", { method: "DELETE", body: JSON.stringify({ url_id, tag_id }) });
}
