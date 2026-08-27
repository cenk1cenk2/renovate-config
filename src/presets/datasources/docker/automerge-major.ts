import { Labels, SCHEDULE } from '@constants'
import { Datasources } from '@datasources'
import { Groups } from '@groups'
import { createPreset } from '@lib'

// Opt-in per image whose major version tracks an upstream dependency bump rather than a breaking
// change. replacement updates stay banned outright by policy.
export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      groupName: 'docker datasource major dependency updates',
      groupSlug: Groups.DOCKER_MAJOR,
      automerge: true,
      matchDatasources: [Datasources.DOCKER],
      matchPackageNames: ['{{arg0}}'],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
