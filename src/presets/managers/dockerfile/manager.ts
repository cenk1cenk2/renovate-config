import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  enabledManagers: [Managers.DOCKERFILE],
  packageRules: [
    {
      matchManagers: [Managers.DOCKERFILE],
      // No area: a Dockerfile can build an application or an infrastructure image, and the manager
      // cannot tell which. Labels only ever accumulate, so asserting nothing is the recoverable choice.
      addLabels: [Labels.RENOVATE, Labels.MANAGER_DOCKERFILE]
    }
  ]
})
