import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  enabledManagers: [Managers.DOCKERFILE],
  packageRules: [
    {
      matchManagers: [Managers.DOCKERFILE],
      addLabels: [Labels.DOCKERFILE]
    }
  ]
})
