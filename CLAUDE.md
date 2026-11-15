# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio of Romuald Tisserand (Product & Design), built with Astro. Static, in French, hosted on GitHub Pages (`site: "https://romu70.github.io"`, custom domain via `public/CNAME`). No JavaScript framework, no cookies, no data collection.

## Development Commands

```bash
npm run dev       # dev server on http://localhost:4321
npm run build     # production build to dist/
npm run preview   # serve the production build
npx astro check   # type check
```

## Pages

- `src/pages/index.astro`: home. `src/pages/legal.astro`: legal notices.
- `src/pages/pro/index.astro` and `src/pages/perso/index.astro`: project landings (`layouts/ProjectsLanding.astro` + `components/ProjectCard.astro`).
- Pro projects: `pro/meditect/` (index, `designsystem`, `receiving`), `pro/novyspec`, `pro/smartrx/` (index, `logistock`, `tageditor`).
- Personal projects: `perso/galleries`, `perso/coach-pizza`, `perso/thot`.
- `public/Sia/` is a static prototype export; PDFs linked from pages live in `public/pro/...`.

## Layouts

- `Layout.astro`: HTML shell (lang="fr", SEO, font preloads, Header, Footer). Props `bodyClass`, `progress` (reading-progress bar in the header).
- `ProjectBase.astro`: every project page. Renders breadcrumbs, `ProjectHero`, `KeyFigures`, then a 2-column grid from 1200px (`ChapterNav` sidebar + content), the `Pager` and the `Lightbox`. Holds the global content rules (prose width, vertical rhythm).
- `ProjectPro.astro` / `ProjectPersonal.astro`: wrap `ProjectBase`, set the theme, the breadcrumbs and the previous/next project. Sub-pages (e.g. `/pro/smartrx/logistock`) get their parent in the breadcrumbs and no pager.

### Writing a project page

```astro
<ProjectPro
  title="…" eyebrow="… · 2021 — 2024" lede="… <em>…</em>"
  meta={[{ label: "Rôle", value: "…" }, { label: "Site", value: "…", href: "https://…" }]}
  image={hero} imageAlt="…" keyFigures={[{ value: "+500", label: "…" }]}
  chapters={[{ id: "contexte", label: "Contexte" }, { id: "x", label: "…", children: [{ id: "sub", label: "…" }] }]}
>
  <Section id="contexte" number={1} title="Contexte">…</Section>
</ProjectPro>
```

- `chapters` ids must match `Section` ids; `children` ids match `h3` ids inside the section. The sidebar highlights the last target whose top passed 35% of the viewport.
- Inside a `Section`, write plain blocks (`p`, `ul.list-arrow`, `h3`, components). Use `div.grid-2`, `div.grid-3`, `div.duo` or `div.grid-wide-narrow` for side-by-side content, and `div.section-content` to restore vertical rhythm inside a grid cell.
- End a page with `<div class="appendix-grid"><LinkList …/><Keywords>…</Keywords></div>`, or `Keywords` alone.

## Components (`src/components/project/`)

| Component | Use |
|---|---|
| `ProjectHero` | Eyebrow, title, lede, meta row, cover (with a light darkening overlay). Rendered by `ProjectBase`. |
| `ChapterNav` | Sticky chips below 1200px, numbered sidebar from 1200px. Rendered by `ProjectBase`. |
| `Section` | Numbered chapter with an `h2`. |
| `Card` | Bordered box with a small title; pairs go in `div.duo`. |
| `CaseBlock` | Sub-section with a kicker ("Verticale 1", "Étape 2") and an `h3`. |
| `Tabs` + `TabPanel` | `variant="tabs"` for parallel items, `variant="steps"` for a sequence (Previous/Next). Image in the panel's `media` slot. WAI-ARIA, all panels shown without JS. |
| `Timeline` + `Iteration` | Successive versions (v1, v2…). `<p class="trigger">` labels "Constat" / "Solution". |
| `Figure` | Image with caption, zoomable by default (opens the `Lightbox`). `label` + `labelTone` for "Avant"/"Après" chips; `sizes` for responsive images. |
| `BeforeAfter`, `Options`/`Option`, `Outcomes`, `FactGrid`, `Swatches` | Comparisons, option cards, successes/failures, label/value facts, colour swatches. |
| `Learnings` | Callout: `default`, `statement`, `impact` (dark), `note`, `end` ("Fin du projet."). |
| `LearningsGrid` + `Learning` | Numbered takeaways, 2 or 3 columns. |
| `KeyFigures`, `Quote`, `LinkList`, `Keywords`, `Pager`, `FigmaEmbed`, `Lightbox` | As named. |

`Row` and `Column` are legacy (only the home page uses them). `components/ProjectCard.astro` is the project card (`layout="row"` on landings, `"stack"` in grids).

## Styling

- `src/styles/global.css` holds the tokens (`--paper`, `--surface`, `--soft`, `--line`, `--ink`, `--body`, `--muted`, `--accent`, `--accent-deco`, `--accent-soft`, `--accent-on-dark`, `--coral`, `--green`, `--wrap`, `--prose`, `--radius`, `--header-h`), the type scale and the utilities (`.intro`, `.tag`, `.chip`, `.badge`, `.list-arrow`, `ol.numbered`, grids, `.label`, `.sr-only`). Legacy `--color-*` aliases remain for older code.
- Themes: pro pages use the indigo accent (`#4040CC`). Personal pages get `body.theme-perso`: `--accent: #B8344F` for text, `--accent-deco: #CC4060` for borders, dots and bars only (too light for small text).
- Fonts are self-hosted in `public/fonts/`: Cormorant Garamond (body, weight 500) and Montserrat (headings and UI, 600). Do not move them out of `public/`.
- Headings: `h1`–`h4` in Montserrat; `h4` and `.label` share the small uppercase label look. Keep heading levels in order (no h2 → h4 jump): use `<h3 class="label">` when you need the small look one level down.
- Component styles are scoped in each `.astro` file; use `:global()` for slotted content.

## Development Guidelines

### Responsive design

**Every change must be responsive**, mobile first. Breakpoints:

- **Mobile** (`max-width: 768px`): base font-size 14px.
- **Tablet/desktop** (`min-width: 768px`): base 16px; 2–4 column grids appear.
- **`min-width: 1200px`**: the chapter sidebar appears next to the content.
- **Large screens** (`min-width: 1440px`): base 18px.

Use rem units, test at 390, 768, 1200 and 1440px, and check that nothing scrolls horizontally.

### Accessibility

- Text contrast ≥ 4.5:1 (3:1 for large text). Don't fade text with `opacity`.
- Everything works with the keyboard (tabs: ← → Home End; lightbox: Esc returns focus to the trigger).
- Respect `prefers-reduced-motion` (handled globally).
- Every image needs a meaningful `alt`.

### Content

Content is in French. Keep existing copy and URLs unless the owner asks for a change.
