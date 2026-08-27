import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from './custom-manager.js'
import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per monorepo project, argument passed by the consuming repository. custom.regex is shared with
// the terraform custom manager, so the dep type is what keeps this off terraform's dependencies.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'gitlab-ci all minor automerge dependency updates',
      groupSlug: Groups.GITLAB_CI_MINOR_AUTOMERGE,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
