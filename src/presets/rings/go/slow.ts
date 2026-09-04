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
      matchManagers: [Managers.GO],
      matchPackageNames: GO_SLOW_RING_PACKAGES,
      matchUpdateTypes: ['minor', 'patch', 'digest'],
      groupName: 'go slow ring',
      groupSlug: Rings.GO_SLOW,
      schedule: [SCHEDULE.WEEKLY]
    }
  ]
})
