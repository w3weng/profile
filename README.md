# Emmanuel A. Danuco II — Portfolio (React + Vite)

Premium dark-only personal portfolio for **Emmanuel A. Danuco II (Weweng)**.

## Tech

- React + Vite (TypeScript)
- Tailwind CSS
- Framer Motion
- React Router
- Lucide React icons

## Setup

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173/`).

## CMS Mode (Supabase)

1. Copy `.env.example` to `.env`
2. Fill:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Follow SQL + RLS + Storage setup in `SUPABASE_SETUP.md`

## Build

```bash
npm run build
npm run preview
```

## Admin Dashboard

- Login route: `/admin/login`
- Dashboard route: `/admin`
- Manage:
  - Projects (add/edit/delete + image upload)
  - Skills
  - Experience
  - Certificates
  - Testimonials
  - Currently Working On
  - Resume upload/replace/delete

## Customize content

- Site identity/social links: `src/constants/site.ts`
- Projects: `src/data/projects.ts`
- Skills: `src/data/skills.ts`
- Experience: `src/data/experience.ts`
- Certificates: `src/data/certificates.ts`

## Add your real avatar + thumbnails

- **Avatar**: replace `public/avatar.svg` with your own photo (recommended: `avatar.jpg` or `avatar.png`), then update the path in `src/components/sections/HeroSection.tsx` if needed.
- **Project thumbnails**: replace files in `public/projects/` with real screenshots (keep the same filenames), or update `thumbnail` paths in `src/data/projects.ts`.
