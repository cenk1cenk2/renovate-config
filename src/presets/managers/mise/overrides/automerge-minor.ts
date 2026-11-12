import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per tool, argument passed by the consuming repository: the mise config key, such as `kubectl`
// or `github:cli/cli`.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'mise all minor automerge dependency updates',
      groupSlug: Groups.MISE_MINOR_AUTOMERGE,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.MISE]
    }
  ]
})
