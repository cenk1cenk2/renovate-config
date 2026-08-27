import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per image, argument passed by the consuming repository. The kubernetes manager reads plain
// manifests, so a dependency here is an image reference rather than a chart.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'kubernetes all minor automerge dependency updates',
      groupSlug: Groups.KUBERNETES_MINOR_AUTOMERGE,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.KUBERNETES]
    }
  ]
})
