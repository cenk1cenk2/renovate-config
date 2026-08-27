import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per component or image whose major version is safe to take unattended. replacement updates stay
// banned outright by policy.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'gitlab-ci all major dependency updates',
      groupSlug: Groups.GITLAB_CI_MAJOR,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
