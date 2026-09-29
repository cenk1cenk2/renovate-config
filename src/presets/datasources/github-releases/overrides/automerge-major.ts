import { Labels, SCHEDULE } from '@constants'
import { Datasources } from '@datasources'
import { Groups } from '@groups'
import { createPreset } from '@lib'

// Opt-in per package whose major version is safe to take unattended. replacement updates stay banned
// outright by policy.
export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE, Labels.AUTOMERGE],
      groupName: 'github-releases datasource major automerge dependency updates',
      groupSlug: Groups.GITHUB_RELEASES_MAJOR_AUTOMERGE,
      automerge: true,
      matchDatasources: [Datasources.GITHUB_RELEASES],
      matchPackageNames: ['{{arg0}}'],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
