/**
 * Integration test for environment variables
 * Ensures all required env vars are present in production
 */

describe('Environment Variables', () => {
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ]

  const optionalEnvVars = [
    'CONTACT_TO',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
  ]

  describe('Required Variables', () => {
    requiredEnvVars.forEach(varName => {
      it(`should have ${varName} defined`, () => {
        expect(process.env[varName]).toBeDefined()
        expect(process.env[varName]).not.toBe('')
      })
    })
  })

  describe('Optional Variables', () => {
    it('should have at least CONTACT_TO for contact form', () => {
      // This is optional but recommended
      if (process.env.NODE_ENV === 'production') {
        expect(process.env.CONTACT_TO).toBeDefined()
      }
    })
  })

  describe('Supabase URL Format', () => {
    it('should be a valid URL', () => {
      const url = process.env.SUPABASE_URL
      expect(url).toMatch(/^https?:\/\//)
    })

    it('should contain supabase domain', () => {
      const url = process.env.SUPABASE_URL || ''
      expect(url).toContain('supabase')
    })
  })
})
