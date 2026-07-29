/* eslint-disable import/no-extraneous-dependencies */
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// `vite-tsconfig-paths` reads the `paths` block straight from tsconfig.json, so the aliases never get
// restated here — vite otherwise ignores tsconfig paths entirely. The tests live outside the base
// tsconfig's `include`, so point the plugin at the test project, which inherits the same `paths`.
export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['tsconfig.test.json'] })],
  test: {
    include: ['test/**/*.test.ts']
  }
})
