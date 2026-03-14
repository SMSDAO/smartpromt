import { describe, it, expect, beforeEach } from 'vitest'
import {
  rateLimit,
  clearRateLimit,
  getRateLimitInfo,
} from '../../lib/rate-limit'

const TEST_ID = 'test-user-rate-limit'

beforeEach(() => {
  clearRateLimit(TEST_ID)
})

describe('rateLimit (in-memory)', () => {
  it('allows requests under the limit', () => {
    const result = rateLimit(TEST_ID, { limit: 3, interval: 60_000 })
    expect(result.success).toBe(true)
    expect(result.limit).toBe(3)
    expect(result.remaining).toBe(2)
  })

  it('tracks consecutive requests', () => {
    rateLimit(TEST_ID, { limit: 3, interval: 60_000 })
    rateLimit(TEST_ID, { limit: 3, interval: 60_000 })
    const third = rateLimit(TEST_ID, { limit: 3, interval: 60_000 })
    expect(third.success).toBe(true)
    expect(third.remaining).toBe(0)
  })

  it('blocks requests that exceed the limit', () => {
    for (let i = 0; i < 3; i++) {
      rateLimit(TEST_ID, { limit: 3, interval: 60_000 })
    }
    const blocked = rateLimit(TEST_ID, { limit: 3, interval: 60_000 })
    expect(blocked.success).toBe(false)
    expect(blocked.remaining).toBe(0)
  })

  it('resets after the interval has elapsed', () => {
    // Exhaust the limit with a very short window
    for (let i = 0; i < 2; i++) {
      rateLimit(TEST_ID, { limit: 2, interval: 1 }) // 1 ms window
    }
    // Wait for the window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const result = rateLimit(TEST_ID, { limit: 2, interval: 1 })
        expect(result.success).toBe(true)
        resolve()
      }, 20)
    })
  })
})

describe('getRateLimitInfo', () => {
  it('returns full limit when no requests have been made', () => {
    const info = getRateLimitInfo(TEST_ID, { limit: 5, interval: 60_000 })
    expect(info.success).toBe(true)
    expect(info.remaining).toBe(5)
    expect(info.limit).toBe(5)
  })

  it('reflects consumed slots without consuming an additional slot', () => {
    rateLimit(TEST_ID, { limit: 5, interval: 60_000 })
    const info = getRateLimitInfo(TEST_ID, { limit: 5, interval: 60_000 })
    expect(info.remaining).toBe(4)
    // Calling getInfo again should not reduce remaining further
    const info2 = getRateLimitInfo(TEST_ID, { limit: 5, interval: 60_000 })
    expect(info2.remaining).toBe(4)
  })
})

describe('clearRateLimit', () => {
  it('removes the stored entry so the next request succeeds', () => {
    for (let i = 0; i < 3; i++) {
      rateLimit(TEST_ID, { limit: 3, interval: 60_000 })
    }
    clearRateLimit(TEST_ID)
    const result = rateLimit(TEST_ID, { limit: 3, interval: 60_000 })
    expect(result.success).toBe(true)
  })
})
