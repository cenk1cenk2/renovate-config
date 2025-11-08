import { Managers } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.PYTHON_PEP621],
  packageRules: [
    {
      matchManagers: [Managers.PYTHON_PEP621],
      addLabels: ['python']
    }
  ]
})
