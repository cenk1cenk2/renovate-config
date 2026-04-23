import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  enabledManagers: [Managers.KUBERNETES],
  [Managers.KUBERNETES]: {
    managerFilePatterns: [
      '/\\.deploy\\/.*\\/.*\\.ya?ml/',
      '/!(^\\.deploy\\/.*\\/kustomization\\.ya?ml$)/',
      '/!(^\\.deploy\\/.*\\/templates\\/)/',
      '/!(^\\.deploy\\/.*\\/files\\/)/',
      '/!(^\\.deploy\\/.*\\/values\\/)/',
      '/!(^\\.deploy\\/.*\\/values\\.ya?ml$)/',
      '/!(^\\.deploy\\/.*\\/chart\\.ya?ml$)/'
    ]
  },
  packageRules: [
    {
      matchManagers: [Managers.KUBERNETES],
      addLabels: [Labels.KUBERNETES]
    }
  ]
})
