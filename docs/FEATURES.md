# Features Documentation

This document describes all features and functionality of the portfolio website.

## Pages

### 1. Home Page (`/`)

**Purpose:** Landing page with introduction and call-to-action

**Components:**
- `HelloBadge` - Animated greeting badge
- `TypeText` - Typewriter effect for name
- `RoleCycler` - Rotating role titles
- `FloatingCards` - Animated background cards
- `MainPicPlaceholder` - Profile photo
- `DownloadCvButton` - CV download with states
- `BgBlur` - Background blur effects
- `WordBubble` - Floating text elements

**Features:**
- Entrance animations with staggered delays
- Particle effects background
- Responsive layout (mobile/desktop)
- CV download with loading states
- Smooth transitions between sections

**Key Interactions:**
- CV button shows: Idle → Downloading → Downloaded/Error
- Hover effects on interactive elements
- Scroll-based animations

---

### 2. Skills Page (`/skills-page`)

**Purpose:** Display technical skills organized by category

**Components:**
- `CategoryCarousel` - Horizontal category selector
- `SkillsGrid` - Grid of skill cards
- `SkillCard` - Individual skill display
- `SkillIcon` - Skill logo with fallback

**Features:**
- Category-based filtering
- Carousel navigation (desktop: arrows, mobile: swipe)
- Skill proficiency indicators
- Years of experience display
- Responsive grid layout
- Smooth category transitions

**Data Structure:**
```typescript
interface Skill {
  id: string;
  name: string;
  category_id: string;
  icon_path: string;
  proficiency: number; // 0-100
  years_experience: number;
  description: string;
  sort_order: number;
}
```

**API:** `GET /api/skills`, `GET /api/skill-categories`

---

### 3. Projects Page (`/projects-page`)

**Purpose:** Showcase portfolio projects

**Components:**
- `CategoryFolder` - Folder-style category buttons (desktop)
- `ProjectCard` - Individual project cards
- `ProjectsFilter` - Category filter UI
- `LanguageChips` - Technology tags

**Features:**

**Desktop:**
- Folder-style category buttons (open/closed states)
- Dynamic card scaling based on project count
  - 1-3 projects: 100% scale
  - 4-6 projects: 85% scale
  - 7-9 projects: 70% scale
  - 10+ projects: 60% scale
- Centered layout with smooth transitions
- Hover effects on cards

**Mobile:**
- Horizontal category button scroll
- 3×2 grid layout (first 6 projects)
- Compact card design
- Touch-optimized interactions

**Card Features:**
- Project thumbnail
- Title and category
- Technology chips
- GitHub link icon
- Description preview (line-clamp)
- Hover: scale and glow effects

**Data Structure:**
```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image_path: string;
  github_url?: string;
  live_url?: string;
  technologies: string[];
  featured: boolean;
  sort_order: number;
}
```

**API:** `GET /api/project`

**URL State:** `?category=Web%20App` (shareable filters)

---

### 4. Roadmap Page (`/roadmap-page`)

**Purpose:** Career timeline and milestones

**Components:**
- `StreetTimeline` - Main timeline container
- `RoadNode` - Timeline event nodes
- `RoadLine` - Connecting lines between events
- `RoadText` - Event details

**Features:**
- Vertical timeline layout
- Chronological ordering (oldest → newest)
- Event categories with color coding
- Responsive spacing
- Scroll animations
- Year grouping

**Event Types:**
- Education (blue)
- Career (green)
- Achievement (gold)
- Certification (purple)

**Data Structure:**
```typescript
interface RoadmapEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  date: string;
  year: number;
  icon_path: string;
  color: string;
  location?: string;
  company?: string;
  sort_order: number;
}
```

**API:** `GET /api/roadmap`

---

### 5. Contact Page (`/contact-page`)

**Purpose:** Contact form with email integration

**Components:**
- `NameContainer` - Name input field
- `email-form` - Main form container
- `SendButton` - Submit button with states
- `photo-social-container` - Social links
- Particle animation background
- Fog gradient effects

**Features:**

**Form Fields:**
- Name (required, max 100 chars)
- Email (required, validated)
- Message (required, max 2000 chars, textarea)
- File attachments (optional, max 5MB)

**Validation:**
- Real-time email format check
- Character limits enforced
- Required field indicators
- Error messages on invalid input

**Submission States:**
1. Idle - Ready to send
2. Sending - Shows loading spinner
3. Success - Green checkmark + confirmation
4. Error - Red X + error message

**Rate Limiting:**
- 1 submission per 60 seconds per IP
- In-memory storage (resets on restart)
- User-friendly error message

**Email Integration:**
- Uses Nodemailer with SMTP
- Sends to configured email address
- Includes sender info and message
- Attachment support (if enabled)

**Styling:**
- Modern glass-morphism inputs
- Cornflowerblue accent colors
- Glossy top edges on inputs
- Multi-layer shadows with glow
- Particle background (220 desktop, 120 mobile)
- Fog gradients (top-left, bottom-right)

**Data Flow:**
```
User Input → Validation → POST /api/contact/send
    → Rate Check → Email Send → Database Store
    → Response (success/error)
```

**APIs:**
- `GET /api/contact` - Get contact info
- `POST /api/contact/send` - Send email

---

## Global Components

### Header

**Features:**
- Logo/brand
- Navigation menu
- Active page indicator
- Responsive (hamburger menu on mobile)
- Sticky positioning

**Navigation:**
- Home
- Skills
- Projects
- Roadmap
- Contact

### Footer

**Features:**
- Copyright information
- Social media links
- Quick links
- Built with technologies badge

### Loading Animation

**Component:** `LoadingAnimation`

**Features:**
- Skeleton screens
- Smooth fade-in transitions
- Branded loading spinner
- Used during data fetching

### Route Scroll Navigator

**Component:** `RouteScrollNavigator`

**Features:**
- Scroll progress indicator
- Smooth scroll to top
- Page transition handling

---

## Special Features

### 1. CV Download System

**Location:** Home page

**Flow:**
1. User clicks "Download CV" button
2. Button shows "Downloading..." state
3. Fetches from `/api/cv?t=timestamp` (cache-busting)
4. API downloads from Supabase Storage (`cv-icons/cv/CV.pdf`)
5. Serves file with download headers
6. Browser downloads file
7. Button shows "Downloaded ✓" (green) or "Error - Retry" (red)
8. Auto-resets to idle after 3 seconds

**States:**
- Idle: Blue background, download icon
- Downloading: Blue background, spinning loader, cursor-wait
- Downloaded: Green background, checkmark icon
- Error: Red background, error icon, clickable to retry

**Technical Details:**
- Direct `<a download>` approach (bypasses fetch caching)
- Timestamp query parameter prevents browser cache
- Server logs show successful 200 responses
- Node.js runtime for Buffer operations

**See:** [CV Setup Guide](./CV_SETUP.md)

---

### 2. Particle Animation System

**Used on:** Projects, Roadmap, Contact pages

**Features:**
- Canvas-based rendering
- DPR-aware (high-res displays)
- Performance optimized (max 45 FPS)
- Pauses when page hidden
- Respects `prefers-reduced-motion`

**Configuration:**
```typescript
PARTICLES_DESKTOP: 220
PARTICLES_MOBILE: 120
PARTICLE_SPEED: 0.2
PARTICLE_SIZE: 1-3px
TWINKLE_SPEED: 0.02
```

**Effect:**
- Twinkling stars
- Slow random movement
- Depth via opacity and size
- Cornflowerblue color (#18a1fd)

---

### 3. Glass-Morphism Effects

**Used on:** Contact form, Cards, Buttons

**Properties:**
- `backdrop-filter: blur(15px)`
- Semi-transparent backgrounds
- Border glow effects
- Multi-layer shadows
- Inset highlights

**Example:**
```css
background: rgba(15, 23, 41, 0.7);
backdrop-filter: blur(15px);
border: 2px solid rgba(24, 161, 253, 0.3);
box-shadow:
  0 4px 20px rgba(24, 161, 253, 0.15),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

---

### 4. Responsive Design

**Breakpoints:**
```typescript
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
```

**Strategies:**
- Mobile-first approach
- Fluid typography with `clamp()`
- Flexible grids with CSS Grid/Flexbox
- Touch-optimized interactions on mobile
- Hover states only on desktop

**Mobile Optimizations:**
- Reduced particle count (120 vs 220)
- Simplified layouts (fewer columns)
- Larger touch targets (min 44px)
- Horizontal scrolling for categories
- Compact card designs

---

### 5. Animation System

**Library:** Framer Motion

**Patterns:**

**Mount Animations:**
```typescript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4, delay: index * 0.1 }}
```

**Layout Animations:**
```typescript
layoutId="uniqueId"
transition={{ type: "spring", damping: 20 }}
```

**Hover Animations:**
```typescript
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}
```

**Stagger Effects:**
```typescript
transition={{ delay: index * 0.1 }}
```

---

## API Routes

### Skills

**Endpoint:** `GET /api/skills`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "React",
    "category_id": "uuid",
    "icon_path": "skills/react.svg",
    "proficiency": 90,
    "years_experience": 4.5,
    "description": "...",
    "sort_order": 1,
    "is_active": true
  }
]
```

**Endpoint:** `GET /api/skill-categories`

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Frontend Development",
    "description": "...",
    "icon_path": "categories/frontend.svg",
    "color": "#18a1fd",
    "sort_order": 1,
    "is_active": true
  }
]
```

### Projects

**Endpoint:** `GET /api/project`

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Project Name",
    "description": "Short description",
    "category": "Web Application",
    "image_path": "projects/image.jpg",
    "github_url": "https://github.com/user/repo",
    "technologies": ["React", "TypeScript"],
    "featured": true,
    "sort_order": 1,
    "is_active": true
  }
]
```

### Roadmap

**Endpoint:** `GET /api/roadmap`

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Event Title",
    "description": "Event details",
    "event_type": "Career",
    "date": "2023-01-15",
    "year": 2023,
    "icon_path": "roadmap/career.svg",
    "color": "#18a1fd",
    "location": "City, State",
    "company": "Company Name",
    "sort_order": 1,
    "is_active": true
  }
]
```

### Contact

**Endpoint:** `GET /api/contact`

**Response:**
```json
{
  "email": "your@email.com",
  "phone": "+1234567890",
  "social": {
    "github": "https://github.com/username",
    "linkedin": "https://linkedin.com/in/username",
    "twitter": "https://twitter.com/username"
  }
}
```

**Endpoint:** `POST /api/contact/send`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Response (Error):**
```json
{
  "error": "Rate limit exceeded. Please wait before sending another message."
}
```

### CV Download

**Endpoint:** `GET /api/cv`

**Headers:**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="CV.pdf"
Content-Length: 161360
Cache-Control: no-cache, no-store, must-revalidate
```

**Response:** Binary PDF file

**Test Endpoint:** `GET /api/cv/test`

Shows bucket contents and debug info

---

## Performance Metrics

**Target Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**Optimizations Applied:**
- Image optimization with Next.js Image
- Code splitting per route
- CSS-in-JS with zero runtime cost
- GPU-accelerated animations
- Lazy loading for heavy components
- API response caching where appropriate

---

## Accessibility Features

- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`)
- ARIA labels on interactive elements
- Keyboard navigation support (Tab, Enter, Escape)
- Focus visible styles
- Color contrast WCAG AA compliance
- Alt text on all images
- `prefers-reduced-motion` support
- Screen reader friendly

---

## Related Documentation

- [Architecture](./ARCHITECTURE.md)
- [Database Schema](./DATABASE.md)
- [Styling Guidelines](./STYLING.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [CV Setup](./CV_SETUP.md)
