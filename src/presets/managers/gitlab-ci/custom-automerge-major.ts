import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from './custom-manager.js'
import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per monorepo project whose major version is safe to take unattended. The dep type keeps this off
// the terraform custom manager, which shares custom.regex.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'gitlab-ci all major dependency updates',
      groupSlug: Groups.GITLAB_CI_MAJOR,
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
