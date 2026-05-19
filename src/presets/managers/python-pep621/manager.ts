import { Labels, MINIMUM_RELEASE_AGE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  enabledManagers: [Managers.PYTHON_PEP621],
  packageRules: [
    {
      matchManagers: [Managers.PYTHON_PEP621],
      addLabels: [Labels.PYTHON]
    },
    {
      matchManagers: [Managers.PYTHON_PEP621],
      minimumReleaseAge: MINIMUM_RELEASE_AGE
    }
  ]
})
