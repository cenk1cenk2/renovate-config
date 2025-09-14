import { NODE_SLOW_RING_PACKAGES } from './rings.js'
import { RingSlug, SCHEDULE, Managers } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: NODE_SLOW_RING_PACKAGES,
      groupName: 'node slow ring',
      groupSlug: RingSlug.SLOW_RING_WEEKLY,
      schedule: [SCHEDULE.WEEKLY],
      matchManagers: [Managers.NODE]
    }
  ]
})
