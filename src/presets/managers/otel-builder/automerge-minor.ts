import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per package, argument passed by the consuming repository. Single-directory pattern: no branch
// prefix and no commit message extra, because ocb resolves one dependency per repository.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'otel-builder all minor dependency updates',
      groupSlug: Groups.OTEL_BUILDER_MINOR,
      matchUpdateTypes: ['minor', 'patch', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.OPENTELEMETRY_COLLECTOR_BUILDER],
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
