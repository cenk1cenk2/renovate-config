import { Labels, SCHEDULE } from '@constants'
import { Datasources } from '@datasources'
import { Groups } from '@groups'
import { createPreset } from '@lib'

// Opt-in per image, argument passed by the consuming repository. matchDatasources keeps the rule off a
// same-named dependency of another datasource — no area label, because 36 managers emit docker deps.
export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      groupName: 'docker datasource minor dependency updates',
      groupSlug: Groups.DOCKER_MINOR,
      automerge: true,
      matchDatasources: [Datasources.DOCKER],
      matchPackageNames: ['{{arg0}}'],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
