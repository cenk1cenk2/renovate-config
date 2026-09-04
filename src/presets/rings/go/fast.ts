import { GO_FAST_RING_PACKAGES } from './rings.js'
import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'
import { Rings } from '@rings'

export default createPreset({
  packageRules: [
    {
      matchManagers: [Managers.GO],
      matchPackageNames: GO_FAST_RING_PACKAGES,
      addLabels: [Labels.RING_FAST]
    },

    {
      matchManagers: [Managers.GO],
      matchPackageNames: GO_FAST_RING_PACKAGES,
      matchUpdateTypes: ['minor', 'patch', 'digest'],
      groupName: 'go fast ring minor dependencies',
      groupSlug: Rings.GO_FAST,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
