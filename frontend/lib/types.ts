// Shapes of the data, matching the real backend exactly:
// snake_case names, int ids, dates as UTC text (JSON has no Date type).

// One row of the "tags" table.
export type Tag = {
  id: number;
  name: string;
  color: string; // hex, e.g. "#808080" (not displayed yet: chips are gray)
};

// One row of the "urls" table.
export type UrlCard = {
  id: number;
  title: string | null;
  notes: string | null;
  short_code: string; // 7 characters, case-sensitive, never changes
  raw_url: string;
  created_at: string; // UTC, e.g. "2026-10-15T08:30:00.000Z"
  updated_at: string;
};

// What GET /urls/all sends: a UrlCard plus its tags and click count. PATCH/POST
// /urls don't send these, only this one list endpoint does.
export type UrlCardWithTags = UrlCard & { all_tags: Tag[]; click_count: number };

// The fields of a link the user can edit (what PATCH /urls/:id sends).
export type LinkChanges = Partial<Pick<UrlCard, "title" | "notes" | "raw_url">>;
