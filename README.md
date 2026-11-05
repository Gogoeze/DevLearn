# DevLearn

A learning platform for web developers. Each lesson explains one concept, then asks the student to write code in a live editor. Challenges are checked automatically, with plain-language feedback and progressive hints.

Stack: React, TypeScript, Vite, Tailwind CSS v4, React Router, Supabase Auth, CodeMirror.

## Setup

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` to `.env` and fill in your project URL and anon key.
3. Install and run:

```bash
npm install
npm run dev
```

## Design decisions

- **Colors:** a blue accent with light and dark modes. All colors are CSS variables in `src/index.css`, exposed to Tailwind as semantic names (`bg-surface`, `text-muted`, `bg-accent`). Switching modes only swaps the variable values.
- **Fonts:** Space Grotesk for headings, buttons and labels; Inter for lesson text; JetBrains Mono for code.
- **Lesson layout:** lesson content takes 60% of the width; the editor, preview and console share the other 40%.
- **Access:** the first HTML lesson is free for visitors. Every other lesson needs an account, and signed-in students can jump to any lesson.

## Structure

```
src/
  components/   Reusable UI (editor, preview, hints, check results, navbar)
  context/      Auth and theme contexts and providers
  data/         Lesson content, one file per course
  hooks/        useAuth, useTheme, useProgress, useSandbox, useEditorTheme
  lib/          Supabase client, sandbox builder, challenge checker, CodeMirror languages and themes
  pages/        Route-level pages
  types.ts      Shared types
```

## Adding a lesson

Add an object to the `lessons` array in `src/data/html.ts`, `css.ts` or `js.ts`. A lesson has an explanation, a snippet, and a challenge with starter code, checks, three hints and a solution. Each check is a function that inspects the rendered preview, the student's code, or the lines printed to the console, and returns `true` or `false`. Add `free: true` to make a lesson open to visitors.

## Notes

- Student code runs in a sandboxed iframe on the same origin so checks can inspect the rendered DOM. It only runs the current student's own code. Do not render code written by other users in it.
- Progress is stored per user in the `progress` table, protected by row level security.
