# CI/CD Pipeline Documentation

## Overview

This portfolio project uses **GitHub Actions** for continuous integration and deployment, with automated testing, linting, and deployment to Vercel.

## Pipeline Architecture

### Workflows

#### 1. **Main CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)

Runs on every push to `main` or `develop` branches and on pull requests.

**Jobs:**

- **Lint & Type Check**
  - Runs ESLint to check code quality
  - Performs TypeScript type checking with `tsc --noEmit`
  - Ensures code meets style guidelines

- **Run Tests**
  - Executes Jest test suite with coverage
  - Uploads coverage reports to Codecov
  - Requires environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`

- **Build Application**
  - Compiles Next.js production build
  - Uploads build artifacts for deployment
  - Validates that code compiles without errors

- **Security Audit**
  - Runs `npm audit` to check for security vulnerabilities
  - Reports outdated dependencies
  - Continues even if non-critical issues found

- **Deploy to Vercel** (main branch only)
  - Automatically deploys to Vercel production
  - Only runs after all tests pass
  - Requires: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

#### 2. **Pull Request Checks** (`.github/workflows/pr-checks.yml`)

Runs on pull request events (open, sync, reopen).

**Jobs:**

- **PR Title Convention**
  - Enforces semantic PR titles (feat, fix, docs, etc.)
  - Helps maintain clean git history

- **PR Size Check**
  - Warns if PR is too large (>50 files or >1000 lines)
  - Encourages smaller, reviewable PRs

- **Preview Deployment**
  - Creates preview deployment on Vercel
  - Comments preview URL on PR for easy testing

#### 3. **Lighthouse CI** (`.github/workflows/lighthouse.yml`)

Runs performance audits on main branch and PRs.

**Checks:**

- Performance score (minimum 80%)
- Accessibility score (minimum 90%)
- Best practices score (minimum 90%)
- SEO score (minimum 90%)

Tests all pages:
- Home (`/`)
- Projects (`/projects-page`)
- Skills (`/skills-page`)
- Roadmap (`/roadmap-page`)
- Contact (`/contact-page`)

## Test Suite

### Test Structure

```
__tests__/
├── api/
│   └── health.test.ts         # API endpoint tests
├── components/
│   ├── header.test.tsx        # Header navigation tests
│   └── LoadingAnimation.test.tsx  # Loading component tests
├── lib/
│   └── validate.test.ts       # Email validation tests
└── environment.test.ts        # Environment variable tests
```

### Running Tests Locally

```powershell
# Install dependencies
npm install

# Run tests in watch mode (development)
npm test

# Run tests once with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Test Coverage Goals

- **Minimum coverage**: 70%
- **Target coverage**: 80%+
- **Priority areas**: 
  - API routes (100%)
  - Validation logic (100%)
  - Critical components (90%+)

## GitHub Secrets Configuration

### Required Secrets

Set these in your GitHub repository: **Settings → Secrets and variables → Actions**

#### Supabase (Required)

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

#### Vercel Deployment (Required for auto-deploy)
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

**How to get Vercel credentials:**

1. Install Vercel CLI: `npm i -g vercel`
2. Link project: `vercel link`
3. Get tokens:
   - Token: https://vercel.com/account/tokens
   - Org ID: `.vercel/project.json` after running `vercel link`
   - Project ID: `.vercel/project.json` after running `vercel link`

#### Optional
```
CODECOV_TOKEN=your-codecov-token  # For coverage reports
```

## Local Development

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm
- Git

### Setup

1. **Clone repository**
   ```powershell
   git clone https://github.com/Adamo-97/portofolio.git
   cd portofolio
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure environment**
   ```powershell
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Run tests**
   ```powershell
   npm test
   ```

5. **Start dev server**
   ```powershell
   npm run dev
   ```

### Pre-commit Checklist

Before pushing code:

- ✅ Run `npm run lint` - No linting errors
- ✅ Run `npm test` - All tests pass
- ✅ Run `npm run build` - Build succeeds
- ✅ Check `git status` - No unintended files

## Branch Strategy

### Main Branches

- **`main`** - Production branch
  - Protected
  - Requires PR reviews
  - Auto-deploys to Vercel production
  - All checks must pass

- **`develop`** - Development branch
  - Integration branch for features
  - Runs all CI checks
  - Preview deployments

### Feature Branches

Format: `feat/description`, `fix/bug-name`, `docs/update-readme`

**Workflow:**
```powershell
# Create feature branch
git checkout -b feat/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feat/new-feature
```

## PR Naming Convention

Use semantic commit prefixes:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Build process or tooling changes
- `perf:` - Performance improvements

**Examples:**
- ✅ `feat: add project filtering`
- ✅ `fix: resolve mobile navigation bug`
- ✅ `docs: update CI/CD documentation`
- ❌ `updated stuff`
- ❌ `Fixed bug`

## Monitoring & Alerts

### Build Status

Check pipeline status:
- **GitHub**: Repository → Actions tab
- **Vercel**: https://vercel.com/dashboard

### Coverage Reports

View test coverage:
- **Codecov**: https://codecov.io/gh/Adamo-97/portofolio
- **Local**: `npm run test:coverage` then open `coverage/lcov-report/index.html`

### Performance Monitoring

Lighthouse reports available in:
- GitHub Actions artifacts (downloadable)
- Temporary public storage (link in workflow run)

## Troubleshooting

### Pipeline Failures

**"Tests failed"**
- Run tests locally: `npm test`
- Check for missing env vars
- Review test output in Actions tab

**"Build failed"**
- Run build locally: `npm run build`
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all dependencies installed

**"Lint errors"**
- Run: `npm run lint`
- Auto-fix: `npm run lint -- --fix`

**"Vercel deployment failed"**
- Verify secrets are set correctly
- Check Vercel dashboard for detailed logs
- Ensure project is linked: `vercel link`

### Local Test Issues

**"Cannot find module"**
```powershell
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**"Tests timing out"**
```powershell
# Increase timeout in jest.config.js
testTimeout: 10000
```

## Performance Optimization

### Build Optimization

- **Image optimization**: Using Next.js `<Image>` component
- **Code splitting**: Automatic with Next.js App Router
- **API caching**: Smart revalidation (30min-2hrs)
- **Bundle analysis**: Run `npm run build` to see chunk sizes

### Testing Optimization

- **Parallel execution**: Jest runs tests in parallel
- **Watch mode**: `npm test` only runs affected tests
- **Coverage caching**: Speeds up subsequent runs

## Maintenance

### Weekly Tasks

- [ ] Review security audit results
- [ ] Check for outdated dependencies: `npm outdated`
- [ ] Review coverage trends
- [ ] Update dependencies: `npm update`

### Monthly Tasks

- [ ] Audit Lighthouse scores
- [ ] Review and clean up old preview deployments
- [ ] Update documentation
- [ ] Review and update GitHub Actions versions

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Last Updated**: October 19, 2025  
**Maintained By**: Adam Abdullah
