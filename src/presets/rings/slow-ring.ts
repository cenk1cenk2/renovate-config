import { createPreset } from '@lib/preset-factory'

import { Managers } from '@constants/managers'
import { SCHEDULE } from '@constants/renovate'
import { NODE_SLOW_RING_PACKAGES, NODE_DISABLED_PACKAGES } from '@constants/rings'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: NODE_SLOW_RING_PACKAGES,
      groupName: 'all slow ring @weekly',
      groupSlug: 'slow-ring-weekly',
      schedule: [ SCHEDULE.WEEKLY ],
      matchManagers: [ Managers.NODE ]
    },
    {
      matchPackageNames: NODE_DISABLED_PACKAGES,
      enabled: false,
      matchManagers: [ Managers.NODE ]
    }
  ]
})
