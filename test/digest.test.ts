import { getConfig } from 'renovate/dist/config/defaults.js'
import { resolveConfigPresets } from 'renovate/dist/config/presets/index.js'
import type { RenovateConfig } from 'renovate/dist/config/types.js'
import { mergeChildConfig } from 'renovate/dist/config/utils.js'
import type { PackageFile } from 'renovate/dist/modules/manager/types.js'
import { branchifyUpgrades } from 'renovate/dist/workers/repository/updates/branchify.js'
import { describe, expect, it, vi } from 'vitest'

import { SCOPE } from '@constants'
import { Managers } from '@managers'
import { PRESETS, Preset } from '@presets'

// Serves every `local>` preset from the assembled registry, as in `test/resolution.test.ts`. These cases live in
// their own file because vitest runs each file in one fork, and resolving the full graph three more times there
// exceeds the CI job's heap.
vi.mock('renovate/dist/config/presets/local/index.js', () => ({
  getPreset: async ({ presetName }: { presetName: string }): Promise<RenovateConfig> => structuredClone(await PRESETS[presetName.replace(/^default\//, '') as Preset])
}))

// Renovate disables automerge on a branch whose title matches a merged merge request (`prAlreadyExisted` in
// `update/branch/check-existing.js`). A digest update keeps its tag, so a title built from `newValue` alone is
// the same for every digest of `:latest` and automerges only the first one.
describe('digest titles', () => {
  const NEW_DIGEST = 'sha256:ba574c5f00000000000000000000000000000000000000000000000000000000'
  const digest = (manager: Managers, packageFile: string, depName: string, datasource: string, currentValue: string): Record<string, PackageFile[]> => ({
    [manager]: [
      {
        packageFile,
        deps: [
          {
            depName,
            packageName: depName,
            datasource,
            currentValue,
            currentDigest: 'sha256:21cd52f700000000000000000000000000000000000000000000000000000000',
            updates: [{ updateType: 'digest', newValue: currentValue, newDigest: NEW_DIGEST }]
          }
        ]
      }
    ]
  })

  it.each([
    [
      'group-by-unit',
      { extends: [`${SCOPE}${Preset.DEFAULT}`, `${SCOPE}${Preset.GROUP_BY_UNIT}(orb)`] },
      digest(Managers.DOCKERFILE, 'orb/Dockerfile', 'registry.example.com/orb', 'docker', 'latest')
    ],
    [
      'group',
      { extends: [`${SCOPE}${Preset.DEFAULT}`], packageRules: [{ matchPackageNames: ['registry.example.com/orb'], extends: [`${SCOPE}${Preset.GROUP}(orb)`] }] },
      digest(Managers.DOCKERFILE, 'Dockerfile', 'registry.example.com/orb', 'docker', 'latest')
    ],
    ['multi-directory group', { extends: [`${SCOPE}${Preset.DEFAULT}`] }, digest(Managers.ARGOCD, 'apps/app.yaml', 'https://gitlab.example.com/chart.git', 'git-tags', 'main')]
  ] as [string, RenovateConfig, Record<string, PackageFile[]>][])(
    'names the new digest in the %s title',
    async (_, consumer, files) => {
      const { config } = await resolveConfigPresets(consumer)
      const { branches } = await branchifyUpgrades({ ...mergeChildConfig(getConfig(), config), errors: [], warnings: [], repoIsOnboarded: true }, files)
      const titles = branches.filter((branch) => !branch.isLockFileMaintenance).map((branch) => branch.prTitle)

      expect(titles).toHaveLength(1)
      expect(titles[0]).toMatch(/ to (latest|main)@ba574c5\b/)
    },
    60_000
  )
})
