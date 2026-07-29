import { NODE_DISABLED_PACKAGES, NODE_DISABLED_ENGINES } from './rings.js'
import { createPreset } from '@lib'
import { Managers } from '@managers'
import { NODE_GROUP_ENGINES } from '@presets/groups/node/groups.js'

// No ring label here on purpose: every rule is disabled, so these packages never reach a merge request.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: NODE_DISABLED_PACKAGES,
      enabled: false,
      matchManagers: [Managers.NODE]
    },

    {
      ...NODE_GROUP_ENGINES,
      matchPackageNames: NODE_DISABLED_ENGINES,
      enabled: false
    }
  ]
})
