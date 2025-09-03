import { NODE_GROUP_ENGINES } from 'presets/dependency-groups/node/groups.js'

import { NODE_DISABLED_PACKAGES, NODE_DISABLED_ENGINES } from './rings.js'
import { Managers } from '@constants'
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
