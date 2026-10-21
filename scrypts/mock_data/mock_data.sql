-- Mock data for local dev/testing. Wipes urls/tags/tags_urls/url_clicks and reloads them.
-- Run via scrypts/mock_data/mock_data.sh, not directly (that script finds the container + credentials).

TRUNCATE urls, tags, url_clicks, tags_urls RESTART IDENTITY;

INSERT INTO tags (name, color) VALUES
  ('youtube', '#808080'),
  ('test', '#808080'),
  ('work', '#808080'),
  ('docs', '#808080'),
  ('react', '#808080'),
  ('music', '#808080'),
  ('news', '#808080'),
  ('to-read', '#808080');

-- short_code is 7 chars, same as what the real create-url flow generates.
-- A couple of updated_at values are set later than created_at on purpose,
-- so the list (ordered by updated_at desc) visibly shows an "edited" item
-- jumping above newer-but-untouched ones.
INSERT INTO urls (raw_url, short_code, title, notes, created_at, updated_at) VALUES
  ('https://www.youtube.com/watch?v=jfKfPfyJRdk', 'aB3x9Qz', 'Lo-fi beats', 'music to focus', '2026-10-11 08:30:00+00', '2026-10-11 08:30:00+00'),
  ('https://www.amazon.com/Sony-WH-1000XM5-Wireless-Canceling-Headphones/dp/B09XS7JWHH/ref=sr_1_3?crid=2QK8VPRE5JU9L&dib=eyJ2IjoiMSJ9.xKcQZmF3RtYbHn2LpQ&dib_tag=se&keywords=noise+cancelling+headphones&qid=1735689600&sprefix=noise+cancel%2Caps%2C182&sr=8-3&th=1', 'bbZZ9Qz', 'Lo-fi beats', 'music to focus', '2026-10-11 08:30:00+00', '2026-10-11 08:30:00+00'),
  ('https://search.brave.com/search?q=please+give+me+an+exemple+of+a+long+url', 'AABB9Qz', 'Lo-fi beats', 'music to focus', '2026-10-11 08:30:00+00', '2026-10-11 08:30:00+00'),
  ('https://nextjs.org/docs/app/getting-started', 'Kp9wL2m', 'Next.js docs', 'App Router guide', '2026-10-12 16:05:00+00', '2026-10-12 16:05:00+00'),
  ('https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7', 'zT4nQ8r', 'Prisma 7 upgrade', NULL, '2026-10-12 09:12:00+00', '2026-10-20 09:00:00+00'),
  ('https://news.ycombinator.com/', 'm3Xv7Pa', NULL, NULL, '2026-10-13 21:47:00+00', '2026-10-13 21:47:00+00'),
  ('https://docs.google.com/document/d/1aBcDeFgHiJkLmNoPqRsTuVwXyZ/edit', 'Qw8eR2t', 'Team standup notes', 'shared doc for the daily', '2026-10-13 07:58:00+00', '2026-10-13 07:58:00+00'),
  ('https://react.dev/reference/react/useEffect', 'Lm5nB6v', 'React useEffect', 'when to use it, and when not', '2026-10-14 14:20:00+00', '2026-10-14 14:20:00+00'),
  ('https://www.youtube.com/playlist?list=PL8F6B0753B2CCA128', 'Hj2kL9p', 'Jazz playlist', NULL, '2026-10-14 10:03:00+00', '2026-10-14 10:03:00+00'),
  ('https://tailwindcss.com/docs/grid-template-columns', 'Yt6uI3o', 'Tailwind grid', 'grid-cols responsive', '2026-10-15 18:40:00+00', '2026-10-15 18:40:00+00'),
  ('https://www.bbc.com/news/technology', 'Rf7gT1y', NULL, 'check later', '2026-10-15 08:15:00+00', '2026-10-15 08:15:00+00'),
  ('https://docs.docker.com/compose/how-tos/startup-order/', 'Vb4nM8k', 'Docker Compose', 'healthcheck + depends_on', '2026-10-16 19:27:00+00', '2026-10-16 19:27:00+00'),
  ('https://www.postgresql.org/docs/17/indexes-types.html', 'Ws3dF5g', 'Postgres indexes', NULL, '2026-10-16 11:52:00+00', '2026-10-16 11:52:00+00'),
  ('https://example.com/', 'Xc9vB2n', 'Test link', 'just a test', '2026-10-17 15:33:00+00', '2026-10-17 15:33:00+00'),
  ('https://www.youtube.com/watch?v=8pDqJVdNa44', 'Pl0oK9i', 'Conference talk', 'the one about caching', '2026-10-17 09:01:00+00', '2026-10-17 09:01:00+00'),
  ('https://docs.nestjs.com/modules', 'Ju7hY6t', 'NestJS modules', NULL, '2026-10-18 17:44:00+00', '2026-10-18 17:44:00+00'),
  ('https://www.theguardian.com/international', 'Gf5dS4a', NULL, NULL, '2026-10-18 07:30:00+00', '2026-10-18 07:30:00+00'),
  ('https://www.example-shop.com/products/category/electronics/headphones/wireless-noise-cancelling-over-ear?utm_source=newsletter&utm_medium=email&utm_campaign=autumn_sale_2026&ref=homepage_banner', 'Nb8vC7x', 'Long URL example', 'tracking params everywhere', '2026-10-19 20:10:00+00', '2026-10-21 10:00:00+00');

-- link urls to tags by short_code/name, so this doesn't depend on guessing ids.
-- (2 urls are left with no tags on purpose, to see the "tags?" placeholder.)
INSERT INTO tags_urls (url_id, tag_id)
SELECT u.id, t.id FROM urls u, tags t WHERE (u.short_code, t.name) IN (
  ('aB3x9Qz', 'youtube'), ('aB3x9Qz', 'music'),
  ('Kp9wL2m', 'docs'), ('Kp9wL2m', 'react'),
  ('zT4nQ8r', 'docs'),
  ('Qw8eR2t', 'work'),
  ('Lm5nB6v', 'react'), ('Lm5nB6v', 'docs'),
  ('Hj2kL9p', 'music'), ('Hj2kL9p', 'youtube'),
  ('Yt6uI3o', 'docs'),
  ('Rf7gT1y', 'news'), ('Rf7gT1y', 'to-read'),
  ('Vb4nM8k', 'docs'), ('Vb4nM8k', 'work'),
  ('Ws3dF5g', 'docs'),
  ('Xc9vB2n', 'test'),
  ('Pl0oK9i', 'youtube'), ('Pl0oK9i', 'work'),
  ('Ju7hY6t', 'docs'), ('Ju7hY6t', 'work'),
  ('Gf5dS4a', 'news'),
  ('Nb8vC7x', 'test')
);

-- one url_clicks row per click, spread at random points between the url's
-- creation and now; amount_clicks (= count of these rows) varies per url,
-- including one url left at 0 to see that case too.
INSERT INTO url_clicks (url_id, clicked_at)
SELECT u.id, u.created_at + (random() * (now() - u.created_at))
FROM urls u
JOIN (VALUES
  ('aB3x9Qz', 42),
  ('Kp9wL2m', 17),
  ('zT4nQ8r', 5),
  ('m3Xv7Pa', 128),
  ('Qw8eR2t', 63),
  ('Lm5nB6v', 21),
  ('Hj2kL9p', 9),
  ('Yt6uI3o', 14),
  ('Rf7gT1y', 3),
  ('Vb4nM8k', 27),
  ('Ws3dF5g', 11),
  ('Xc9vB2n', 0),
  ('Pl0oK9i', 56),
  ('Ju7hY6t', 19),
  ('Gf5dS4a', 2),
  ('Nb8vC7x', 7)
) AS counts(short_code, amount) ON u.short_code = counts.short_code,
LATERAL generate_series(1, counts.amount) AS click_number
WHERE counts.amount > 0;
