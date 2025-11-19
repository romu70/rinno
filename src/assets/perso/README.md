# Personal Project Assets

This folder contains visual assets for personal projects.

## Structure

Each project has its own folder:
- `coach-pizza/` - Coach Pizza project assets
- `galleries/` - Galleries project assets
- `thot/` - THoT project assets

## File Naming Convention

- `hero.jpg` or `hero.png` - Main hero image for the project page (required)
- `screenshot-*.jpg` - Additional screenshots (optional)
- `diagram-*.jpg` - Architecture diagrams or other visuals (optional)

## Image Requirements

- **Format:** JPG, PNG, or WebP
- **Hero image dimensions:** ~1200x800px (3:2 aspect ratio) recommended
- **File size:** Aim for <500KB (Astro will optimize automatically)
- **Quality:** High quality - Astro's Image component will handle optimization

## Usage Example

```astro
---
import ProjectPersonal from "../../layouts/ProjectPersonal.astro";
import heroImage from "../../assets/perso/thot/hero.jpg";
---

<ProjectPersonal title="THoT" year="2017" image={heroImage}>
  <!-- project content -->
</ProjectPersonal>
```
