# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website for Romuald Tisserand (Consultant Expert Numérique & IA) built with Astro. The site is minimal, static, and hosted on GitHub Pages at https://romu70.github.io.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview

# Run Astro CLI directly
npm run astro
```

## Project Architecture

### Site Structure

- **Pages**: Two main pages
  - `src/pages/index.astro` - Home page with contact information
  - `src/pages/legal.astro` - Legal notices (mentions légales)

- **Layout**: Single unified layout at `src/layouts/Layout.astro`
  - Sets up HTML structure with lang="fr"
  - Imports global styles
  - Provides consistent page wrapper via `<slot />`

- **Components**: Reusable Astro components
  - `src/components/Home.astro` - Main home page content with contact details
  - `src/components/Link.astro` - Styled link component accepting `{value, label}` props

### Styling Approach

- Global styles in `src/styles/global.css` define:
  - CSS custom properties for theming (--background-color, --primary-color, --accent-color)
  - Typography using MuseoModerno font from @fontsource
  - Responsive font sizing via media queries (768px, 1440px breakpoints)

- Component-specific styles are scoped within each `.astro` file's `<style>` tag

- Responsive design using media queries to adjust for mobile (max-width: 768px), tablet/desktop (768px-1440px), and large screens (1440px+)

### Deployment

- Site is deployed to GitHub Pages
- Configured in `astro.config.mjs` with `site: "https://romu70.github.io"`
- The `base` config is commented out (no subdirectory deployment)
- `public/CNAME` file likely handles custom domain routing

## Key Technical Details

- Language: French (lang="fr")
- TypeScript: Uses Astro's strict TypeScript configuration
- No JavaScript frameworks: Pure Astro with static HTML generation
- No data collection: Site explicitly states no personal data or cookies are collected
- Static assets: Minimal footprint with logo SVG and favicon

## Development Guidelines

### Responsive Design Requirements

**Every code change must be responsive.** The site uses a mobile-first approach with the following breakpoints:

- **Mobile**: `max-width: 768px`
  - Base font-size: 14px (set in global.css)

- **Tablet/Desktop**: `min-width: 768px` and `min-width: 1200px`
  - Base font-size: 16px (default)
  - Progressive width adjustments for content containers

- **Large screens**: `min-width: 1440px`
  - Base font-size: 18px (set in global.css)

**When adding or modifying any UI elements:**
1. Start with mobile-first design
2. Add media queries for at least the 768px and 1440px breakpoints
3. Consider the 1200px breakpoint for mid-range desktop adjustments
4. Use relative units (rem, %, vh/vw) that scale with the base font-size
5. Test layout, spacing, and typography across all breakpoints
