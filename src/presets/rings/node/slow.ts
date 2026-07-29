import { NODE_SLOW_RING_PACKAGES } from './rings.js'
import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'
import { Rings } from '@rings'

export default createPreset({
  packageRules: [
    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_SLOW_RING_PACKAGES,
      addLabels: [Labels.RING_SLOW]
    },
    {
      matchPackageNames: NODE_SLOW_RING_PACKAGES,
      groupName: 'node slow ring',
      groupSlug: Rings.NODE_SLOW,
      schedule: [SCHEDULE.WEEKLY],
      matchManagers: [Managers.NODE]
    }
  ]
})
