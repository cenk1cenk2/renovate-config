import { NODE_SLOW_RING_PACKAGES } from './rings.js'
import { SCHEDULE } from '@constants'
import { Managers } from '@managers'
import { Rings } from '@rings'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: NODE_SLOW_RING_PACKAGES,
      groupName: 'node slow ring',
      groupSlug: Rings.SLOW_RING_WEEKLY,
      schedule: [SCHEDULE.WEEKLY],
      matchManagers: [Managers.NODE]
    }
  ]
})
