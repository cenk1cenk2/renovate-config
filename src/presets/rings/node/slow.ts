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

    // Bounded to the non-breaking update types so a major keeps its own branch. Unbounded, the ring
    // would batch every slow package's major into one weekly merge request and hold each of them for up
    // to a week, which is the opposite of the review a breaking change needs.
    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_SLOW_RING_PACKAGES,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      groupName: 'node slow ring',
      groupSlug: Rings.NODE_SLOW,
      schedule: [SCHEDULE.WEEKLY]
    }
  ]
})
