import { Labels } from '@constants'
import { createNoAutomergeRule, createPreset } from '@lib'
import { Managers } from '@managers'

// The major twin. Only the node package managers automerge a major centrally, so elsewhere this states an intent
// the central config already holds - kept for symmetry with the minor twin, and so the declaration survives a
// change of the central default.
export default createPreset({
  packageRules: [
    createNoAutomergeRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchPackageNames: ['{{arg0}}'],
      matchUpdateTypes: ['major'],
      matchManagers: [Managers.RUST_CARGO]
    })
  ]
})
