import { Managers } from '@constants'
import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.ANSIBLE_GALAXY],
  extends: createScopes(Preset.ANSIBLE_GALAXY_GROUP_MINOR_ROLES),
  packageRules: [
    {
      matchManagers: [Managers.ANSIBLE_GALAXY],
      addLabels: ['ansible']
    }
  ]
})
