/* eslint-disable import/no-extraneous-dependencies */
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

function src(path: string): string {
  return fileURLToPath(new URL(`./src/${path}`, import.meta.url))
}

// Mirrors the `paths` block in tsconfig.json — vitest resolves through vite, which does not read it.
// Ordered: the `@presets/*` subpath pattern has to win before the bare `@presets` barrel.
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@presets\/(.*)$/, replacement: src('presets/$1') },
      { find: '@presets', replacement: src('presets/index.js') },
      { find: '@constants', replacement: src('constants/index.js') },
      { find: '@lib', replacement: src('lib/index.js') },
      { find: '@managers', replacement: src('presets/managers/index.js') },
      { find: '@groups', replacement: src('presets/groups/index.js') },
      { find: '@rings', replacement: src('presets/rings/index.js') },
      { find: '@datasources', replacement: src('presets/datasources/index.js') }
    ]
  },
  test: {
    include: ['test/**/*.test.ts']
  }
})
