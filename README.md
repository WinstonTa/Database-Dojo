# Database Dojo

**Interactive PostgreSQL lessons and SQL practice for CECS 323 Exam 3.** Built with React 19, Vite, TypeScript, and [PGlite](https://pglite.dev) (PostgreSQL running in WebAssembly).

## Features

- Eight interactive, slide-style SQL lessons aligned with the course topics.
- In-browser PostgreSQL playground with live tabular results and schema explorer.
- 15 curated, locally graded SQL challenges, including five Homework 8-inspired problem styles.
- Hints, revealable reference queries, sample execution order, course/original source labels.
- Completed challenge progress saved in `localStorage`. No accounts, API keys, or backend.
- Responsive design with mobile navigation and a Vercel-ready static build.

## Start locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
# Open the local Vite URL shown in your terminal
```

Build: `npm run build`. Type check: `npm run typecheck`. Curriculum validation: `npm run validate`. Preview production build: `npm run preview`.

## Deploy to Vercel

Import **WinstonTa/Database-Dojo**, select **Vite**, build command `npm run build`, output directory `dist`. No environment variables or server required. `vercel.json` has SPA routing fallback.

## Curriculum and provenance

Based on these course documents stored in TaskBoard's `tasks_cecs323_cheatsheet` folder: `lecture_slides_instructions.md`, `lectures_days17-20.md`, `review_guide.md` and `homework_08.md`.

- **Curriculum scope:** Lecture PDF slides 28–123 (SQL section). Slides 1–27 are background-only; indexes after slide 123 are excluded.
- **Verification limitation:** The original lecture PDF binary was identified in TaskBoard but could not be extracted via the GitHub connector, so explanations are currently based on the provided lecture schedule, review guide, and Homework 8 markdown. Exact slide-by-slide mapping awaits readable PDF extraction.
- **Sample dataset:** The five Homework-like tables and ALL inserted data are author-created examples, **not** a copy of the official Homework database. Their columns and join relationships reflect those referenced by Homework 8, not a verified full course ER diagram.
- **Exercises:** Homework-inspired tasks are labeled "Course-inspired"; the other examples are labeled "Original practice." All explanatory copy is paraphrased/original.

## Architecture

- `src/data/lessons.json`: lessons, examples and checkpoints
- `src/data/challenges.json`: problems, hints, reference SQL
- `src/data/database.ts`: SQL schema and original seed data
- `src/lib/sql.ts`: singleton in-memory PostgreSQL database, query and result grading
- `src/App.tsx`: lessons, editor, practice, results, progress, schema and routing
- `src/styles.css`: responsive UI

Challenge grading compares the result rows from submitted SQL against independently executed reference SQL on the same local sample dataset; column aliases and row order are ignored but column order matters. It is *result-based practice*, not formal proof of SQL equivalence. Dataset mutations in the Playground affect future results until **Restore data** or page reload. Because of the in-memory database, data changes are not persisted across reloads; only completion progress is persisted.

### Backward compatibility

The previous Database-Dojo Next.js implementation is preserved in `archive/pre-cecs323-react-2026-11-10`. Main is now the new static React/Vite webapp.
