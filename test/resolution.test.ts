import { resolveConfigPresets } from 'renovate/dist/config/presets/index.js'
import type { RenovateConfig } from 'renovate/dist/config/types.js'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { SCOPE } from '@constants'
import { PRESETS, Preset } from '@presets'

// Serves every `local>` preset from the assembled registry, so renovate's own resolver walks the same
// `extends` graph a consuming repository gets from `default.json`. The internal presets it reaches, such as
// `config:recommended`, come from the installed renovate. `vitest.config.ts` inlines renovate, or its
// dynamic import of the local source would bypass the mock.
vi.mock('renovate/dist/config/presets/local/index.js', () => ({
  getPreset: async({ presetName }: { presetName: string }): Promise<RenovateConfig> => structuredClone(await PRESETS[presetName.replace(/^default\//, '') as Preset])
}))

const TEST_PATHS = ['**/__tests__/**', '**/test/**', '**/tests/**']

const resolve = async(...extended: Preset[]): Promise<RenovateConfig> => (await resolveConfigPresets({ extends: extended.map((name) => `${SCOPE}${name}`) })).config

describe('default-with-test-paths', () => {
  let central: RenovateConfig
  let wrapped: RenovateConfig

  beforeAll(async() => {
    central = await resolve(Preset.DEFAULT)
    wrapped = await resolve(Preset.DEFAULT_WITH_TEST_PATHS)
  }, 60_000)

  // The baseline the preset exists to undo: if upstream stops ignoring test directories, the
  // `ignorePresets` entry filters nothing and this is the test that says so.
  it.each(TEST_PATHS)('ignores %s through default', (path) => {
    expect(central.ignorePaths).toContain(path)
  })

  it.each(TEST_PATHS)('stops ignoring %s', (path) => {
    expect(wrapped.ignorePaths ?? []).not.toContain(path)
  })

  // Filtering one nested preset must leave the rest of the graph alone, in the same order — a replayed
  // `config:recommended` would append its rules after every central one.
  it('resolves the same package rules as default', () => {
    expect(wrapped.packageRules).toEqual(central.packageRules)
  })
})
