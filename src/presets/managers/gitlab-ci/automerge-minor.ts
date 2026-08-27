import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per component or image, argument passed by the consuming repository. Matches both gitlab-ci
// managers where the central group only covers includes, so an opted-in image in a job is covered too.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'gitlab-ci all minor automerge dependency updates',
      groupSlug: Groups.GITLAB_CI_MINOR_AUTOMERGE,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
