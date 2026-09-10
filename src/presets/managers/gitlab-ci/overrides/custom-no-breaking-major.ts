import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from '../custom-manager.js'
import { Labels } from '@constants'
import { createNoBreakingMajorRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Restates the central default, which already leaves a in-house gitlab-ci monorepo project major unmarked. Here so
// a repository can declare the intent rather than inherit it, and so the declaration survives a change of the
// central default.
export default createPreset({
  packageRules: [
    createNoBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO]
    })
  ]
})
