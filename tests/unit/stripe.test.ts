import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// STRIPE_PRICE_IDS is evaluated at module-load time from process.env.
// Each test stubs the relevant env vars, resets the module registry so a
// fresh copy of lib/stripe is loaded, and then dynamically imports it —
// this exercises the real implementation without any mocking.

describe('getTierFromPriceId', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws when no Stripe price IDs are configured', async () => {
    vi.stubEnv('STRIPE_PRICE_ID_PRO', '')
    vi.stubEnv('STRIPE_PRICE_ID_ENTERPRISE', '')
    vi.stubEnv('STRIPE_PRICE_ID_LIFETIME', '')
    const { getTierFromPriceId } = await import('../../lib/stripe')
    expect(() => getTierFromPriceId('price_any')).toThrow(
      'Stripe price IDs are not configured'
    )
  })

  it('returns "pro" for the configured pro price ID', async () => {
    vi.stubEnv('STRIPE_PRICE_ID_PRO', 'price_pro_123')
    vi.stubEnv('STRIPE_PRICE_ID_ENTERPRISE', '')
    vi.stubEnv('STRIPE_PRICE_ID_LIFETIME', '')
    const { getTierFromPriceId } = await import('../../lib/stripe')
    expect(getTierFromPriceId('price_pro_123')).toBe('pro')
  })

  it('returns "enterprise" for the configured enterprise price ID', async () => {
    vi.stubEnv('STRIPE_PRICE_ID_PRO', '')
    vi.stubEnv('STRIPE_PRICE_ID_ENTERPRISE', 'price_ent_456')
    vi.stubEnv('STRIPE_PRICE_ID_LIFETIME', '')
    const { getTierFromPriceId } = await import('../../lib/stripe')
    expect(getTierFromPriceId('price_ent_456')).toBe('enterprise')
  })

  it('returns "lifetime" for the configured lifetime price ID', async () => {
    vi.stubEnv('STRIPE_PRICE_ID_PRO', '')
    vi.stubEnv('STRIPE_PRICE_ID_ENTERPRISE', '')
    vi.stubEnv('STRIPE_PRICE_ID_LIFETIME', 'price_lifetime_789')
    const { getTierFromPriceId } = await import('../../lib/stripe')
    expect(getTierFromPriceId('price_lifetime_789')).toBe('lifetime')
  })

  it('throws for an unrecognised price ID', async () => {
    vi.stubEnv('STRIPE_PRICE_ID_PRO', 'price_pro_123')
    vi.stubEnv('STRIPE_PRICE_ID_ENTERPRISE', '')
    vi.stubEnv('STRIPE_PRICE_ID_LIFETIME', '')
    const { getTierFromPriceId } = await import('../../lib/stripe')
    expect(() => getTierFromPriceId('price_unknown')).toThrow(
      'Unrecognized Stripe price ID: price_unknown'
    )
  })
})

describe('STRIPE_PRICE_IDS', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('has the expected keys', async () => {
    const { STRIPE_PRICE_IDS } = await import('../../lib/stripe')
    expect(STRIPE_PRICE_IDS).toHaveProperty('free')
    expect(STRIPE_PRICE_IDS).toHaveProperty('pro')
    expect(STRIPE_PRICE_IDS).toHaveProperty('enterprise')
    expect(STRIPE_PRICE_IDS).toHaveProperty('lifetime')
  })
})

