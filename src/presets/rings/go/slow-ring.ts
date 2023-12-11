import { createPreset } from '@lib'

import { GO_SLOW_RING_PACKAGES, Managers, RingSlug, SCHEDULE } from '@constants'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: GO_SLOW_RING_PACKAGES,
      groupName: 'all slow ring @weekly',
      groupSlug: RingSlug.SLOW_RING_WEEKLY,
      schedule: [ SCHEDULE.WEEKLY ],
      matchManagers: [ Managers.GO ]
    }
  ]
})
