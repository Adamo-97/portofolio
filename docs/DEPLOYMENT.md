# Deployment Guide

This guide covers deploying the portfolio to production.

## Prerequisites

Before deploying, ensure you have:

- [ ] Supabase project set up with all tables
- [ ] Environment variables configured
- [ ] CV uploaded to Supabase Storage
- [ ] All content (skills, projects, roadmap) populated
- [ ] SMTP credentials for contact form
- [ ] GitHub repository (for CI/CD)

## Environment Variables

Create `.env.local` (development) and configure on hosting platform (production):

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Contact Form Email
CONTACT_TO=your-email@example.com

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Security Note:** Never commit `.env.local` to git (already in `.gitignore`)

## Platform Options

### Option 1: Vercel (Recommended)

**Why Vercel:**
- Built by Next.js creators
- Automatic deployments from Git
- Edge network (fast worldwide)
- Free tier generous for portfolios
- Built-in analytics

**Steps:**

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js settings

3. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Save

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Site live at `your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your domain (e.g., `yourname.com`)
   - Update DNS records as instructed
   - SSL certificate auto-generated

**Automatic Deployments:**
- Every push to `main` triggers deployment
- Preview deployments for pull requests
- Rollback to previous deployments anytime

---

### Option 2: Netlify

**Why Netlify:**
- Similar features to Vercel
- Good for static sites
- Free tier available
- Form handling built-in

**Steps:**

1. **Connect Repository**
   ```bash
   git push origin main
   ```

2. **Import to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import existing project"
   - Connect GitHub and select repo

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add all from `.env.local`

5. **Deploy**
   - Click "Deploy site"
   - Site live at `your-site.netlify.app`

---

### Option 3: Self-Hosted (VPS)

**Requirements:**
- Ubuntu 22.04+ server
- Node.js 20+
- Nginx
- PM2 for process management

**Steps:**

1. **Server Setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 20
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Clone Repository**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

3. **Install Dependencies**
   ```bash
   npm ci --production
   ```

4. **Configure Environment**
   ```bash
   nano .env.local
   # Add all environment variables
   ```

5. **Build**
   ```bash
   npm run build
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "portfolio" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Build Optimization

### 1. Analyze Bundle Size

```bash
# Install analyzer
npm install @next/bundle-analyzer

# Update next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Analyze
ANALYZE=true npm run build
```

### 2. Image Optimization

All images should:
- Be in WebP format when possible
- Have proper `width` and `height`
- Use `priority` prop for above-fold images
- Use `sizes` prop for responsive images

### 3. Code Splitting

Already automatic with App Router, but verify:
```bash
# Check route chunks
npm run build
# Look for route-specific bundles
```

## Performance Checklist

Before deploying:

- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test on mobile devices
- [ ] Verify all images load
- [ ] Check contact form works
- [ ] Test CV download
- [ ] Verify all API routes work
- [ ] Check console for errors
- [ ] Test on different browsers

## Post-Deployment

### 1. Monitor Performance

**Vercel Analytics:**
- Included free with Vercel
- Real User Monitoring (RUM)
- Web Vitals tracking

**Google Analytics (Optional):**
```tsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
    </html>
  )
}
```

### 2. Error Tracking (Optional)

**Sentry:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 3. Uptime Monitoring

Use services like:
- UptimeRobot (free)
- Pingdom
- StatusCake

### 4. SEO Optimization

**Add sitemap:**
```typescript
// app/sitemap.ts
export default function sitemap() {
  return [
    {
      url: 'https://yoursite.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://yoursite.com/skills-page',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // ... other pages
  ];
}
```

**Add robots.txt:**
```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://yoursite.com/sitemap.xml',
  };
}
```

**Meta tags in layout.tsx:**
```tsx
export const metadata = {
  title: 'Your Name - Portfolio',
  description: 'Full-stack developer specializing in...',
  openGraph: {
    title: 'Your Name - Portfolio',
    description: 'Full-stack developer...',
    url: 'https://yoursite.com',
    siteName: 'Your Name',
    images: [
      {
        url: 'https://yoursite.com/og-image.jpg',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};
```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Build Fails

**Error: "Module not found"**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

**Error: "Environment variable not defined"**
- Verify all vars in platform settings
- Check for typos
- Ensure no trailing spaces

### Deployment Issues

**502 Bad Gateway**
- Check PM2 status: `pm2 status`
- Restart: `pm2 restart portfolio`
- Check logs: `pm2 logs portfolio`

**CORS Errors**
- Verify API routes have correct headers
- Check Supabase RLS policies

**Images Not Loading**
- Verify Supabase bucket is public
- Check paths in database
- Test getPublicUrl()

## Updating in Production

### Content Updates

**Update CV:**
1. Go to Supabase Storage
2. Replace `CV.pdf` in `cv-icons/cv/`
3. Changes immediate (no redeploy)

**Update Skills/Projects:**
1. Go to Supabase Tables
2. Edit data directly
3. Changes immediate (no redeploy)

### Code Updates

```bash
# 1. Make changes locally
git add .
git commit -m "Update feature"

# 2. Push to GitHub
git push origin main

# 3. Auto-deploys on Vercel/Netlify
# Or manually trigger deployment
```

### Rollback

**Vercel:**
- Go to Deployments
- Find previous working deployment
- Click "Promote to Production"

**Manual:**
```bash
git revert HEAD
git push origin main
```

## Security Best Practices

1. **Never expose secrets**
   - Use environment variables
   - Don't commit `.env.local`
   - Rotate keys regularly

2. **Enable HTTPS**
   - Free with Vercel/Netlify
   - Use Let's Encrypt for VPS

3. **Rate limiting**
   - Already implemented for contact form
   - Consider adding for API routes

4. **Content Security Policy**
   ```tsx
   // next.config.js
   headers: async () => [
     {
       source: '/:path*',
       headers: [
         {
           key: 'Content-Security-Policy',
           value: "default-src 'self'; img-src 'self' data: https://your-supabase.co",
         },
       ],
     },
   ],
   ```

## Costs

### Free Tier Limits

**Vercel:**
- 100 GB bandwidth/month
- Unlimited builds
- 100 deployments/day
- Serverless functions: 100 GB-hours

**Netlify:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

**Supabase:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/month
- 50,000 monthly active users

**Sufficient for most portfolios!**

## Related Documentation

- [Architecture](./ARCHITECTURE.md)
- [Features](./FEATURES.md)
- [Database](./DATABASE.md)
- [CV Setup](./CV_SETUP.md)
