# Deep Learning Intelligence — 2027 Landing (React + Vite)

Production source for the new `www.DeepLearningIntelligence.com` landing page.

## Stack

- React 19 + TypeScript + Vite 7
- framer-motion (motion) for scroll choreography and the philosophy typewriter
- Three.js for the intelligence architecture canvas
- Tailwind CSS for layout/type
- Static SEO shell (`index.html`) + five static topic routes under `public/`

## Develop

```bash
cd app
npm ci
npm run dev     # http://localhost:3000
npm run build   # tsc -b && vite build  -> app/dist
npm run preview # serve the production build
```

## Deploy

Docker (nginx) serving `app/dist`:

```bash
docker build -t dli-landing .
docker run -p 8080:80 dli-landing
```

The build expects `app/dist` to exist (`npm run build` first).

## Content notes

- Philosophy thesis is typewriter-animated ("AI is not the outcome. What it makes possible is.") with a blinking cursor and reduced-motion fallback.
- Experience Lab cards, dialogs and keyboard navigation are prototype-grade and disclose simulated state.
- Lead capture lives behind `POST {LEAD_API_URL}/api/leads`.
- Free research PDFs are served from `app/public/resources/` and delivered by email via the lead API.
