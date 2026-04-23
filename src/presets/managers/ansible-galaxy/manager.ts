import { Labels } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
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
