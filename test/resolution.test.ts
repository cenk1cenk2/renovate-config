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

describe('ignore modules and tests', () => {
  let central: RenovateConfig
  let unfiltered: RenovateConfig

  beforeAll(async() => {
    central = (await resolveConfigPresets({ extends: [`${SCOPE}${Preset.DEFAULT}`] })).config
    // The same graph without the filter: `default` resolved as the repository config itself, with its
    // `ignorePresets` emptied, which is what every consumer resolved before the filter landed.
    unfiltered = (await resolveConfigPresets({ ...structuredClone(await PRESETS[Preset.DEFAULT]), ignorePresets: [] })).config
  }, 60_000)

  // The baseline the filter exists to undo: if upstream stops ignoring test directories, the
  // `ignorePresets` entry filters nothing and this is the test that says so.
  it.each(TEST_PATHS)('ignores %s without the filter', (path) => {
    expect(unfiltered.ignorePaths).toContain(path)
  })

  it.each(TEST_PATHS)('stops ignoring %s through default', (path) => {
    expect(central.ignorePaths ?? []).not.toContain(path)
  })

  // Filtering one nested preset must leave the rest of the graph alone, in the same order.
  it('resolves the same package rules as the unfiltered graph', () => {
    expect(central.packageRules).toEqual(unfiltered.packageRules)
  })
})
