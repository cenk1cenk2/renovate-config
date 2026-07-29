import type { RenovateConfig } from 'renovate/dist/config/types.js'

import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Per-manager config blocks are keyed by manager name and are valid at runtime, but renovate does not
// surface that shape on the public `RenovateConfig` type — hence the cast.
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
      addLabels: [Labels.MANAGER_KUBERNETES, Labels.AREA_INFRASTRUCTURE]
    }
  ]
} as RenovateConfig)
