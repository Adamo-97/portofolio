# Testing Guide

## Quick Start

Run tests in development (watch mode):
```powershell
npm test
```

Run tests once with coverage:
```powershell
npm run test:coverage
```

Run tests in CI mode (for pipelines):
```powershell
npm run test:ci
```

## Test Structure

```
__tests__/
├── api/              # API route tests
├── components/       # Component tests
├── lib/              # Utility function tests
└── environment.test.ts  # Environment validation
```

## Current Test Coverage

- ✅ **17 tests passing**
- **LoadingAnimation**: 100% coverage
- **Header component**: Navigation and rendering
- **Email validation**: All validation rules
- **Environment variables**: Configuration checks
- **Health API**: Endpoint logic

## Writing New Tests

### Component Test Example

```typescript
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyComponent from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent text="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Utility Function Test Example

```typescript
import { myFunction } from '@/lib/utils'

describe('myFunction', () => {
  it('returns correct value', () => {
    expect(myFunction('input')).toBe('expected')
  })
})
```

## Mocking

Jest setup includes automatic mocking for:
- **Next.js router** (`useRouter`, `usePathname`, `useSearchParams`)
- **Framer Motion** (to avoid animation issues)
- **window.matchMedia** (for responsive tests)
- **IntersectionObserver** (for scroll-based components)

## Debugging Tests

### Run single test file
```powershell
npm test -- __tests__/components/header.test.tsx
```

### Run tests matching pattern
```powershell
npm test -- --testNamePattern="email validation"
```

### Update snapshots
```powershell
npm test -- -u
```

### View coverage HTML report
```powershell
npm run test:coverage
# Then open: coverage/lcov-report/index.html
```

## CI/CD Integration

Tests run automatically in GitHub Actions:
- On every push to `main` or `develop`
- On every pull request
- Before deployment to Vercel

**Requirements for merge:**
- ✅ All tests must pass
- ✅ No TypeScript errors
- ✅ No ESLint errors
- ✅ Build succeeds

## Best Practices

1. **Test behavior, not implementation**
   - Focus on what users see and interact with
   - Avoid testing internal state

2. **Keep tests simple and readable**
   - One assertion per test (when possible)
   - Clear test descriptions

3. **Use proper selectors**
   - Prefer `getByRole`, `getByLabelText`
   - Avoid `getByTestId` unless necessary

4. **Mock external dependencies**
   - API calls should be mocked
   - Database interactions should be mocked

5. **Maintain test coverage**
   - Aim for >70% coverage
   - Critical paths should have 100% coverage

## Troubleshooting

### "Cannot find module"
```powershell
npm install
```

### "Tests are timing out"
Increase timeout in `jest.config.js`:
```javascript
testTimeout: 10000
```

### "Snapshot mismatch"
```powershell
npm test -- -u  # Update snapshots
```

### "React Hook errors"
Make sure component is wrapped in proper provider:
```typescript
render(
  <RouterProvider>
    <MyComponent />
  </RouterProvider>
)
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing](https://nextjs.org/docs/testing)
