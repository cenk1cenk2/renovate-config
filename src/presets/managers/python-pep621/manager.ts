import { Labels, MINIMUM_RELEASE_AGE } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.PYTHON_PEP621],
  extends: createScopes(Preset.GROUP_PYTHON_MINOR_DEPENDENCIES),
  packageRules: [
    {
      matchManagers: [Managers.PYTHON_PEP621],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_PYTHON]
    },
    {
      matchManagers: [Managers.PYTHON_PEP621],
      minimumReleaseAge: MINIMUM_RELEASE_AGE
    }
  ]
})
