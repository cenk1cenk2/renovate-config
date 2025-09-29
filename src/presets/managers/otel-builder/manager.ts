import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.OPENTELEMETRY_COLLECTOR_BUILDER],
  packageRules: [
    {
      matchPackagePatterns: ['*'],
      groupName: 'otel-builder all minor dependency updates',
      groupSlug: 'otel-builder-minor',
      matchUpdateTypes: ['minor', 'patch', 'digest'],
      labels: ['renovate', 'minor', 'automerge'],
      automerge: true,
      matchManagers: [Managers.OPENTELEMETRY_COLLECTOR_BUILDER],
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
