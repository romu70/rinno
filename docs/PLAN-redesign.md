# Plan — Project-page redesign (rinno.fr)

## Context

Project pages (`src/pages/pro/**`, `src/pages/perso/**`) are long case studies built from `Row > Section > Column` plus `Figure`, `Quote`, `Learnings`, `Keywords` and `Accordion`. They are wrapped by `ProjectPro` / `ProjectPersonal`, which both use `ProjectBase` (hero, key figures, breadcrumbs, previous/next navigation).

Goal: a cleaner, more editorial layout that **removes the accordion** and makes long pages easy to navigate.

**Visual reference:** `docs/redesign-reference.html`, a static mock of the redesigned Meditect page. Open it in a browser: it is the source of truth for colours, type, spacing and behaviour. Reuse its CSS values (converted to rem); don't copy its markup wholesale.

## Ground rules

- Follow `CLAUDE.md`: **mobile-first**, breakpoints **768 / 1200 / 1440px**, relative units (rem, %), base font size 14 / 16 / 18px as already set in `global.css`.
- Work on a branch: `feat/project-page-redesign`. One commit per phase. `npm run build` must pass after each phase.
- Keep content and URLs unchanged. **No copy edits** unless the owner approves them (see "Open decisions").
- Keep the brand: Montserrat (headings, UI) + Cormorant Garamond (body), indigo accent `#4040CC`, coral `#CC4060` as the second accent.
- Accessibility is required: real `<button>`/`<a>`, visible focus, text contrast ≥ 4.5:1, keyboard support for tabs and the lightbox, `prefers-reduced-motion` respected.
- No new dependencies and no JS framework. Client JS stays small, vanilla, in Astro `<script>` tags.

## Current inventory (checked 2026-11-13)

| File | Used by | Action |
|---|---|---|
| `layouts/Layout.astro` | everything | improve |
| `layouts/ProjectBase.astro` | ProjectPro, ProjectPersonal | improve (new structure) |
| `layouts/ProjectPro.astro`, `ProjectPersonal.astro` | project pages | keep (pass new props through) |
| `layouts/ProjectsLanding.astro` | `/pro`, `/perso` | restyle only |
| `components/Header.astro`, `Footer.astro` | Layout | improve |
| `components/Breadcrumbs.astro` | ProjectBase, ProjectsLanding | restyle |
| `components/ProjectCard.astro` | 5 pages | improve |
| `components/project/Section.astro` | 11 pages | improve (`id`, `number`) |
| `components/project/Row.astro` | 11 pages | **keep**: it groups a Section with its Quotes, Learnings, Accordion… (0 to 2 Sections per Row) |
| `components/project/Column.astro` | 11 pages | improve (grid) |
| `components/project/Figure.astro` | 10 pages | improve (`clickable` → lightbox) |
| `components/project/KeyFigures.astro` | ProjectBase | improve |
| `components/project/Learnings.astro` | 11 pages | improve → variants |
| `components/project/Quote.astro` | 7 pages | improve |
| `components/project/Keywords.astro` | 9 pages | restyle (pills) |
| `components/project/FigmaEmbed.astro` | logistock, designsystem | keep; check that it fits the new content width |
| `components/project/Accordion.astro` | 8 uses on 5 pages | **remove** (Phase 4) |
| `components/Home.astro`, `UnderConstruction.astro` | nothing | **remove** |
| `components/Link.astro` | `legal.astro` | replace with a plain `<a>`, then remove; it uses an unloaded font, MuseoModerno |
| `components/LinkIcon.astro`, `SEO.astro` | — | keep |

## Phase 1 — Foundations

**`src/styles/global.css`**
- Add variables (values from the reference): `--paper`, `--surface`, `--soft`, `--line`, `--ink`, `--body`, `--muted #5E5E78`, `--accent-soft`, `--coral-soft`, `--green`, `--green-soft`, `--sans`, `--serif`, `--wrap`.
- Fix the `--color-ligthest` typo: rename it and update every usage.
- Type scale: h1–h4 in Montserrat 600 with negative letter-spacing; body text in Cormorant at about 1.3rem / 1.55 line-height. Keep the existing 768/1440 media queries and adjust their values.
- Replace the `* { font-family }` rule with `body { font-family }`.
- Add `html { scroll-behavior: smooth; scroll-padding-top: 6rem }`, a `:focus-visible` outline, a `prefers-reduced-motion` reset.
- Add utility classes `.numbered` (numbered circles) and `.tag` (pill). Keep `.list-arrow` and `.learnings-title` (both still in use).
- Remove `.flex-row` and `.subsections-flex` (nothing uses them).

**`layouts/Layout.astro`**: remove the `main` top/bottom padding that only existed to clear the fixed header and footer.

**`Header.astro`**: sticky, full-width bar with a translucent, blurred background. Name on the left ("Romuald Tisserand — Product & Design", short version under 768px), nav on the right, `aria-current="page"` with an accent underline. A bottom border appears once the page scrolls. Optional `progress` prop: a 2px reading-progress bar, used on project pages only.

**`Footer.astro`**: no longer fixed. A static row at the end of the page with a top border.

Remove `.glass-effect` from `global.css` once neither Header nor Footer uses it.

**`legal.astro`**: replace `<Link>` with `<a>`, remove the MuseoModerno rule, delete `Link.astro`. Delete `Home.astro` and `UnderConstruction.astro`.

**Done when:** every page renders and the header and footer never cover content, at all breakpoints.

## Phase 2 — New components (`src/components/project/`)

| Component | Props | Notes |
|---|---|---|
| `ProjectHero` | `eyebrow?`, `title`, `lede?`, `meta?: {label, value, href?}[]`, `image?`, `externalLink?` | Extracted from `ProjectBase`. Big title (clamp, about 3.5–7.5rem). Meta is a `<dl>`: 2 columns on mobile, 4 from 768px. Cover image at 2:1. Replaces the current overlay-on-image hero; `heroOverlayPosition` becomes obsolete. |
| `ChapterNav` | `items: {id, label}[]` | Mobile-first: a sticky, horizontally scrollable row of chips under the header. **From 1200px**: a sticky sidebar, numbered 01, 02…, active item marked by an accent left border. Highlights the section in view with `IntersectionObserver` (`rootMargin: '-35% 0px -60% 0px'`). |
| `Tabs` + `TabPanel` | `Tabs: label`; `TabPanel: id, title` | WAI-ARIA tabs pattern (`tablist`/`tab`/`tabpanel`, roving `tabindex`, ← → Home End keys). Segmented-pill style. Without JS, all panels show stacked. A panel is image + text side by side from 768px, stacked below. |
| `Lightbox` | — | A single `<dialog>`, rendered once in `ProjectBase`. Closes on Esc, backdrop click or the close button. Returns focus to the trigger. |
| `FactGrid` | `items: {label, value}[]` | `<dl>`: 1 column on mobile, 2×2 from 768px. |
| `BeforeAfter` | `before`, `after` (`{image, alt, label}`), `note` slot | Two figures with ✕ coral / ✓ green chips. |
| `Card` | `title?` | White surface, border, radius. Used in pairs (Challenge / Vision). |
| `LearningsGrid` + `Learning` | `n`, `title` | Numbered grid: 1 column on mobile, 2 from 768px. |
| `NextProject` | `label`, `title`, `href` | Replaces the prev/next block in `ProjectBase`. Keep both directions. |

## Phase 3 — Upgrade existing components

- **`ProjectBase`**: structure = `Breadcrumbs` → `ProjectHero` → `KeyFigures` → content grid (`ChapterNav` | `<slot />`, content max about 50rem; sidebar only from 1200px) → `NextProject`. Include `Lightbox`. Turn on the header's `progress`. Build `ChapterNav` items from new props or by collecting the `Section`s that have an `id`; choose the simplest reliable approach and document it.
- **`Section`**: add optional `id` and `number`. When `number` is set, render it small, in the accent colour, above the h2. Generous bottom spacing (about 7rem desktop, 5rem mobile). Keep the existing props.
- **`KeyFigures`**: big number, optional new `unit` field (smaller, accent colour), muted label, vertical separators (stacked on mobile). Existing `value` strings must keep rendering unchanged.
- **`Learnings`**: add `variant?: 'default' | 'statement' | 'impact' | 'note'`. `default` keeps today's look, so the home page and untouched pages don't change.
  - `statement`: Cormorant italic, large, accent left border.
  - `impact`: dark background, light text.
  - `note`: coral-soft background.
- **`Quote`**: large accent quotation mark, italic quote, author name; add an optional `role` prop shown on its own line.
- **`Figure`**: when `clickable` is set, open the `Lightbox` instead of a new tab. Add optional `ratio` and `fit` (`cover` | `contain`). Keep Astro `<Image>` optimisation and the existing props.
- **`ProjectCard`**: add an optional `metric` (or reuse `bottomText`) and a "Deep-dive →" call to action, plus a hover state (accent border, slight lift, soft shadow).
- **`Column`**: switch to CSS grid with `minmax(0, 1fr)`. Keep `fullWidth`, `alignWithContent` and `headingLevel`.
- **`Breadcrumbs`, `Keywords`, `ProjectsLanding`**: restyle only (light separators; keywords as pills).

## Phase 4 — Remove the accordion, page by page

There are 8 Accordion uses. **Do not convert them blindly.** First produce this table for the owner and **wait for approval**:

| Page | Accordion title | Content summary | Proposal: `Tabs` / show inline / other |
|---|---|---|---|
| meditect/index | Artefacts de la stratégie produit (h3) | | **Tabs** (already agreed: Segmentation / Mapping / Roadmap / Sprint) |
| novyspec | En savoir plus sur l'atelier persona (h3) | | |
| novyspec | Voir plus d'informations sur la conception (h3) | | |
| novyspec | Succès & Echecs (h2) | | |
| smartrx/tageditor | Evolutions du concept (h3) | | |
| smartrx/index | DesignOps (h2) | | |
| perso/thot | Aller plus loin sur cette recherche (h3) | | |
| perso/thot | En voir plus sur la conception (h3) | | |

Rule of thumb: **Tabs** when the content is 2–5 parallel items of similar shape (e.g. one image + text each). **Show inline** (a normal subsection) otherwise.

Once the table is approved:

1. **Meditect first**, following the reference file. Add `id` + `number` to the 6 chapters (Contexte, Stratégie & impact, Discovery, Product design, Cas pratiques, Enseignements).
   - Contexte statement: `Learnings variant="statement"`.
   - Challenge / Vision: `Card` pair. Impact block: `Learnings variant="impact"`.
   - Artefacts: `Tabs`. Discovery principles: `FactGrid`. Colour charter: `BeforeAfter`. Enseignements: `LearningsGrid`.
2. Then the other pages: novyspec, smartrx (index, tageditor, logistock), meditect subpages (designsystem, receiving), perso (galleries, coach-pizza, thot).
3. Delete `Accordion.astro` once nothing imports it.

## Phase 5 — Verification

- `npm run build` passes, and every page under `/`, `/pro`, `/perso` and `/legal` renders.
- Manual checks at 390, 768, 1200 and 1440px wide:
  - no horizontal scroll;
  - the chapter chips scroll, and the sidebar appears from 1200px;
  - jumping to an anchor doesn't hide the section title under the header.
- Keyboard: nav → chapter links → tabs (arrow keys switch panels) → figures → lightbox (Esc closes it and focus returns to the trigger).
- Lighthouse (mobile) on `/pro/meditect/`: Accessibility ≥ 95, no CLS regression.
- Contrast check on muted text and on the coral and green chips.
- Update `CLAUDE.md`: it is outdated (it says there are 2 pages, mentions MuseoModerno and `Home.astro`). Describe the project layouts and components.
- Final report: files changed, added and removed, and anything left undone.

## Open decisions (ask the owner, don't guess)

- The accordion conversion table in Phase 4.
- The Meditect catalogue figure: **+27k** in the key figures, **+33k** in the Impact section.
- Whether to rewrite `keyFigures` values into `value` + `unit` (for example "~5" + "%"). This is a copy change, so it needs approval.
