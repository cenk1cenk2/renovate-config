import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per package, argument passed by the consuming repository. No `groupSlug` and no `schedule` here
// on purpose: node dependencies are already grouped by dep type and by ring, and both fields are
// last-match-wins, so naming a group would pull the package out of its dev, build, docs, peer or ring
// merge request. This rule flips `automerge` and nothing else.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.NODE]
    }
  ]
})
