import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['lib/**/*.ts'],
      exclude: ['lib/supabase.ts', 'lib/supabase-client.ts'],
    },
  },
  resolve: {
    alias: {
      '@': projectRoot,
    },
  },
})
