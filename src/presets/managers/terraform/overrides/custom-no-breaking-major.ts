import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '../custom-manager.js'
import { Labels } from '@constants'
import { createNoBreakingMajorRule, createPreset } from '@lib'
import { Managers } from '@managers'

// The opt-out that matters for this manager: a central rule marks every in-house terraform module major breaking,
// and a repository that bundles many of them rather than wrapping one wants its version left alone.
export default createPreset({
  packageRules: [
    createNoBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO]
    })
  ]
})
