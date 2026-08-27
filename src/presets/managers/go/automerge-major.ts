import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per module whose major version is safe to take unattended. Carries no `groupSlug` or `schedule`
// for the same reason as the minor twin — grouping stays with the ring rules.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      matchUpdateTypes: ['major'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.GO]
    }
  ]
})
