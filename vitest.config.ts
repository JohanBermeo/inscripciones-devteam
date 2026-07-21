import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts'],
    environment: 'node',
    setupFiles: [],
    testTimeout: 5000,
    coverage: {
      include: ['src/lib/**/*.ts'],
      exclude: ['src/lib/env.ts', 'src/lib/db/client.ts'],
    },
  },
});
