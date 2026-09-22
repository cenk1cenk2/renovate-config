import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export const DEP_TYPE_HK_PKL_SCHEMA = 'hk-pkl-schema'

// A pkl package URI cannot float, so every `hk.pkl` pins hk's schema twice on every line that reaches for
// it — once in the release path (`/v2.0.1/`) and once in the package fragment (`hk@2.0.1`). Both are
// captured, because renovate rewrites a custom-manager dependency through the exact string it matched:
// a manager that saw only one of the two would leave the file referring to two different releases.
// `extractVersionTemplate` drops the tag's `v` so the extracted versions compare against the bare value
// both occurrences carry — the `v` in the path is literal text the replacement leaves alone.
export default createPreset({
  enabledManagers: [Managers.REGEX],
  customManagers: [
    {
      depTypeTemplate: DEP_TYPE_HK_PKL_SCHEMA,
      customType: 'regex',
      managerFilePatterns: ['/(^|\\/)hk\\.pkl$/'],
      matchStringsStrategy: 'any',
      matchStrings: [/package:\/\/github\.com\/jdx\/hk\/releases\/download\/v(?<currentValue>[^/"]+)\//.source, /\/hk@(?<currentValue>[^#"]+)#\//.source],
      depNameTemplate: 'hk',
      packageNameTemplate: 'jdx/hk',
      extractVersionTemplate: '^v(?<version>.*)$',
      datasourceTemplate: 'github-releases',
      versioningTemplate: 'semver'
    }
  ],
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'hk all minor dependency updates',
      groupSlug: Groups.HK_MINOR,
      addLabels: [Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_HK_PKL_SCHEMA],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      schedule: [SCHEDULE.DAILY]
    },
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_HK_PKL_SCHEMA],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_HK]
    }
  ]
})
