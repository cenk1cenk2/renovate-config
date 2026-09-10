import { Labels } from '@constants'
import { createNoBreakingMajorRule, createPreset } from '@lib'
import { Managers } from '@managers'

// The opt-out that matters for this manager: a central rule marks every terraform module, provider and release
// major breaking, and a repository that bundles many of them rather than wrapping one wants its version left
// alone.
export default createPreset({
  packageRules: [
    createNoBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchManagers: [Managers.TERRAFORM],
      matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module']
    })
  ]
})
