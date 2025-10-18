# Architecture Overview

This document describes the technical architecture of the portfolio website.

## Tech Stack

### Frontend
- **Framework:** Next.js 15.5.3 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4.1.3
- **Animations:** Framer Motion 12.23.22
- **UI Components:** React 19

### Backend
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Email:** Nodemailer (SMTP)
- **API:** Next.js API Routes (serverless)

### Development
- **Package Manager:** npm
- **Node Version:** 20+
- **Linting:** ESLint
- **Build Tool:** Next.js Compiler (Turbopack)

## Project Structure

```
portofolio/
├── app/                          # Next.js App Router
│   ├── [page-name]/             # Feature pages
│   │   ├── page.tsx            # Server component wrapper
│   │   └── [page-name]-page.tsx # Client component
│   ├── api/                     # API routes
│   │   ├── contact/            # Contact form endpoints
│   │   ├── cv/                 # CV download endpoint
│   │   ├── project/            # Projects data
│   │   ├── roadmap/            # Roadmap timeline
│   │   ├── skill-categories/   # Skill categories
│   │   └── skills/             # Skills data
│   ├── fonts.ts                # Font configuration
│   ├── global.css              # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page wrapper
│
├── components/                  # React components
│   ├── contact/                # Contact page components
│   ├── home/                   # Home page components
│   ├── project/                # Projects page components
│   ├── roadmap/                # Roadmap page components
│   ├── skills/                 # Skills page components
│   ├── footer.tsx              # Global footer
│   ├── header.tsx              # Global header
│   └── ...                     # Shared components
│
├── lib/                        # Shared utilities
│   ├── backend/                # Backend integrations
│   │   └── supabaseClient.ts  # Supabase client
│   └── contact/                # Contact form utilities
│       ├── mailer.ts           # Email configuration
│       └── validate.ts         # Email validation
│
├── src/                        # Source utilities
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utility functions
│
├── public/                     # Static assets
│   ├── contact/                # Contact page assets
│   └── home/                   # Home page assets
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md         # This file
│   ├── CV_SETUP.md            # CV download setup
│   ├── DATABASE.md            # Database schema
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── FEATURES.md            # Features documentation
│   └── STYLING.md             # Styling guidelines
│
└── Configuration files
    ├── next.config.js          # Next.js config
    ├── tailwind.config.js      # Tailwind config
    ├── tsconfig.json           # TypeScript config
    └── package.json            # Dependencies
```

## Design Patterns

### Page Pattern (Two-File Approach)

Each page follows a consistent pattern:

```tsx
// app/[feature]/page.tsx (Server Component)
import FeaturePage from "./feature-page";

export default function Page() {
  return <FeaturePage />;
}

// app/[feature]/feature-page.tsx (Client Component)
"use client";

export default function FeaturePage() {
  // Client-side logic, hooks, animations
}
```

**Why?**
- Separates server and client concerns
- Enables proper SSR/hydration
- Allows client-side features (hooks, animations)

### API Route Pattern

All API routes follow this structure:

```typescript
import { NextResponse } from "next/server";
import { supabase } from "@/lib/backend/supabaseClient";

export const runtime = "nodejs"; // For Node.js features
export const dynamic = "force-dynamic"; // Disable caching
export const revalidate = 0;

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("table_name")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[/api/endpoint] Error:", error);
      return NextResponse.json({ error: "message" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/endpoint] Unexpected error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

**Key Principles:**
- Always export runtime configuration
- Disable caching for dynamic data
- Log errors with endpoint prefix
- Return structured JSON responses
- Handle errors gracefully

### Component Organization

Components are organized by feature:

```
components/
├── [feature]/          # Feature-specific components
│   ├── ComponentA.tsx
│   ├── ComponentB.tsx
│   └── types.ts       # Shared types (if needed)
└── Shared.tsx         # Cross-feature components
```

**Benefits:**
- Easy to locate components
- Clear feature boundaries
- Better code splitting
- Improved maintainability

### State Management

- **Local State:** `useState` for component-level state
- **URL State:** `useSearchParams` for shareable filters
- **Server State:** API routes with client-side fetch
- **Global State:** Context API (minimal use)

### Animation Strategy

Using Framer Motion for all animations:

```tsx
// Mount animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: index * 0.1 }}
>

// Layout animations
<motion.div
  layoutId="uniqueId"
  transition={{ type: "spring", damping: 20 }}
>

// Hover/interaction animations
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

## Data Flow

### Client → Server → Database

```
User Action
    ↓
Client Component (fetch)
    ↓
API Route (/app/api/*)
    ↓
Supabase Client
    ↓
PostgreSQL Database
    ↓
Response (JSON)
    ↓
Client Component (render)
```

### Supabase Storage Flow

```
User Upload
    ↓
Supabase Storage Bucket
    ↓
API Route (getPublicUrl or download)
    ↓
Client (display or download)
```

## Performance Optimizations

### Image Optimization
- Next.js Image component for automatic optimization
- Responsive sizes with `sizes` prop
- Lazy loading by default
- WebP format conversion

### Code Splitting
- Automatic with Next.js App Router
- Dynamic imports for heavy components
- Route-based splitting

### Caching Strategy
- Static assets: Long-term cache (1 year)
- API routes: No cache (`revalidate: 0`)
- Images: Optimized and cached by Next.js

### Animation Performance
- CSS transforms (not top/left)
- `will-change` for animated elements
- `transform-gpu` for GPU acceleration
- Reduced motion support

## Security

### Environment Variables
All sensitive data in `.env.local`:
- Supabase credentials
- SMTP configuration
- API keys

### Rate Limiting
Contact form has in-memory rate limiting:
- 1 submission per 60 seconds per IP
- Prevents spam
- Resets on server restart

### Input Validation
- Email validation (regex + format check)
- File size limits for attachments
- Content sanitization
- CSRF protection (Next.js built-in)

### Database Security
- Row Level Security (RLS) enabled
- Public read, admin write
- `is_active` soft delete flag
- No direct database access from client

## Error Handling

### API Routes
```typescript
// Structured error responses
return NextResponse.json(
  { error: "User-friendly message", details: errorDetails },
  { status: 500 }
);
```

### Client Components
```tsx
// Try-catch with user feedback
try {
  await fetchData();
  setSuccess(true);
} catch (error) {
  console.error("Error:", error);
  setError("Please try again");
}
```

### Logging
- Console logs prefixed with `[Component/Route]`
- Error details logged server-side
- User-friendly messages client-side

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS 14+, Android 10+

## Accessibility

- Semantic HTML elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible styles
- Color contrast compliance (WCAG AA)
- Reduced motion support

## Future Considerations

### Scalability
- Current: Serverless (Vercel/Netlify)
- Future: Could add CDN for assets
- Database: Supabase scales automatically

### Monitoring
- Consider adding: Sentry for error tracking
- Analytics: Vercel Analytics or Google Analytics
- Performance: Web Vitals monitoring

### Internationalization (i18n)
- Structure supports multi-language
- Would need: next-intl or similar
- Database: Add locale fields

## Development Workflow

1. **Local Development:** `npm run dev` (port 3001)
2. **Build:** `npm run build`
3. **Lint:** `npm run lint`
4. **Type Check:** Check VS Code Problems panel

## Related Documentation

- [Database Schema](./DATABASE.md)
- [Features Guide](./FEATURES.md)
- [Styling Guidelines](./STYLING.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [CV Setup](./CV_SETUP.md)
