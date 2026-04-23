import { Labels } from '@constants'
import { Managers } from '@managers'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.PYTHON_PEP621],
  packageRules: [
    {
      matchManagers: [Managers.PYTHON_PEP621],
      addLabels: [Labels.PYTHON]
    }
  ]
})
