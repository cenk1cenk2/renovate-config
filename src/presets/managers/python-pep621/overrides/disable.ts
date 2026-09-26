import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per package a repository has frozen. Scoped by manager so a package of the same name elsewhere keeps
// updating. Unbounded by update type on purpose: renovate applies `enabled: false` at the pre-lookup stage, where
// the dependency is skipped before any registry lookup (`workers/repository/process/fetch.js`); `updateType` is still
// undefined there, so a rule bounded by `matchUpdateTypes` only filters those updates out after the lookup.
export default createPreset({
  packageRules: [
    {
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchPackageNames: ['{{arg0}}'],
      matchManagers: [Managers.PYTHON_PEP621],
      enabled: false
    }
  ]
})
