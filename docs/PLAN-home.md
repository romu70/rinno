# Plan — Home page redesign (rinno.fr)

Follow-up to `docs/PLAN-redesign.md`, whose ground rules apply here too: mobile-first, 768 / 1200 / 1440px breakpoints, rem units, accessibility, no new dependencies, `npm run build` must pass.

**Visual reference:** `docs/mocks/home.html`, approved by the owner on 2026-11-15. Open it in a browser; its images load from `src/assets`. It reuses `docs/mocks/redesign.css`. Where the mock and the shipped project pages differ on type sizes, follow the shipped `global.css` variables (`--text`, `--text-sm`, h1 capped at 100px).

**Scope:** `src/pages/index.astro`, plus small additions to existing components. Work on a branch (`feat/home-redesign`); one commit is enough.

## Page structure (top to bottom)

1. **Hero** (no breadcrumbs, no chapter nav, no reading-progress bar)
   - Under 1200px: portrait first (about 9.5rem wide, 12rem from 768px), then the text.
   - **From 1200px:** two columns, about 1.55fr / 1fr: text on the left, portrait on the right (max about 26rem wide).
   - **Portrait:** a rounded square, 1:1, radius 16px (20px from 1200px), 1px `--line` border, `object-fit: cover`, `object-position: center 25%`. Small photo credit underneath ("Crédit photo : maison Yriss", link kept).
   - **Text:**
     - eyebrow "Product & Design Leader B2B";
     - h1 "Romuald Tisserand";
     - the first pitch paragraph as the lead (`.intro`), with "5 % de son marché en 2 ans (7 pays)" in bold;
     - then the two other pitch paragraphs.
   - **Two CTA buttons:** "Travaux professionnels →" (`/pro`) and "Projets personnels →" (`/perso`). See "Button" below.
   - **Contact strip:** a `<dl>` like the project hero meta (Email, Téléphone, LinkedIn, GitHub). 2 columns on mobile, 4 from 768px.
2. **01 Projets sélectionnés:** 2 `ProjectCard`s, `layout="stack"`, 2 columns from 768px.
   - **Meditect:** category `pro`, year "2021 – 2024", description and metric copied from `/pro`. Its thumbnail is a logo on white: show it whole (see ProjectCard below).
   - **Galleries:** category `perso`, `accent="coral"`, year "2023 – présent", description copied from `/perso`, no metric. Dark image background (#303030), `object-position: top`.
   - **No Novyspec card** (owner's decision).
3. **02 De la tech au produit:** two `Card`s joined by the arrow disc already used between steps.
   - Card 1: label "15 ans", title "De la tech…", existing paragraph.
   - Card 2: label "Depuis 2017" in the accent colour, title "…au produit", existing paragraph. Highlighted with an accent border.
   - Stacked on mobile (the arrow points down), side by side from 768px.
4. **03 Vision & stratégie → exécution produit:** the existing intro line and `list-arrow` list, then `Learnings variant="statement"` with the small caption "Ma conviction" and the existing sentence.
5. **04 Compétences clés:** `LearningsGrid columns={3}`, numbered 01–03, titles Produit / Design / Leadership. Each item's skills are shown as `.tags` pills. **Remove the emojis.**
6. **05 Contact:** a dark block (`--ink` background, radius about 16px, generous padding).
   - Number "05" in `--accent-on-dark`, and the h2 "Pour me joindre et discuter de vos enjeux" in white.
   - The email as a large link (Montserrat 600, clamp about 1.4–2.5rem) with a `--accent-on-dark` underline.
   - Phone, LinkedIn and GitHub as pill links with a translucent white border. No emojis.

Sections keep their small accent number (01–05) above the h2, like the project pages.

## Component work

- **Button** (new: `src/components/Button.astro`, or a global `.btn` class): pill shape, Montserrat 600, arrow that shifts 4px on hover. `variant: 'pro' | 'perso'`.
  - Colour: pro `#4040CC`, perso `#B8344F` (the darker coral, so white text stays at 5.6:1 contrast).
  - **Default:** filled with the colour, white text, 2px border in the same colour.
  - **Hover / focus-visible:** colours swap: `--surface` background, text in the colour, border unchanged (so the size never changes).
- **`ProjectCard`**: add `fit?: 'cover' | 'contain'`.
  - `contain`: white image background, image inset about 12% on each side, whole image visible. Use it for logo thumbnails.
  - Add `imageBg?` (or a `dark` flag) for the Galleries screenshot.
  - Check that the `category` badge and the coral accent render as in the mock.
- **`Section`**: reuse it with `number` and no `id` requirement. No `ChapterNav` on the home page.

## Cleanup in `index.astro`

- Remove the unused `novyspec` thumbnail import, the old `.button*`, `.contact-info`, `.photo-container`, `.caption`, `.centered-link` and `.card-container` styles, and the unused `:global(.content-area…)` / `:global(.keyword…)` rules.
- Keep the `structuredData` (ProfilePage) and the `Layout` props as they are.

## Verification

- `npm run build` passes.
- Manual checks at 390, 768, 1200 and 1440px wide: no horizontal scroll, portrait position as described, cards in 2 columns from 768px.
- Keyboard: buttons and cards reachable, with a visible focus that matches the hover state.
- Lighthouse (mobile) on `/`: Accessibility ≥ 95, no CLS regression (the portrait has width/height).
- Compare with `docs/mocks/home.html` side by side.

## Open points (ask the owner, don't guess)

- **Portrait resolution:** `src/assets/portrait.jpeg` is 600×600px. It is displayed up to about 26rem (about 470px at 18px base), so it will look soft on high-resolution (Retina) screens. Ask for a 1200×1200 export. Until then, keep the current file.
- The contact details appear twice (hero strip + final block), as in the mock. The owner hasn't decided whether to keep both. Ask before removing either.
