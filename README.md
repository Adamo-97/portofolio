# Portfolio Website

> A modern, full-stack portfolio website built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)](https://supabase.com/)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?logo=github-actions)](https://github.com/features/actions)
[![Tests](https://img.shields.io/badge/Tests-17_passing-success?logo=jest)](https://jestjs.io/)

##  Features

-  **Modern Design** - Glass-morphism effects, smooth animations, particle backgrounds
-  **Fully Responsive** - Mobile-first design, works on all devices
-  **Performance Optimized** - 90+ Lighthouse scores, code splitting, lazy loading
-  **Dynamic Content** - All content managed via Supabase (no redeployment needed)
-  **Contact Form** - Email integration with Nodemailer, rate limiting, validation
-  **CV Download** - Download resume directly from Supabase Storage with state feedback
-  **SEO Friendly** - Meta tags, sitemap, robots.txt
-  **Accessible** - WCAG AA compliant, keyboard navigation, screen reader support
-  **Dark Theme** - Elegant dark mode design with cornflowerblue accents
-  **Automated Testing** - Jest + React Testing Library with 17 tests
-  **CI/CD Pipeline** - GitHub Actions with automated deployment to Vercel

##  Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Architecture](./docs/ARCHITECTURE.md)** - Technical architecture, design patterns, project structure
- **[Database](./docs/DATABASE.md)** - Database schema, tables, Supabase Storage setup
- **[Features](./docs/FEATURES.md)** - Detailed features guide, API routes, components
- **[Styling](./docs/STYLING.md)** - Design system, styling patterns, animations
- **[Deployment](./docs/DEPLOYMENT.md)** - Deployment guide for Vercel, Netlify, self-hosted
- **[CV Setup](./docs/CV_SETUP.md)** - How to configure CV download from Supabase
- **[CI/CD Pipeline](./docs/CI_CD.md)** - GitHub Actions workflows, pipeline configuration
- **[Testing Guide](./docs/TESTING.md)** - How to write and run tests
- **[Setup Summary](./docs/SETUP_SUMMARY.md)** - CI/CD and testing setup overview

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- SMTP credentials (Gmail, SendGrid, etc.)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Adamo-97/portofolio.git
   cd portofolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` in the root directory:

   ```bash
   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   
   # Email Configuration
   CONTACT_TO=your-email@example.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

4. **Set up Supabase**

   - Create tables using schemas in [`docs/DATABASE.md`](./docs/DATABASE.md)
   - Create storage bucket `cv-icons` (public)
   - Upload your CV to `cv-icons/cv/CV.pdf`
   - Populate initial data (skills, projects, roadmap)

5. **Run development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

``` bash
portofolio/
├── app/                      # Next.js App Router
│   ├── api/                 # API routes (serverless functions)
│   ├── [page-name]/         # Feature pages
│   ├── fonts.ts             # Font configuration
│   ├── global.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── contact/            # Contact page components
│   ├── home/               # Home page components
│   ├── project/            # Projects components
│   ├── roadmap/            # Roadmap components
│   └── skills/             # Skills components
├── lib/                    # Utilities
│   ├── backend/           # Supabase client
│   └── contact/           # Email utilities
├── docs/                   # Documentation
├── public/                 # Static assets
└── src/                    # Source utilities
    └── hooks/             # Custom React hooks
```

##  Pages

### Home (`/`)

Landing page with introduction, animated greetings, and CV download button.

### Skills (`/skills-page`)

Technical skills organized by categories with proficiency indicators.

### Projects (`/projects-page`)

Portfolio projects with filtering, GitHub links, and technology tags.

- **Desktop:** Folder-style categories, dynamic scaling
- **Mobile:** 3×2 grid, horizontal category scroll

### Roadmap (`/roadmap-page`)

Career timeline with education, experience, and achievements.

### Contact (`/contact-page`)

Contact form with email integration, validation, and rate limiting.

## 🔧 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations

### Backend

- **Supabase** - PostgreSQL database + Storage
- **Nodemailer** - Email sending
- **Next.js API Routes** - Serverless endpoints

### Development

- **ESLint** - Code linting
- **VS Code** - Recommended editor

##  Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `CONTACT_TO` | Email to receive contact form submissions | Yes |
| `SMTP_HOST` | SMTP server host | Yes |
| `SMTP_PORT` | SMTP server port (usually 587) | Yes |
| `SMTP_USER` | SMTP username/email | Yes |
| `SMTP_PASS` | SMTP password/app password | Yes |

##  Available Scripts

```bash
npm run dev          # Start development server (port 3000/3001)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

Automatic deployments on every push to `main`.

See [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) for detailed instructions.


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

