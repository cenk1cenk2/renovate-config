import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per role or collection whose major version is safe to take unattended. No `[skip ci]` suffix
// where the minor twin has one: a major update is the case where the pipeline result is worth waiting on.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'ansible-galaxy all major dependency updates',
      groupSlug: Groups.ANSIBLE_GALAXY_MAJOR,
      matchDepTypes: ['collections', 'roles'],
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.ANSIBLE_GALAXY],
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
