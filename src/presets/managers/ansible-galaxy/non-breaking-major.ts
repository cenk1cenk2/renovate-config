import { Labels } from '@constants'
import { createNonBreakingMajorRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Restates the central default, which already leaves a ansible collection and role major unmarked. Here so a
// repository can declare the intent rather than inherit it, and so the declaration survives a change of the
// central default.
export default createPreset({
  packageRules: [
    createNonBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchManagers: [Managers.ANSIBLE_GALAXY],
      matchDepTypes: ['collections', 'roles']
    })
  ]
})
