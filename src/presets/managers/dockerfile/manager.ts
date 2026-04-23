import { Labels } from '@constants'
import { Managers } from '@managers'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.DOCKERFILE],
  packageRules: [
    {
      matchManagers: [Managers.DOCKERFILE],
      addLabels: [Labels.DOCKERFILE]
    }
  ]
})
