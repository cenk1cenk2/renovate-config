import { readFile } from 'node:fs/promises'

import { getConfig } from 'renovate/dist/config/defaults.js'
import { resolveConfigPresets } from 'renovate/dist/config/presets/index.js'
import type { PackageRule, RenovateConfig } from 'renovate/dist/config/types.js'
import { mergeChildConfig } from 'renovate/dist/config/utils.js'
import type { PackageDependency, PackageFile } from 'renovate/dist/modules/manager/types.js'
import { validateConfig } from 'renovate/dist/config/validation.js'
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

describe('generic group directive', () => {
  const group = (name: string): string[] => [`${SCOPE}group(${name})`]
  const packageRules: PackageRule[] = [
    { matchManagers: [Managers.HELM], matchPackageNames: ['vpa'], extends: group('vpa') },
    { matchManagers: [Managers.KUSTOMIZE], matchDepTypes: ['HelmChart'], matchPackageNames: ['vpa'], extends: group('vpa') },
    { matchDatasources: ['docker'], matchPackageNames: ['registry.k8s.io/autoscaling/*', '!registry.k8s.io/autoscaling/excluded'], extends: group('vpa') },
    { matchDatasources: ['github-releases'], matchPackageNames: ['kubernetes/autoscaler'], extends: group('vpa') },
    { matchManagers: [Managers.HELM], matchPackageNames: ['metrics-server'], extends: group('metrics') }
  ]
  const dep = (depName: string, datasource: string, depType?: string): PackageDependency => ({
    depName,
    packageName: depName,
    datasource,
    depType,
    currentValue: '1.0.0',
    currentVersion: '1.0.0',
    updates: [
      { updateType: 'minor', newValue: datasource === 'docker' ? '1.2.0' : '1.1.0', newVersion: datasource === 'docker' ? '1.2.0' : '1.1.0', newMajor: 1 },
      { updateType: 'major', newValue: datasource === 'docker' ? '2.2.0' : '2.0.0', newVersion: datasource === 'docker' ? '2.2.0' : '2.0.0', newMajor: 2 }
    ]
  })
  const packageFiles: Record<string, PackageFile[]> = {
    [Managers.HELM]: [
      { packageFile: 'charts/first/Chart.yaml', deps: [dep('vpa', 'helm'), dep('metrics-server', 'helm'), dep('other-chart', 'helm')] },
      { packageFile: 'charts/second/Chart.yaml', deps: [dep('vpa', 'helm')] }
    ],
    [Managers.KUSTOMIZE]: [{ packageFile: 'apps/vpa/kustomization.yaml', deps: [dep('vpa', 'helm', 'HelmChart')] }],
    [Managers.KUBERNETES]: [
      {
        packageFile: 'apps/vpa/deployment.yaml',
        deps: [dep('registry.k8s.io/autoscaling/vpa-recommender', 'docker'), dep('vpa', 'docker'), dep('registry.k8s.io/autoscaling/excluded', 'docker')]
      }
    ],
    [Managers.REGEX]: [{ packageFile: 'versions.txt', deps: [dep('kubernetes/autoscaler', 'github-releases'), dep('vpa', 'github-releases')] }],
    [Managers.NODE]: [{ packageFile: 'package.json', deps: [dep('typescript', 'npm', 'devDependencies'), dep('disabled-library', 'npm', 'peerDependencies')] }]
  }
  let resolved: RenovateConfig
  let branches: BranchConfig[]
  let baseline: BranchConfig[]

  beforeAll(async () => {
    resolved = (
      await resolveConfigPresets({ extends: [`${SCOPE}${Preset.DEFAULT}`, `${SCOPE}${Preset.GROUP_BY_UNIT}(charts)`, `${SCOPE}${Preset.GROUP_BY_UNIT}(apps)`], packageRules })
    ).config
    const central = (await resolveConfigPresets({ extends: [`${SCOPE}${Preset.DEFAULT}`, `${SCOPE}${Preset.GROUP_BY_UNIT}(charts)`, `${SCOPE}${Preset.GROUP_BY_UNIT}(apps)`] }))
      .config
    const branchify = async (config: RenovateConfig): Promise<BranchConfig[]> =>
      (await branchifyUpgrades({ ...mergeChildConfig(getConfig(), config), errors: [], warnings: [], repoIsOnboarded: true }, structuredClone(packageFiles))).branches.filter(
        (branch) => !branch.isLockFileMaintenance
      )

    branches = await branchify(resolved)
    baseline = await branchify(central)
  }, 60_000)

  it('validates the preset inside scoped native packageRules', async () => {
    expect((await validateConfig('repository', resolved)).errors).toEqual([])
    const { config } = await resolveConfigPresets({ packageRules })

    expect((await validateConfig('repository', config)).errors).toEqual([])
    expect(config.packageRules).toHaveLength(packageRules.length)
    for (const rule of config.packageRules ?? []) {
      expect(rule).not.toHaveProperty('packageRules')
      expect(rule.groupName).toBeDefined()
      expect(rule.groupSlug).toBe(rule.groupName)
    }
  }, 60_000)

  it('combines separately matched managers, datasources and directories into one branch per update level', () => {
    const grouped = branches.filter((branch) => branch.groupName === 'vpa')

    expect(grouped.map((branch) => branch.branchName).sort()).toEqual(['renovate/major-vpa', 'renovate/vpa'])
    for (const branch of grouped) {
      expect(branch.upgrades).toHaveLength(5)
      expect(new Set(branch.upgrades.map((upgrade) => upgrade.manager))).toEqual(new Set([Managers.HELM, Managers.KUSTOMIZE, Managers.KUBERNETES, Managers.REGEX]))
      expect(new Set(branch.upgrades.map((upgrade) => upgrade.datasource))).toEqual(new Set(['helm', 'docker', 'github-releases']))
      expect(new Set(branch.upgrades.map((upgrade) => upgrade.updateType)).size).toBe(1)
      expect(branch.prTitle).toContain('vpa')
      expect(branch.prTitle).not.toMatch(/\[(charts|apps)\//)
    }
  })

  it('keeps different group names and native matcher exclusions separate', () => {
    expect(
      branches
        .filter((branch) => branch.upgrades.some((upgrade) => upgrade.depName === 'metrics-server'))
        .map((branch) => branch.branchName)
        .sort()
    ).toEqual(['renovate/major-metrics', 'renovate/metrics'])
    const outside = branches.flatMap((branch) =>
      branch.upgrades.filter(
        (upgrade) =>
          upgrade.depName === 'other-chart' ||
          upgrade.depName === 'registry.k8s.io/autoscaling/excluded' ||
          (upgrade.depName === 'vpa' && upgrade.manager !== Managers.HELM && upgrade.manager !== Managers.KUSTOMIZE)
      )
    )

    expect(outside).toHaveLength(8)
    expect(outside.every((upgrade) => upgrade.groupName !== 'vpa' && upgrade.groupName !== 'metrics')).toBe(true)
  })

  it('leaves unmatched updates and policy fields unchanged', () => {
    const policies = (items: BranchConfig[]): unknown[] =>
      items
        .flatMap((branch) =>
          branch.upgrades.map((upgrade) => ({
            key: `${upgrade.manager}:${upgrade.packageFile}:${upgrade.depName}:${upgrade.updateType}`,
            automerge: upgrade.automerge,
            enabled: upgrade.enabled,
            schedule: upgrade.schedule,
            semanticCommitType: upgrade.semanticCommitType,
            rangeStrategy: upgrade.rangeStrategy,
            minimumReleaseAge: upgrade.minimumReleaseAge,
            separateMajorMinor: upgrade.separateMajorMinor
          }))
        )
        .sort((a, b) => a.key.localeCompare(b.key))

    expect(policies(branches)).toEqual(policies(baseline))
    expect(branches.flatMap((branch) => branch.upgrades).some((upgrade) => upgrade.depName === 'disabled-library')).toBe(false)
    const untouched = (items: BranchConfig[]): unknown[] =>
      items
        .flatMap((branch) =>
          branch.upgrades
            .filter((upgrade) => ['other-chart', 'registry.k8s.io/autoscaling/excluded', 'typescript'].includes(upgrade.depName!))
            .map((upgrade) => ({
              key: `${upgrade.manager}:${upgrade.packageFile}:${upgrade.depName}:${upgrade.updateType}`,
              branchName: branch.branchName,
              groupSlug: upgrade.groupSlug,
              additionalBranchPrefix: upgrade.additionalBranchPrefix,
              commitMessageExtra: upgrade.commitMessageExtra,
              group: upgrade.group
            }))
        )
        .sort((a, b) => a.key.localeCompare(b.key))

    expect(untouched(branches)).toEqual(untouched(baseline))
  })

  it('groups only the three component images in the vpa consumer config', async () => {
    const consumer: RenovateConfig = JSON.parse(await readFile(new URL('./fixtures/group-vpa.json', import.meta.url), 'utf8'))
    const { config } = await resolveConfigPresets(consumer)
    const images = ['registry.k8s.io/autoscaling/vpa-admission-controller', 'registry.k8s.io/autoscaling/vpa-recommender', 'registry.k8s.io/autoscaling/vpa-updater']
    const files: Record<string, PackageFile[]> = {
      [Managers.HELM_VALUES]: [
        {
          packageFile: 'values.yaml',
          deps: [...images, 'registry.k8s.io/kube-state-metrics/kube-state-metrics'].map((depName) => ({
            depName,
            packageName: depName,
            datasource: 'docker',
            currentValue: '1.8.0',
            currentVersion: '1.8.0',
            updates: [{ updateType: 'patch', newValue: '1.8.1', newVersion: '1.8.1', newMajor: 1 }]
          }))
        }
      ],
      [Managers.HELM]: [{ packageFile: 'Chart.yaml', deps: [dep('vpa', 'helm')] }]
    }
    const { branches: actual } = await branchifyUpgrades({ ...mergeChildConfig(getConfig(), config), errors: [], warnings: [], repoIsOnboarded: true }, files)

    expect((await validateConfig('repository', config)).errors).toEqual([])
    const grouped = actual.filter((branch) => branch.groupName === 'vpa')

    expect(grouped).toHaveLength(1)
    expect(grouped[0].branchName).toBe('renovate/vpa')
    expect(grouped[0].upgrades.map((upgrade) => upgrade.depName).sort()).toEqual(images.sort())
    expect(grouped[0].automerge).not.toBe(true)
    expect(grouped[0].semanticCommitType).toBe('fix')
    expect(
      actual
        .flatMap((branch) => branch.upgrades)
        .filter((upgrade) => !images.includes(upgrade.depName!))
        .every((upgrade) => upgrade.groupSlug !== 'vpa')
    ).toBe(true)
  }, 60_000)

  it('does not introduce grouping when the consumer supplies no grouping rules', () => {
    expect(baseline.some((branch) => branch.groupName === 'vpa' || branch.groupName === 'metrics')).toBe(false)
  })
})

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

describe('no-tests override', () => {
  it.each([false, true])(
    'resolves branch test gates with no-tests=%s',
    async (noTests) => {
      const { config: central } = await resolveConfigPresets({
        extends: [`${SCOPE}${Preset.DEFAULT}`, ...(noTests ? [`${SCOPE}${Preset.NO_TESTS}`] : [])]
      })
      const config: RenovateConfig = { ...mergeChildConfig(getConfig(), central), errors: [], warnings: [], repoIsOnboarded: true }
      const { branches } = await branchifyUpgrades(config, {
        [Managers.NODE]: [
          {
            packageFile: 'package.json',
            deps: [
              ...['typescript', 'typedoc', '@cenk1cenk2/eslint-config'].map((depName) => ({
                depName,
                packageName: depName,
                depType: 'devDependencies',
                datasource: 'npm',
                currentValue: '1.0.0',
                currentVersion: '1.0.0',
                updates: [{ updateType: 'minor' as const, newValue: '1.1.0', newVersion: '1.1.0' }]
              })),
              {
                depName: 'pnpm',
                packageName: 'pnpm',
                depType: 'packageManager',
                datasource: 'npm',
                currentValue: '1.0.0',
                currentVersion: '1.0.0',
                updates: [{ updateType: 'major', newValue: '2.0.0', newVersion: '2.0.0' }]
              }
            ]
          }
        ]
      })

      expect(branches.length).toBeGreaterThan(0)
      for (const branch of branches) {
        expect(branch.ignoreTests, branch.branchName).toBe(noTests || branch.isLockFileMaintenance === true)
      }
    },
    60_000
  )
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
