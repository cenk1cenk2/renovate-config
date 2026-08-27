import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per package whose major version tracks an upstream dependency bump rather than a breaking
// change. replacement updates stay banned outright by policy.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'otel-builder all major dependency updates',
      groupSlug: Groups.OTEL_BUILDER_MAJOR,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.OPENTELEMETRY_COLLECTOR_BUILDER],
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
