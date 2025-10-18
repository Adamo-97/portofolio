# Database Schema

This document describes the Supabase PostgreSQL database structure for the portfolio.

## Overview

The database uses PostgreSQL hosted on Supabase with the following tables:

- `skills` - Technical skills and tools
- `skill_categories` - Skill groupings
- `projects` - Portfolio projects
- `roadmap` - Career timeline events
- `contacts` - Contact form submissions

## Common Patterns

All tables follow these conventions:

### Standard Fields

```sql
id                uuid PRIMARY KEY DEFAULT gen_random_uuid()
created_at        timestamptz DEFAULT now()
is_active         boolean DEFAULT true
sort_order        integer
```

- **`id`**: UUID primary key, auto-generated
- **`created_at`**: Timestamp when record was created
- **`is_active`**: Soft delete flag (true = visible, false = hidden)
- **`sort_order`**: Manual ordering for display

### Querying Best Practices

Always filter by `is_active` and order by `sort_order`:

```typescript
const { data } = await supabase
  .from("table_name")
  .select("*")
  .eq("is_active", true)
  .order("sort_order", { ascending: true });
```

## Table Schemas

### 1. `skill_categories`

Organizes skills into groups (Frontend, Backend, Tools, etc.)

```sql
CREATE TABLE skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon_path text,
  color text,
  sort_order integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

**Fields:**
- `name` - Category name (e.g., "Frontend Development")
- `description` - Category description
- `icon_path` - Path to category icon in Supabase Storage
- `color` - Hex color for category styling
- `sort_order` - Display order
- `is_active` - Visibility toggle

**Example Data:**
```json
{
  "id": "uuid",
  "name": "Frontend Development",
  "description": "Client-side technologies and frameworks",
  "icon_path": "categories/frontend.svg",
  "color": "#18a1fd",
  "sort_order": 1,
  "is_active": true
}
```

**API Endpoint:** `/api/skill-categories`

---

### 2. `skills`

Individual technical skills with proficiency levels

```sql
CREATE TABLE skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category_id uuid REFERENCES skill_categories(id),
  icon_path text,
  proficiency integer CHECK (proficiency >= 0 AND proficiency <= 100),
  years_experience numeric(3,1),
  description text,
  sort_order integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

**Fields:**
- `name` - Skill name (e.g., "React", "TypeScript")
- `category_id` - Foreign key to `skill_categories`
- `icon_path` - Path to skill icon in Supabase Storage
- `proficiency` - Skill level (0-100)
- `years_experience` - Years of experience (e.g., 3.5)
- `description` - Skill details or notes
- `sort_order` - Display order within category
- `is_active` - Visibility toggle

**Example Data:**
```json
{
  "id": "uuid",
  "name": "React",
  "category_id": "frontend-category-uuid",
  "icon_path": "skills/react.svg",
  "proficiency": 90,
  "years_experience": 4.5,
  "description": "Expert in React hooks, context, and performance optimization",
  "sort_order": 1,
  "is_active": true
}
```

**API Endpoint:** `/api/skills`

---

### 3. `projects`

Portfolio projects with details and metadata

```sql
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  long_description text,
  category text,
  image_path text,
  github_url text,
  live_url text,
  technologies jsonb,
  featured boolean DEFAULT false,
  start_date date,
  end_date date,
  sort_order integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

**Fields:**
- `title` - Project name
- `description` - Short description (for cards)
- `long_description` - Detailed description (for modal/detail view)
- `category` - Project category (e.g., "Web App", "Mobile App")
- `image_path` - Project thumbnail in Supabase Storage
- `github_url` - GitHub repository URL
- `live_url` - Live demo URL
- `technologies` - Array of technologies used (JSON)
- `featured` - Flag for featured projects
- `start_date` - Project start date
- `end_date` - Project end date (null if ongoing)
- `sort_order` - Display order
- `is_active` - Visibility toggle

**Example Data:**
```json
{
  "id": "uuid",
  "title": "E-Commerce Platform",
  "description": "Full-stack e-commerce solution with payment integration",
  "long_description": "Built with Next.js and Stripe...",
  "category": "Web Application",
  "image_path": "projects/ecommerce-preview.jpg",
  "github_url": "https://github.com/user/project",
  "live_url": "https://example.com",
  "technologies": ["Next.js", "TypeScript", "Stripe", "Tailwind CSS"],
  "featured": true,
  "start_date": "2024-01-15",
  "end_date": "2024-06-30",
  "sort_order": 1,
  "is_active": true
}
```

**API Endpoint:** `/api/project`

---

### 4. `roadmap`

Career timeline and milestones

```sql
CREATE TABLE roadmap (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_type text,
  date date,
  year integer,
  icon_path text,
  color text,
  location text,
  company text,
  sort_order integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
```

**Fields:**
- `title` - Event title (e.g., "Started at Company X")
- `description` - Event details
- `event_type` - Type (e.g., "Education", "Career", "Achievement")
- `date` - Event date
- `year` - Year (for grouping)
- `icon_path` - Event icon in Supabase Storage
- `color` - Event color for timeline
- `location` - Event location
- `company` - Company/organization name
- `sort_order` - Timeline order (ascending = oldest first)
- `is_active` - Visibility toggle

**Example Data:**
```json
{
  "id": "uuid",
  "title": "Senior Software Engineer",
  "description": "Led development of microservices architecture",
  "event_type": "Career",
  "date": "2023-03-01",
  "year": 2023,
  "icon_path": "roadmap/career.svg",
  "color": "#18a1fd",
  "location": "San Francisco, CA",
  "company": "Tech Company Inc.",
  "sort_order": 5,
  "is_active": true
}
```

**API Endpoint:** `/api/roadmap`

---

### 5. `contacts`

Contact form submissions (stored for record-keeping)

```sql
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  ip_address text,
  user_agent text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
```

**Fields:**
- `name` - Sender's name
- `email` - Sender's email
- `message` - Message content
- `ip_address` - Sender's IP (for spam prevention)
- `user_agent` - Browser info
- `status` - Status (new, read, replied, archived)
- `created_at` - Submission timestamp

**Example Data:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to discuss a project...",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0...",
  "status": "new",
  "created_at": "2025-01-15T10:30:00Z"
}
```

**API Endpoint:** `/api/contact`

## Supabase Storage Buckets

### Bucket: `cv-icons`

Stores all static assets and the CV file

**Structure:**
```
cv-icons/
├── cv/
│   └── CV.pdf              # Downloadable CV
├── skills/
│   ├── react.svg
│   ├── typescript.svg
│   └── ...
├── categories/
│   ├── frontend.svg
│   └── ...
├── projects/
│   ├── project1.jpg
│   └── ...
└── roadmap/
    ├── education.svg
    └── ...
```

**Configuration:**
- Public bucket: Yes
- Max file size: 50MB
- Allowed types: Images (SVG, PNG, JPG), PDF

**Accessing Files:**

```typescript
// Get public URL
const { data } = supabase.storage
  .from("cv-icons")
  .getPublicUrl("skills/react.svg");

// Download file
const { data, error } = await supabase.storage
  .from("cv-icons")
  .download("cv/CV.pdf");
```

## Database Migrations

To add new tables or modify schema:

1. Go to Supabase Dashboard → SQL Editor
2. Run migration SQL
3. Update TypeScript types in `typings.d.ts`
4. Update API routes as needed

**Example Migration:**

```sql
-- Add new field to projects table
ALTER TABLE projects
ADD COLUMN tags text[];

-- Create index for better performance
CREATE INDEX idx_projects_category ON projects(category);
```

## Row Level Security (RLS)

Current RLS policies:

```sql
-- Public read access
CREATE POLICY "Public read access"
ON table_name
FOR SELECT
USING (is_active = true);

-- Admin write access
CREATE POLICY "Admin write access"
ON table_name
FOR ALL
USING (auth.role() = 'service_role');
```

**Security Notes:**
- All tables have public read (filtered by `is_active`)
- Write operations require service role (API routes)
- Contact submissions are write-only for clients

## Backup Strategy

Supabase handles automatic backups:
- Daily backups retained for 7 days
- Point-in-time recovery available
- Manual backups can be triggered in dashboard

## Performance Tips

### Indexes

Create indexes for frequently queried fields:

```sql
CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_roadmap_year ON roadmap(year);
```

### Queries

- Always use `select("specific,columns")` instead of `select("*")`
- Filter early with `eq`, `is`, `in` before sorting
- Use `limit()` for pagination
- Enable caching in production

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [API Routes Documentation](./FEATURES.md)
- [CV Download Setup](./CV_SETUP.md)
