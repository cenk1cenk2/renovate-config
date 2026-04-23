import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  enabledManagers: [Managers.PYTHON_PEP621],
  packageRules: [
    {
      matchManagers: [Managers.PYTHON_PEP621],
      addLabels: [Labels.PYTHON]
    }
  ]
})
