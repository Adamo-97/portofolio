import { isValidEmail, NAME_MAX, EMAIL_MAX, MESSAGE_MAX } from '@/lib/contact/validate'

describe('Email Validation', () => {
  describe('isValidEmail', () => {
    it('validates correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.com')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('notanemail')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user @example.com')).toBe(false)
    })

    it('handles edge cases', () => {
      // Email validation requires proper TLD (2-24 letters)
      expect(isValidEmail('test@example.io')).toBe(true)
      expect(isValidEmail('user@domain.technology')).toBe(true)
    })
  })

  describe('Validation Constants', () => {
    it('has reasonable length limits', () => {
      expect(NAME_MAX).toBeGreaterThan(0)
      expect(EMAIL_MAX).toBeGreaterThan(0)
      expect(MESSAGE_MAX).toBeGreaterThan(0)
      
      expect(NAME_MAX).toBeLessThanOrEqual(100)
      expect(EMAIL_MAX).toBeLessThanOrEqual(255)
      expect(MESSAGE_MAX).toBeGreaterThanOrEqual(500)
    })
  })
})
