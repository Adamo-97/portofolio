# 🎯 CI/CD Setup Checklist

Use this checklist to deploy your portfolio with the new CI/CD pipeline.

---

## ✅ Pre-Deployment Checklist

### 1. Verify Tests Pass
```powershell
npm run test:ci
```
**Expected:** All 17 tests passing ✅

### 2. Verify Build Works
```powershell
npm run build
```
**Expected:** Clean build with no errors ✅

### 3. Commit All Changes
```powershell
git add .
git commit -m "feat: add CI/CD pipeline and testing"
git push origin main
```

---

## 🔐 GitHub Secrets Configuration

Go to: **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets

| Secret Name | Where to Get It | Required For |
|------------|----------------|--------------|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API | ✅ Build & Tests |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | ✅ Build & Tests |

### Optional (For Auto-Deploy)

| Secret Name | Where to Get It | Required For |
|------------|----------------|--------------|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens | 🚀 Auto-Deploy |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link` | 🚀 Auto-Deploy |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after `vercel link` | 🚀 Auto-Deploy |

**Note:** If you skip Vercel secrets, you can still deploy manually via Vercel dashboard.

---

## 🔗 Link Vercel Project (Optional)

Only needed for auto-deployment:

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Link your project
vercel link

# Check .vercel/project.json for ORG_ID and PROJECT_ID
cat .vercel/project.json
```

---

## 🚀 First Deployment

### Option A: Automatic (Recommended)

1. ✅ Set GitHub secrets (above)
2. ✅ Push to main branch
3. ✅ GitHub Actions deploys automatically
4. ✅ Check Actions tab for status

### Option B: Manual

1. ✅ Push code to GitHub
2. ✅ Go to Vercel dashboard
3. ✅ Import from GitHub
4. ✅ Deploy

---

## 🔄 Post-Deployment

### Update URLs in Code

After first deploy, update these files with your actual Vercel URL:

**File:** `app/layout.tsx` (line ~28)
```typescript
metadataBase: new URL("https://your-actual-domain.vercel.app"),
```

**File:** `app/robots.ts` (line ~9)
```typescript
sitemap: "https://your-actual-domain.vercel.app/sitemap.xml",
```

**File:** `app/sitemap.ts` (line ~3)
```typescript
const baseUrl = "https://your-actual-domain.vercel.app";
```

---

## 🧪 Verify Pipeline Works

### 1. Check GitHub Actions
- Go to: Repository → Actions tab
- You should see workflows running
- All checks should be green ✅

### 2. Check Vercel Deployment
- Go to: https://vercel.com/dashboard
- Find your project
- Check deployment status

### 3. Test Your Site
- ✅ Visit your deployed URL
- ✅ Check all pages load
- ✅ Test contact form
- ✅ Download CV
- ✅ Check mobile responsiveness

---

## 📊 Monitor Quality

### Coverage Report
```powershell
npm run test:coverage
# Open: coverage/lcov-report/index.html
```

### Lighthouse Scores
- Check GitHub Actions → Lighthouse CI workflow
- Download artifacts for detailed reports

### Build Logs
- GitHub Actions → ci-cd workflow
- Vercel Dashboard → Deployments → View logs

---

## 🐛 Troubleshooting

### Pipeline Fails on "Lint & Type Check"
```powershell
npm run lint
npx tsc --noEmit
```
Fix errors and push again.

### Pipeline Fails on "Run Tests"
```powershell
npm run test:ci
```
Fix failing tests and push again.

### Pipeline Fails on "Build"
```powershell
npm run build
```
Check for TypeScript errors or missing dependencies.

### Deployment Fails
1. ✅ Check Vercel secrets are set correctly
2. ✅ Verify environment variables in Vercel dashboard
3. ✅ Check Vercel logs for specific error

### Tests Pass Locally but Fail in CI
- Check if env vars are set in GitHub Secrets
- Verify Node version matches (20.x)
- Check for OS-specific issues (paths, line endings)

---

## ✨ Success Criteria

Your deployment is successful when:

- ✅ GitHub Actions shows all green checks
- ✅ Vercel shows "Ready" status
- ✅ Site is accessible at your URL
- ✅ All pages load correctly
- ✅ Contact form works
- ✅ CV download works
- ✅ Mobile view works
- ✅ Lighthouse scores >80%

---

## 📞 Support

If you encounter issues:

1. Check `docs/CI_CD.md` for detailed troubleshooting
2. Review GitHub Actions logs
3. Check Vercel deployment logs
4. Verify all secrets are set correctly

---

## 🎊 You're All Set!

Once all checkboxes are ✅, your portfolio has:

- ✅ Automated testing
- ✅ Continuous integration
- ✅ Continuous deployment
- ✅ Quality monitoring
- ✅ Security scanning
- ✅ Performance tracking

**Next commit will trigger the full pipeline!** 🚀
