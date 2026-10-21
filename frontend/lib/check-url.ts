// The one rule for long URLs, used by the "New link" form and the Change URL dialog.
// Returns an error message to show, or null when the URL is OK.
export function checkUrl(text: string): string | null {
  // Basic check: new URL() throws if the text is not a valid URL.
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return "Not a valid URL. Example: https://example.com";
  }
  // Only https:// links. Also blocks "javascript:alert(1)", which would
  // run code when someone opens the short link.
  if (url.protocol !== "https:") {
    return "Only https:// links are allowed.";
  }
  return null;
}
