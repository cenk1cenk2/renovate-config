import { Managers, NODE_DISABLED_ENGINES, NODE_DISABLED_PACKAGES, NODE_GROUP_ENGINES } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: NODE_DISABLED_PACKAGES,
      enabled: false,
      matchManagers: [Managers.NODE]
    },

    {
      matchPackageNames: NODE_DISABLED_ENGINES,
      ...NODE_GROUP_ENGINES,
      enabled: false
    }
  ]
})
