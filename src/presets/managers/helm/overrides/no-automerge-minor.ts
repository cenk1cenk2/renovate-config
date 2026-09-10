import { Labels } from '@constants'
import { createNoAutomergeRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per package that must not be merged unattended, even where the central group automerges its manager.
// `groupName: null` moves it to its own branch first: renovate reads a branch's automerge as
// `upgrades.every(...)`, so leaving the package on the shared branch would take automerge away from every other
// helm chart on it.
export default createPreset({
  packageRules: [
    createNoAutomergeRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchPackageNames: ['{{arg0}}'],
      matchUpdateTypes: ['minor', 'patch'],
      matchManagers: [Managers.HELM]
    })
  ]
})
