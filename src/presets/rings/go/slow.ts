import { GO_SLOW_RING_PACKAGES } from './rings.js'
import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'
import { Rings } from '@rings'

export default createPreset({
  packageRules: [
    {
      matchManagers: [Managers.GO],
      matchPackageNames: GO_SLOW_RING_PACKAGES,
      addLabels: [Labels.RING_SLOW]
    },
    {
      matchPackageNames: GO_SLOW_RING_PACKAGES,
      groupName: 'go slow ring',
      groupSlug: Rings.GO_SLOW,
      schedule: [SCHEDULE.WEEKLY],
      matchManagers: [Managers.GO]
    }
  ]
})
