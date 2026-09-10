import { Labels } from '@constants'
import { createBreakingMajorRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Restates what a central rule already says: a terraform module, provider and release major breaks the repository
// that consumes it. Here so a repository can declare the intent rather than inherit it, and so the declaration
// survives a change of the central default.
export default createPreset({
  packageRules: [
    createBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module']
    })
  ]
})
