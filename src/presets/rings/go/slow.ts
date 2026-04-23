import { GO_SLOW_RING_PACKAGES } from './rings.js'
import { SCHEDULE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'
import { Rings } from '@rings'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: GO_SLOW_RING_PACKAGES,
      groupName: 'go slow ring',
      groupSlug: Rings.SLOW_RING_WEEKLY,
      schedule: [SCHEDULE.WEEKLY],
      matchManagers: [Managers.GO]
    }
  ]
})
