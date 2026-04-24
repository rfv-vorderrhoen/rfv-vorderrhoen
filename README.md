# RFV Vorderrhön Website

## Stack
- Astro
- TypeScript
- Tailwind CSS 4
- React for small interactive components
- Astro Content Collections for editorial content

## Local workflow
```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
```

Use `pnpm dev` while editing content and `pnpm build` before publishing. The build runs `astro check` and then creates the static site.

## Where content lives
Most editor-managed content lives in `src/content/`:

- `src/content/pages/`: standalone pages like `/training`, `/about-club`, `/contact`
- `src/content/news/`: news posts and event pages
- `src/content/horses/`: horse profile cards and detail pages
- `src/content/pricing/`: membership cards for `/pricing`

Shared media usually lives in:

- `assets/`: images and PDFs referenced from markdown content
- `public/`: files that must be served at a fixed public URL

## Quick reference

### Add a normal page
1. Create a new markdown file in `src/content/pages/`.
2. Add frontmatter with at least `title`, `description`, and `slug`.
3. Write the page body in regular markdown.
4. If the page should appear in the main navigation or footer, also update `src/lib/site.ts`.

### Add a news post
1. Create a new markdown file in `src/content/news/`.
2. Add frontmatter with at least `title`, `description`, and `date`.
3. Write the article body in markdown.
4. Set `isEvent: true` if it should show in the event area instead of the article area.

### Add a horse
1. Create a new markdown file in `src/content/horses/`.
2. Fill in the required frontmatter fields.
3. Do not rely on markdown body text there: the current templates use frontmatter only.

### Add a membership
1. Create a new markdown file in `src/content/pricing/`.
2. Fill in the frontmatter fields.
3. Do not rely on markdown body text there: the current cards use frontmatter only.

## Content collections in detail

### `pages`
Files in `src/content/pages/` are rendered by `src/pages/[slug].astro` and `src/layouts/ContentPageLayout.astro`.

Use this for normal informational pages such as training, about, privacy, legal, or contact-page intro text.

Minimal example:

```md
---
title: Ferienprogramm
description: Informationen zum Ferienangebot des Vereins.
slug: ferienprogramm
seoTitle: Ferienprogramm | RFV Vorderrhön
seoDescription: Alle Infos zum Ferienprogramm des RFV Vorderrhön.
---

## Ablauf

Hier steht der eigentliche Seiteninhalt in Markdown.
```

Important notes:

- The page URL is controlled by `slug`.
- Adding a page file does not automatically add it to the header or footer navigation.
- To add a link to the menus, update `mainNav` and optionally `footerNav` in `src/lib/site.ts`.
- `draft: true` hides pages rendered through `src/pages/[slug].astro`.

Optional page frontmatter supported by the collection schema:

- `eyebrow`
- `draft`
- `seoTitle`
- `seoDescription`
- `ctaEyebrow`
- `ctaTitle`
- `ctaPrimaryLabel`
- `ctaPrimaryUrl`
- `ctaSecondaryLabel`
- `ctaSecondaryUrl`

The CTA fields are mainly used by the horses overview page.

### Special page files
Some page files are attached to special layouts or extra UI:

- `src/content/pages/mitgliedschaften.md`
  Keep `slug: pricing` if you want the page to stay at `/pricing`.
  The markdown body is only the intro text.
  The actual membership cards come from `src/content/pricing/`.

- `src/content/pages/pferde.md`
  This controls the intro and CTA text for `/pferde`.
  The horse cards themselves come from `src/content/horses/`.

- `src/content/pages/faq.md`
  The accordion questions are not stored in markdown.
  They currently live in `faqItems` inside `src/lib/site.ts`.

- `src/content/pages/contact.md`
  The page body is markdown, but email, phone, social links, and map data come from `src/lib/site.ts`.

- `src/content/pages/probetraining-anfragen.md`
  The page body is optional intro text.
  The embedded Google Form URL comes from `siteConfig.signupFormUrl` in `src/lib/site.ts`.

### `news`
Files in `src/content/news/` create detail pages under `/news/<filename>/` and feed both the homepage and the `/news` overview.

#### News article example

```md
---
title: Saisonstart im Verein
description: Ein kurzer Rückblick auf unseren Saisonstart.
date: 2026-05-10
seoTitle: Saisonstart im Verein | RFV Vorderrhön
seoDescription: Rückblick auf den Saisonstart beim RFV Vorderrhön.
---

Hier steht der Artikeltext.
```

#### Event example

```md
---
title: Sommerfest
description: Unser Sommerfest mit Showprogramm und Verpflegung.
date: 2026-08-15
isEvent: true
eventStart: 2026-08-15
eventEnd: 2026-08-15
image: "../../../assets/sommerfest.jpg"
imageAlt: Besucherinnen und Besucher beim Sommerfest
seoTitle: Sommerfest | RFV Vorderrhön
seoDescription: Alle Infos zum Sommerfest des RFV Vorderrhön.
---

Hier steht der Eventtext.
```

Important notes:

- `date` is required and should use `YYYY-MM-DD`.
- Set `isEvent: true` for anything that belongs in the event planner and event list.
- If you use `eventStart` or `eventEnd`, you must provide both.
- `eventEnd` must be after `eventStart`.
- `draft: true` hides the entry from the site.
- `image` in news frontmatter uses Astro's content image handling and should be a path relative to the markdown file.

How news placement currently works:

- `/news` shows upcoming events separately from normal articles.
- The homepage shows up to 3 entries total.
- Upcoming events are shown first on the homepage, ordered by nearest upcoming date.
- After upcoming events, the homepage fills remaining slots with the latest non-event news posts.

### `horses`
Files in `src/content/horses/` power the horse overview and the individual `/pferde/<slug>/` pages.

Example:

```md
---
name: Luna
description: Luna unterstützt vor allem ruhige Einsteigergruppen.
ageLabel: 12 Jahre
role: Vereinspferd für Einsteigergruppen
race: Haflinger
clubSince: "2024"
image: /horses/luna.jpg
imageAlt: Luna im Profilbild
featured: true
order: 6
seoTitle: Luna | Unsere Pferde
seoDescription: Lerne Luna und ihre Rolle im Verein kennen.
---
```

Important notes:

- The current horse templates use frontmatter only. Body markdown is not rendered on the horse pages.
- `order` controls the order on `/pferde`.
- If at least one horse has `featured: true`, the homepage horse rail only shows featured horses.
- If no horse is marked as featured, the homepage falls back to all horses.

Image gotcha:

- Existing horse images are partly mapped manually in `src/components/horses/HorseVisual.astro`.
- For a newly added horse, the safest no-code option is to put the image in `public/` and reference it with an absolute path like `/horses/luna.jpg`.
- If you want to keep horse images in `assets/`, also extend the import map in `src/components/horses/HorseVisual.astro`.

### `pricing`
Files in `src/content/pricing/` render the membership cards on `/pricing`.

Example:

```md
---
name: Zweimal pro Woche
groupLabel: Aktive Trainingsmitgliedschaft
description: Aktive Teilnahme für Gruppen mit zwei festen Terminen pro Woche.
features:
  - Zwei feste Trainingseinheiten pro Woche
  - Ergänzt die Vereinsmitgliedschaft
  - Für regelmäßige aktive Teilnahme
highlighted: true
order: 6
---
```

Important notes:

- The current membership cards use frontmatter only. Body markdown is not rendered in the cards.
- `order` controls the order inside each membership group.
- `highlighted: true` adds the "Empfohlen" badge.
- `groupLabel` decides where the card appears.

Current grouping rules in `src/layouts/ContentPageLayout.astro`:

- `Vereinsmitgliedschaft` -> section "Vereinsmitgliedschaft"
- `Aktive Trainingsmitgliedschaft` -> section "Aktive Teilnahme"
- Any other value -> section "Weitere Optionen"

## Markdown writing guide
All regular page and news content supports standard markdown:

- headings with `##` and `###`
- paragraphs
- bullet lists
- numbered lists
- links
- images
- PDF embeds

### Normal links

```md
[Zur Anmeldung](https://example.com)
```

### Image embeds
This project supports Obsidian-style embeds in markdown:

```md
![[../../../assets/Werbung_Aktionstag_KRB.jpeg|Alt text]]
![[../../../assets/Werbung_Aktionstag_KRB.jpeg|Alt text|1200]]
![[../../../assets/Werbung_Aktionstag_KRB.jpeg|Alt text|1200x800]]
```

For images:

- the first option after the file path is used as alt text
- a single number sets the image width
- `widthxheight` sets both width and height

### PDF embeds
PDFs can be embedded with the same Obsidian-style syntax:

```md
![[../../../assets/zeiteinteilung.pdf|Zeiteinteilung]]
![[../../../assets/zeiteinteilung.pdf|Zeiteinteilung|720]]
![[../../../assets/zeiteinteilung.pdf|Zeiteinteilung|900x720]]
```

For PDFs:

- without a size, the site renders a compact document card with `PDF öffnen` and `PDF herunterladen`
- a single number sets the inline preview height
- `widthxheight` sets inline preview max width and height
- local PDFs can stay in `assets/`; they are copied to a public path automatically during build/dev

## Site-wide content in code
Not all editable content lives in markdown. These files also contain content:

- `src/lib/site.ts`
  Contact data, social links, navigation labels, footer links, FAQ entries, and some shared marketing text.

- `src/pages/index.astro`
  Large parts of the homepage copy and layout.

- `src/components/home/HeroMotion.tsx`
  Homepage hero text and buttons.

If you add a new markdown page and want it linked from the site navigation, you must update `src/lib/site.ts`.

## Recommended content workflow
1. Add or edit the relevant file in `src/content/`.
2. Add any required images or PDFs.
3. Start the dev server with `pnpm dev`.
4. Check the actual route in the browser.
5. Run `pnpm build`.

## Common mistakes
- Forgetting `slug` on a page in `src/content/pages/`
- Expecting a new page to appear in the menu without updating `src/lib/site.ts`
- Using the wrong relative path to an image or PDF
- Setting only `eventStart` or only `eventEnd`
- Using the wrong `groupLabel` for a membership card
- Writing body markdown for horses or memberships and expecting it to show up
