import { Labels } from '@constants'
import { createNonBreakingMajorRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Restates the central default, which already leaves a opentelemetry collector component major unmarked. Here so a
// repository can declare the intent rather than inherit it, and so the declaration survives a change of the
// central default.
export default createPreset({
  packageRules: [
    createNonBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchManagers: [Managers.OPENTELEMETRY_COLLECTOR_BUILDER]
    })
  ]
})
