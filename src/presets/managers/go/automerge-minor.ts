import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per module, argument passed by the consuming repository. No `groupSlug` and no `schedule` here
// on purpose: go modules are already grouped by ring, and both fields are last-match-wins, so naming a
// group would pull the module out of its ring merge request. This rule flips `automerge` and nothing else.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      matchUpdateTypes: ['minor', 'patch', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.GO]
    }
  ]
})
