# Plan — Project-page redesign (rinno.fr)

## Context

Project pages (`src/pages/pro/**`, `src/pages/perso/**`) are long case studies built from `Row > Section > Column` plus `Figure`, `Quote`, `Learnings`, `Keywords` and `Accordion`. They are wrapped by `ProjectPro` / `ProjectPersonal`, which both use `ProjectBase` (hero, key figures, breadcrumbs, previous/next navigation).

Goal: a cleaner, more editorial layout that **removes the accordion** and makes long pages easy to navigate.

## Visual references (source of truth)

Open them directly in a browser (file:// works); they load their images from `src/assets`.

| Mock | What it validates |
|---|---|
| `docs/mocks/meditect.html` | Base template: hero, key figures, chapter nav, tabs, before/after, fact grid, learnings grid. Its images load from rinno.fr. |
| `docs/mocks/novyspec.html` | Long pro page: sub-sections in the chapter nav, **step-by-step panels** (ex-accordions), options comparison, end-of-project notes, Successes / Failures, dark figures. |
| `docs/mocks/galleries.html` | Personal page: **coral theme**, no key figures, **timeline** of iterations, colour swatches, wide + mobile screenshots. |

`docs/mocks/redesign.css` and `redesign.js` are the **shared** styles and behaviour of the Novyspec and Galleries mocks, and the closest thing to the target components. Reuse their values, converted to rem; don't copy the markup wholesale.

## Ground rules

- Follow `CLAUDE.md`: **mobile-first**, breakpoints **768 / 1200 / 1440px**, relative units (rem, %), base font size 14 / 16 / 18px as already set in `global.css`.
- Work on a branch: `feat/project-page-redesign`. One commit per phase. `npm run build` must pass after each phase.
- Keep content and URLs unchanged. **Exception:** the text in the three mocks (rephrased summary lines, short titles, split key figures, iteration titles) is **approved by the owner**; use it for those three pages. For every other page, any copy change needs approval.
- Keep the brand: Montserrat (headings, UI) + Cormorant Garamond (body). Pro pages use indigo `#4040CC`; personal pages use coral (see the theme section in Phase 1).
- Accessibility is required: real `<button>`/`<a>`, visible focus, text contrast ≥ 4.5:1, keyboard support for tabs, steps and the lightbox, `prefers-reduced-motion` respected.
- No new dependencies and no JS framework. Client JS stays small, vanilla, in Astro `<script>` tags.

## Current inventory (checked 2026-11-13)

| File | Used by | Action |
|---|---|---|
| `layouts/Layout.astro` | everything | improve |
| `layouts/ProjectBase.astro` | ProjectPro, ProjectPersonal | improve (new structure) |
| `layouts/ProjectPro.astro`, `ProjectPersonal.astro` | project pages | pass new props through (`meta`, `eyebrow`, `lede`, `chapters`, theme) |
| `layouts/ProjectsLanding.astro` | `/pro`, `/perso` | restyle only |
| `components/Header.astro`, `Footer.astro` | Layout | improve |
| `components/Breadcrumbs.astro` | ProjectBase, ProjectsLanding | restyle |
| `components/ProjectCard.astro` | 5 pages | improve |
| `components/project/Section.astro` | 11 pages | improve (`id`, `number`) |
| `components/project/Row.astro` | 11 pages | **keep**: it groups a Section with its Quotes, Learnings, Accordion… (0 to 2 Sections per Row) |
| `components/project/Column.astro` | 11 pages | improve (grid) |
| `components/project/Figure.astro` | 10 pages | improve (lightbox, image rule) |
| `components/project/KeyFigures.astro` | ProjectBase | improve; must be optional |
| `components/project/Learnings.astro` | 11 pages | improve → variants |
| `components/project/Quote.astro` | 7 pages | improve |
| `components/project/Keywords.astro` | 9 pages | restyle (pills) |
| `components/project/FigmaEmbed.astro` | logistock, designsystem | keep; check it fits the new content width |
| `components/project/Accordion.astro` | 8 uses on 5 pages | **remove** (Phase 4) |
| `components/Home.astro`, `UnderConstruction.astro` | nothing | **remove** |
| `components/Link.astro` | `legal.astro` | replace with a plain `<a>`, then remove; it uses an unloaded font, MuseoModerno |
| `components/LinkIcon.astro`, `SEO.astro` | — | keep |

## Phase 1 — Foundations

**`src/styles/global.css`**
- Add the variables from `docs/mocks/redesign.css`: `--paper`, `--surface`, `--soft`, `--line`, `--ink`, `--body`, `--muted #5E5E78`, `--accent`, `--accent-deco`, `--accent-soft`, `--accent-on-dark`, `--coral`, `--coral-soft`, `--green`, `--green-soft`, `--sans`, `--serif`, `--wrap`, `--prose` (about 46rem, the reading width).
- **Theme for personal pages** (`.theme-perso` on `<body>`, set by `ProjectPersonal`):
  - `--accent: #B8344F` for text (5.6:1 on paper);
  - `--accent-deco: #CC4060` for borders, dots and bars only (4.5:1, too close for small text);
  - `--accent-soft: #FBECEF`.
- Fix the `--color-ligthest` typo: rename it and update every usage.
- Type scale: h1–h4 in Montserrat 600 with negative letter-spacing; body text in Cormorant at about 1.2rem on mobile and 1.3rem from 768px, line-height 1.55.
- Replace the `* { font-family }` rule with `body { font-family }`.
- Add `html { scroll-behavior: smooth; scroll-padding-top: 6rem }`, a `:focus-visible` outline, a `prefers-reduced-motion` reset.
- Add utility classes `.numbered` (numbered circles), `.tag` (pill) and `.chip` (`yes` / `no` / `neutral`). Keep `.list-arrow` (arrow in `--accent`) and `.learnings-title`.
- Remove `.flex-row` and `.subsections-flex` (nothing uses them).

**`layouts/Layout.astro`**: remove the `main` top/bottom padding that only existed to clear the fixed header and footer.

**`Header.astro`**: sticky, full-width bar with a translucent, blurred background. Name on the left ("— Product & Design" hidden under 768px), nav on the right, `aria-current="page"` with an accent underline. A bottom border appears once the page scrolls. Optional `progress` prop: a 2px reading-progress bar, used on project pages only.

**`Footer.astro`**: no longer fixed. A static row at the end of the page with a top border.

Remove `.glass-effect` from `global.css` once neither Header nor Footer uses it.

**`legal.astro`**: replace `<Link>` with `<a>`, remove the MuseoModerno rule, delete `Link.astro`. Delete `Home.astro` and `UnderConstruction.astro`.

**Done when:** every page renders and the header and footer never cover content, at all breakpoints.

## Phase 2 — New components (`src/components/project/`)

| Component | Props | Notes (see the mocks) |
|---|---|---|
| `ProjectHero` | `eyebrow?`, `title`, `lede?`, `meta?: {label, value, href?}[]`, `image?`, `imageDark?` | Extracted from `ProjectBase`. Big title (clamp, about 3.3–7.5rem). Meta is a `<dl>`: 2 columns on mobile, 4 from 768px; any item can be missing. Cover image at 3:2 on mobile, 2:1 from 768px. `imageDark` gives the cover a dark background (Galleries). `heroOverlayPosition` becomes obsolete. |
| `ChapterNav` | `items: {id, label, children?: {id, label}[]}[]` | Under 1200px: a sticky, horizontally scrollable row of chips under the header, top-level items only. **From 1200px**: a sticky sidebar numbered 01, 02…; the **sub-items (h3) of the current chapter** expand under it. The highlighted item is the last chapter or sub-section whose top has passed 35% of the viewport height; compute it on scroll with `requestAnimationFrame` (an `IntersectionObserver` missed sub-sections in testing). Items are declared per page (`chapters` prop), not inferred from the DOM. |
| `Tabs` + `TabPanel` | `variant: 'tabs' \| 'steps'`, `label`; panel: `id`, `title`, `step?` | WAI-ARIA tabs pattern (roving `tabindex`, ← → Home End). `tabs`: segmented pill (Meditect artefacts). `steps`: numbered cards joined by arrows, 2 or 4 per row from 768px, plus **Previous / Next buttons** in each panel (Novyspec). A panel is image + text side by side from 768px, stacked below. Without JS, all panels show stacked. |
| `Lightbox` | — | A single `<dialog>`, rendered once in `ProjectBase`. Closes on Esc, backdrop click or the close button. Returns focus to the trigger. Each figure button gets an `aria-label` ("Agrandir : …") and a zoom icon shown on hover/focus. |
| `FactGrid` | `items: {label, value}[]` | `<dl>`: 1 column on mobile, 2×2 from 768px. Also used inside a timeline item. |
| `BeforeAfter` | `before`, `after` (`{image, alt, label}`), `note` slot | Two figures with ✕ coral / ✓ green chips. |
| `Card` | `title?` | White surface, border, radius. Used in pairs (`.duo`). |
| `Options` + `Option` | option: `level`, `title`, `result`, `badge?`, `highlight?` | Comparison cards (Novyspec EPI scenarios): 1 column on mobile, 3 from 768px. The highlighted option has an accent border and a badge. |
| `Outcomes` | slots `yes` / `no`, titles | Two cards (✓ green list / ✕ coral list), 3:2 width ratio from 768px. Novyspec "Succès & échecs", Galleries "script / still manual". |
| `Timeline` + `Iteration` | iteration: `n`, `title`, `tool?`, `current?`, `id` | Vertical line with dots (the current iteration has a filled dot). Label "Itération N", h3 title, tool chip. Inside: free content, plus a `.trigger` label (e.g. "Constat : …", "Solution : …"). |
| `Swatches` | `colors: {name, hex}[]` | Real colour swatches with name and hex (Galleries palette: #303030 background, #FFFFFF text, #464646 hover/active, sampled from `palette.png`). |
| `LearningsGrid` + `Learning` | `n`, `title?`, `columns?: 2 \| 3` | Numbered grid: 1 column on mobile, 2 or 3 from 768px. The title is optional (Galleries has none). |
| `Pager` | `prev?`, `next?` (`{label, title, href}`) | Replaces the prev/next block in `ProjectBase`. Works with only one side (Novyspec has only "Plus récente", Galleries only "Projet plus ancien"). |

## Phase 3 — Upgrade existing components

- **`ProjectBase`**:
  - Structure: `Breadcrumbs` → `ProjectHero` → `KeyFigures` (only if provided) → content grid (`ChapterNav` | `<slot />`) → `Pager`.
  - Sidebar only from 1200px (200px column, 72px gap).
  - Include `Lightbox`, turn on the header's `progress`, apply `.theme-perso` for personal projects.
- **Content width rule:** prose (`p`, `ul`, `ol`, `h2`) is capped at `--prose`; figures, grids, cards and steps use the full content column.
- **`Section`**: add optional `id` and `number`. When `number` is set, render it small, in the accent colour, above the h2. Bottom spacing about 5rem on mobile, 7rem from 768px. Sub-section headings (h3) that appear in the chapter nav need an `id` and `scroll-margin-top`.
- **`KeyFigures`**: big number, muted label, vertical separators from 768px (stacked with horizontal separators on mobile). It must render nothing when there are no figures. Existing `value` strings keep rendering unchanged. The new number + label split applies to the 3 mocked pages only (approved copy).
- **`Learnings`**: add `variant?: 'default' | 'statement' | 'impact' | 'note' | 'end'`. `default` keeps today's look, so untouched pages don't change.
  - `statement`: Cormorant italic, large, accent left border, optional small caption ("La leçon", "Pourquoi ce projet compte").
  - `impact`: dark background.
  - `note`: coral-soft background.
  - `end`: like `note`, with a small coral square, for "**Fin du projet.** …" conclusions.
- **`Figure`** — image rule:
  - **default: natural proportions**, full column width. Never crop diagrams, journeys or screenshots.
  - `crop` + `ratio` (`4/3`, `3/4`, `1/1`) **only for photos in grids**, with optional `position` (e.g. `top`).
  - `dark`: dark frame, for images with a black background.
  - `pad`: padded light frame, for small images or images with a white background.
  - When `clickable` is set, the image opens the `Lightbox`. Keep Astro `<Image>` optimisation.
- **`Quote`**: large accent quotation mark, italic quote, author name; add an optional `role` prop shown on its own line.
- **`ProjectCard`**: add an optional `metric` (or reuse `bottomText`) and a "Deep-dive →" call to action, plus a hover state.
- **`Column`**: switch to CSS grid with `minmax(0, 1fr)`. Keep `fullWidth`, `alignWithContent` and `headingLevel`. Add a `wide-narrow` layout (about 2.2fr / 1fr) for a desktop screenshot next to a mobile one.
- **`Breadcrumbs`, `Keywords`, `ProjectsLanding`**: restyle only.

## Phase 4 — Migrate pages and remove the accordion

**Accordion decisions**

| Page | Accordion | Decision |
|---|---|---|
| meditect/index | Artefacts de la stratégie produit | **Tabs** (Segmentation / Mapping / Roadmap / Sprint) |
| novyspec | En savoir plus sur l'atelier persona | **Steps** (2: Empathy map, Mise en commun) |
| novyspec | Voir plus d'informations sur la conception | **Steps** (4: Atelier tâche, Tâche finalisée, Wireframes, UI finale) |
| novyspec | Succès & Echecs (h2) | **Own chapter**, shown with `Outcomes` |
| smartrx/index | DesignOps (h2) | *to propose* |
| smartrx/tageditor | Evolutions du concept (h3) | *to propose* |
| perso/thot | Aller plus loin sur cette recherche (h3) | *to propose* |
| perso/thot | En voir plus sur la conception (h3) | *to propose* |

Rule of thumb for the remaining four: a **sequence** → Steps; **2–5 parallel items** of similar shape → Tabs; a key message → its own chapter or inline. Propose one per accordion with a one-line reason, and **wait for approval**.

**Order**

1. **The 3 mocked pages, following their mock exactly:** Meditect, Novyspec, Galleries. Novyspec's EPI study becomes `Options` plus the figure. Its discovery verticals each get a "Verticale N" label, an h3 and a `Learnings variant="end"` conclusion; the agro workflow and ideation become 2 `steps`.
2. Then: smartrx (index, tageditor, logistock), meditect subpages (designsystem, receiving), perso (coach-pizza, thot).
3. Delete `Accordion.astro` once nothing imports it.

## Phase 5 — Verification

- `npm run build` passes, and every page under `/`, `/pro`, `/perso` and `/legal` renders.
- Manual checks at 390, 768, 1200 and 1440px wide:
  - no horizontal scroll;
  - the chapter chips scroll;
  - the sidebar appears from 1200px, and its sub-items follow scrolling;
  - jumping to an anchor doesn't hide titles under the header.
- Compare the 3 mocked pages side by side with their mock.
- Keyboard: nav → chapter links → tabs and steps (arrow keys, Previous/Next) → figures → lightbox (Esc closes it and focus returns to the trigger).
- Lighthouse (mobile) on `/pro/meditect/`, `/pro/novyspec` and `/perso/galleries`: Accessibility ≥ 95, no CLS regression.
- Contrast check on muted text, coral text (`#B8344F`) and the chips.
- Update `CLAUDE.md`: it is outdated (it says there are 2 pages, mentions MuseoModerno and `Home.astro`). Describe the project layouts, the components and the pro/perso themes.
- Final report: files changed, added and removed, and anything left undone.

## Open decisions (ask the owner, don't guess)

- The 4 remaining accordions (Phase 4 table).
- The Meditect catalogue figure: **+27k** in the key figures, **+33k** in the Impact section.
- Any copy change on pages other than the 3 mocked ones.
