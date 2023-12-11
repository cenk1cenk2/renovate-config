import { createPreset } from '@lib'

import { Managers, NODE_SLOW_RING_PACKAGES, RingSlug, SCHEDULE } from '@constants'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: NODE_SLOW_RING_PACKAGES,
      groupName: 'all slow ring @weekly',
      groupSlug: RingSlug.SLOW_RING_WEEKLY,
      schedule: [ SCHEDULE.WEEKLY ],
      matchManagers: [ Managers.NODE ]
    }
  ]
})
