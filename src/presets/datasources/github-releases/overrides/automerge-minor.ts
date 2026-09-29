import { Labels, SCHEDULE } from '@constants'
import { Datasources } from '@datasources'
import { Groups } from '@groups'
import { createPreset } from '@lib'

// Opt-in per package, argument passed by the consuming repository. Scoped by datasource: a
// `# renovate: datasource=github-releases` directive surfaces through `custom.regex` with no dep type unless
// its custom manager sets a `depTypeTemplate`.
export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE, Labels.AUTOMERGE],
      groupName: 'github-releases datasource minor automerge dependency updates',
      groupSlug: Groups.GITHUB_RELEASES_MINOR_AUTOMERGE,
      automerge: true,
      matchDatasources: [Datasources.GITHUB_RELEASES],
      matchPackageNames: ['{{arg0}}'],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
