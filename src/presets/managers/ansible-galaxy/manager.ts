import { Labels } from '@constants'
import { Managers } from '@managers'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.ANSIBLE_GALAXY],
  extends: createScopes(Preset.GROUP_ANSIBLE_GALAXY_MINOR_ROLES),
  packageRules: [
    {
      matchManagers: [Managers.ANSIBLE_GALAXY],
      addLabels: [Labels.ANSIBLE]
    }
  ]
})
