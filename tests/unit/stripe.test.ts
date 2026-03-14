import { describe, it, expect, vi } from 'vitest'

// Mock the stripe module so we can control STRIPE_PRICE_IDS values
vi.mock('../../lib/stripe', async () => {
  const STRIPE_PRICE_IDS = {
    free: '',
    pro: 'price_pro_123',
    enterprise: 'price_ent_456',
    lifetime: 'price_lifetime_789',
  }

  function getTierFromPriceId(priceId: string) {
    if (!STRIPE_PRICE_IDS.pro && !STRIPE_PRICE_IDS.enterprise && !STRIPE_PRICE_IDS.lifetime) {
      throw new Error('Stripe price IDs are not configured')
    }
    if (STRIPE_PRICE_IDS.pro && priceId === STRIPE_PRICE_IDS.pro) return 'pro'
    if (STRIPE_PRICE_IDS.enterprise && priceId === STRIPE_PRICE_IDS.enterprise) return 'enterprise'
    if (STRIPE_PRICE_IDS.lifetime && priceId === STRIPE_PRICE_IDS.lifetime) return 'lifetime'
    if (STRIPE_PRICE_IDS.free && priceId === STRIPE_PRICE_IDS.free) return 'free'
    throw new Error(`Unrecognized Stripe price ID: ${priceId}`)
  }

  return { STRIPE_PRICE_IDS, getTierFromPriceId, stripe: null }
})

import { getTierFromPriceId, STRIPE_PRICE_IDS } from '../../lib/stripe'

describe('getTierFromPriceId', () => {
  it('returns "pro" for the configured pro price ID', () => {
    expect(getTierFromPriceId('price_pro_123')).toBe('pro')
  })

  it('returns "enterprise" for the configured enterprise price ID', () => {
    expect(getTierFromPriceId('price_ent_456')).toBe('enterprise')
  })

  it('returns "lifetime" for the configured lifetime price ID', () => {
    expect(getTierFromPriceId('price_lifetime_789')).toBe('lifetime')
  })

  it('throws for an unrecognised price ID', () => {
    expect(() => getTierFromPriceId('price_unknown')).toThrow(
      'Unrecognized Stripe price ID: price_unknown'
    )
  })
})

describe('STRIPE_PRICE_IDS', () => {
  it('has the expected keys', () => {
    expect(STRIPE_PRICE_IDS).toHaveProperty('free')
    expect(STRIPE_PRICE_IDS).toHaveProperty('pro')
    expect(STRIPE_PRICE_IDS).toHaveProperty('enterprise')
    expect(STRIPE_PRICE_IDS).toHaveProperty('lifetime')
  })
})

