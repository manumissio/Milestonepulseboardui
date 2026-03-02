
# Milestone Pulse Board UI

UI for tracking milestones, blockers, workstreams, risks, and change timelines.

Original Figma:
https://www.figma.com/design/Ltoo6j1vLXDfzbKxQvH8Il/Milestone-Pulse-Board-UI

## Tech Stack

- React
- Vite
- React Router

## Local Development

1. Install dependencies:
   `npm install`
2. Start dev server:
   `npm run dev`

## Production Build

Build the app locally with:

`npm run build`

Vite outputs production files into `dist/`.

## GitHub Pages Deployment

This repo deploys to GitHub Pages via GitHub Actions workflow:

- Workflow file: `.github/workflows/deploy-pages.yml`
- Trigger: push to `main` (and manual `workflow_dispatch`)
- Pages URL: https://manumissio.github.io/Milestonepulseboardui/

### Important Configuration

- Vite `base` is set to `/Milestonepulseboardui/` in `vite.config.ts`.
- React Router uses `basename: import.meta.env.BASE_URL` in `src/app/routes.tsx`.

These are required for correct routing when hosted under the GitHub Pages subpath.

## Troubleshooting

- If deployment succeeds but site still looks stale, wait up to ~10 minutes for CDN cache or hard refresh.
- If you see route-related 404/white screen, verify both:
  - Vite `base` in `vite.config.ts`
  - Router `basename` in `src/app/routes.tsx`
  
