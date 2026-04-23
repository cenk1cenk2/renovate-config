import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  enabledManagers: [Managers.OPENTELEMETRY_COLLECTOR_BUILDER],
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'otel-builder all minor dependency updates',
      groupSlug: Groups.OTEL_BUILDER_MINOR,
      matchUpdateTypes: ['minor', 'patch', 'digest'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.OPENTELEMETRY_COLLECTOR_BUILDER],
      schedule: [SCHEDULE.DAILY]
    },
    {
      matchManagers: [Managers.OPENTELEMETRY_COLLECTOR_BUILDER],
      addLabels: [Labels.OTEL_BUILDER]
    }
  ]
})
