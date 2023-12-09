import { createPreset } from '@lib'

import { Managers, SCHEDULE, NODE_SLOW_RING_PACKAGES, NODE_DISABLED_PACKAGES, GO_SLOW_RING_PACKAGES } from '@constants'

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
    },

    {
      matchPackagePatterns: GO_SLOW_RING_PACKAGES,
      groupName: 'all slow ring @weekly',
      groupSlug: 'slow-ring-weekly',
      schedule: [ SCHEDULE.WEEKLY ],
      matchManagers: [ Managers.GO ]
    }
  ]
})
