import { getConfig } from 'renovate/dist/config/defaults.js'
import { resolveConfigPresets } from 'renovate/dist/config/presets/index.js'
import type { PackageRule, RenovateConfig } from 'renovate/dist/config/types.js'
import { mergeChildConfig } from 'renovate/dist/config/utils.js'
import type { PackageDependency } from 'renovate/dist/modules/manager/types.js'
import type { BranchConfig } from 'renovate/dist/workers/types.js'
import { branchifyUpgrades } from 'renovate/dist/workers/repository/updates/branchify.js'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { SCOPE } from '@constants'
import { Managers } from '@managers'
import { PRESETS, Preset } from '@presets'

// Serves every `local>` preset from the assembled registry, so renovate's own resolver walks the same
// `extends` graph a consuming repository gets from `default.json`. The internal presets it reaches, such as
// `config:recommended`, come from the installed renovate. `vitest.config.ts` inlines renovate, or its
// dynamic import of the local source would bypass the mock.
vi.mock('renovate/dist/config/presets/local/index.js', () => ({
  getPreset: async ({ presetName }: { presetName: string }): Promise<RenovateConfig> => structuredClone(await PRESETS[presetName.replace(/^default\//, '') as Preset])
}))

const TEST_PATHS = ['**/__tests__/**', '**/test/**', '**/tests/**']

describe('ignore modules and tests', () => {
  let central: RenovateConfig
  let unfiltered: RenovateConfig

  beforeAll(async () => {
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

describe('go indirect dependencies', () => {
  let central: RenovateConfig

  beforeAll(async () => {
    central = (await resolveConfigPresets({ extends: [`${SCOPE}${Preset.DEFAULT}`] })).config
  }, 60_000)

  // `enabled` is last-match-wins, so the disable only holds while no later rule that can reach an indirect
  // gomod dependency, served by the `go` datasource, turns it back on.
  it('disables indirect go module dependencies through default', () => {
    const rules = central.packageRules ?? []
    const index = rules.findLastIndex((rule) => rule.matchManagers?.includes(Managers.GO) && rule.matchDepTypes?.includes('indirect') && rule.enabled === false)
    const reachesIndirect = (rule: PackageRule): boolean =>
      (!rule.matchManagers || rule.matchManagers.includes(Managers.GO)) &&
      (!rule.matchDatasources || rule.matchDatasources.includes('go')) &&
      (!rule.matchDepTypes || rule.matchDepTypes.includes('indirect'))

    expect(index).toBeGreaterThanOrEqual(0)
    expect(rules.slice(index + 1).filter((rule) => rule.enabled === true && reachesIndirect(rule))).toEqual([])
  })
})

// GitLab skips a pipeline when the marker appears anywhere in the commit message, but renovate derives the
// merge request title from the first line only (`compilePrTitle` in `updates/generate.js`) and appends
// `commitBody` after a blank line when it commits (`update/branch/index.js`). A merge commit built from
// that title therefore carries no marker, while the branch commit still skips its own pipeline.
describe('skip ci marker', () => {
  const SKIP_CI = /\[(skip ci|ci skip)\]/i

  let branches: BranchConfig[]

  beforeAll(async () => {
    const { config: central } = await resolveConfigPresets({ extends: [`${SCOPE}${Preset.DEFAULT}`] })
    const config: RenovateConfig = { ...mergeChildConfig(getConfig(), central), errors: [], warnings: [], repoIsOnboarded: true }
    const dep = (depName: string, depType: string, updateType: 'major' | 'minor', newValue: string): PackageDependency => ({
      depName,
      packageName: depName,
      depType,
      datasource: 'npm',
      currentValue: '1.0.0',
      currentVersion: '1.0.0',
      updates: [{ updateType, newValue, newVersion: newValue }]
    })

    ;({ branches } = await branchifyUpgrades(config, {
      [Managers.NODE]: [
        {
          packageFile: 'package.json',
          lockFiles: ['pnpm-lock.yaml'],
          deps: [
            dep('globby', 'devDependencies', 'minor', '1.1.0'),
            dep('typescript', 'devDependencies', 'minor', '1.1.0'),
            dep('typedoc', 'devDependencies', 'minor', '1.1.0'),
            dep('some-library', 'dependencies', 'minor', '1.1.0'),
            dep('pnpm', 'packageManager', 'minor', '1.1.0'),
            dep('yarn', 'packageManager', 'major', '2.0.0')
          ]
        }
      ]
    }))
  }, 60_000)

  const branch = (name: string): BranchConfig => {
    const found = branches.find((candidate) => (name === 'lockFileMaintenance' ? candidate.isLockFileMaintenance : candidate.upgrades.some((upgrade) => upgrade.depName === name)))

    expect(found, `no branch resolved for ${name}`).toBeDefined()

    return found!
  }

  it.each(['globby', 'pnpm', 'lockFileMaintenance'])('keeps the marker in the commit body of %s', (name) => {
    expect(branch(name).commitBody).toBe('[skip ci]')
  })

  it.each(['typescript', 'typedoc', 'some-library', 'yarn'])('leaves no commit body on %s', (name) => {
    expect(branch(name).commitBody ?? '').toBe('')
  })

  it.each(['globby', 'pnpm', 'lockFileMaintenance', 'typescript', 'typedoc', 'some-library', 'yarn'])('keeps the title and subject of %s clean', (name) => {
    const { commitMessage, prTitle } = branch(name)

    expect(commitMessage).not.toMatch(SKIP_CI)
    expect(prTitle).not.toMatch(SKIP_CI)
  })
})
