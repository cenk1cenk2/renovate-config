import { Labels } from '@constants'
import { createNoBreakingMajorRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Restates the central default, which already leaves a node package major unmarked. Here so a repository can
// declare the intent rather than inherit it, and so the declaration survives a change of the central default.
export default createPreset({
  packageRules: [
    createNoBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchManagers: [Managers.NODE]
    })
  ]
})
