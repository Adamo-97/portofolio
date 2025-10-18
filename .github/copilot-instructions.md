# GitHub Copilot Instructions for Portfolio Project

## Architecture Overview

This is a **Next.js 15** portfolio site using the **App Router**, TypeScript, Tailwind CSS, and Framer Motion. Backend powered by **Supabase** (PostgreSQL + Storage) and **Nodemailer** for contact forms.

### Key Directories

- `app/` - Next.js App Router pages and API routes
  - `app/[page-name]/page.tsx` - Route entry point (wraps client component)
  - `app/[page-name]/[page-name]-page.tsx` - Client component with business logic
  - `app/api/*/route.ts` - Serverless API handlers
- `components/` - Reusable React components organized by feature
- `lib/backend/` - Supabase client configuration
- `lib/contact/` - Email validation and Nodemailer setup
- `src/hooks/` - Custom React hooks for viewport, animations, etc.

## Essential Patterns

### 1. Page Structure

Follow the two-file pattern seen in `app/skills-page/`:

```tsx
// app/[feature]/page.tsx (server component wrapper)
import FeaturePage from "./feature-page";
export default function Page() {
  return <FeaturePage />;
}

// app/[feature]/feature-page.tsx (client component)
("use client");
export default function FeaturePage() {
  /* ... */
}
```

### 2. API Routes

Match existing patterns from `app/api/contact/route.ts` and `app/api/roadmap/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

export const revalidate = 0; // disable caching

export async function GET() {
  const { data, error } = await supabase
    .from("table_name")
    .select("columns")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("[/api/endpoint] db error:", error);
    return NextResponse.json({ error: "db" }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

**Important**: Use `export const runtime = "nodejs"` when route needs Node APIs (FormData, nodemailer, crypto, etc.)

### 3. Supabase Public URLs

When serving images from Supabase Storage, check if path is absolute first:

```typescript
const isAbsolute = /^https?:\/\//i.test(icon_path);
const publicUrl = isAbsolute
  ? icon_path
  : supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
```

### 4. Component Organization

Co-locate feature components under `components/[feature-name]/`:

- `components/project/ProjectCard.tsx`
- `components/project/ProjectsFilter.tsx`
- `components/project/LanguageChips.tsx`

Export types from component files when shared:

```typescript
export interface Project {
  /* ... */
}
export default ProjectCard;
```

### 5. Animations with Framer Motion

Use staggered mount animations for lists:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: index * 0.1 }}
>
```

Use `layoutId` for smooth transitions between states:

```tsx
{
  isActive && (
    <motion.div layoutId="uniqueId" transition={{ type: "spring" }} />
  );
}
```

### 6. Tailwind Styling Conventions

- Use existing color tokens: `cornflowerblue-100`, `cornflowerblue-400`, etc.
- Hover states: `hover:scale-[1.02]`, `hover:shadow-[0_8px_30px_rgba(24,161,253,0.3)]`
- Responsive: `sm:`, `md:`, `lg:` breakpoints
- Glass effects: `bg-cornflowerblue-400/10 backdrop-blur-sm border border-cornflowerblue-100/20`

### 7. URL Query Sync Pattern

For client-side filters that affect URL:

```typescript
import { useRouter, useSearchParams } from "next/navigation";

const router = useRouter();
const searchParams = useSearchParams();

const handleFilterChange = (value: string) => {
  const params = new URLSearchParams(searchParams);
  params.set("filter", value);
  router.push(`/path?${params.toString()}`, { scroll: false });
};
```

## Environment Variables

Required in `.env.local`:

- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `CONTACT_TO` - Email recipient for contact form
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - Mail server config

**Never hardcode secrets** - always use `process.env.*`

## Database Schema Patterns

Tables follow this structure:

- `id: uuid` (primary key, default `gen_random_uuid()`)
- `is_active: boolean` - soft delete flag
- `sort_order: integer` - manual ordering
- `created_at: timestamptz` - timestamp

Always filter by `is_active = true` and order by `sort_order` then fallback field.

## Error Handling

- API routes: Log with prefix, return structured JSON:
  ```typescript
  console.error("[/api/endpoint] db error:", error);
  return NextResponse.json({ error: "db" }, { status: 500 });
  ```
- Client components: Show friendly empty/error states with retry buttons

## Build & Development

- `npm run dev` - Local dev server (port 3000)
- `npm run build` - Production build (validates types)
- `npm run lint` - ESLint (currently has config issues - focus on TypeScript errors)
- Node 20+ required

## Testing Changes

1. Check TypeScript errors: Use VS Code problems panel or `get_errors` tool
2. Test responsive layouts: Mobile (375px), Tablet (768px), Desktop (1024px+)
3. Verify animations: 60fps, no layout shift
4. Test API routes: Check network tab, verify error states

## Common Gotchas

- Always use `"use client"` directive for components with hooks, event handlers, or Framer Motion
- Import paths use `@/` alias (maps to root directory)
- Next.js Image component requires `width`, `height`, or `fill` prop
- Supabase queries return `{ data, error }` - always check `error` first
- Rate limiting in contact form is in-memory (resets on restart)

## When Adding New Features

1. Create API route following existing patterns
2. Build components under `components/[feature]/`
3. Create page wrapper + client page under `app/[feature]/`
4. Update types in component files or `typings.d.ts` if global
5. Test with VS Code errors tool and responsive preview

---

_This file reflects patterns discovered from actual codebase analysis. Update as architecture evolves._
