import { Managers } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.DOCKERFILE],
  packageRules: [
    {
      matchManagers: [Managers.DOCKERFILE],
      addLabels: ['dockerfile']
    }
  ]
})
