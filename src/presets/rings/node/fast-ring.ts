import { createPreset } from '@lib'

import { NODE_FAST_RING_PACKAGES, NODE_GROUP_DEV, NODE_GROUP_MINOR, NODE_GROUP_PEER, RingSlug, SCHEDULE } from '@constants'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: 'all fast ring minor dependencies',
      groupSlug: RingSlug.FAST_RING,
      ...NODE_GROUP_MINOR,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: 'all fast ring dev dependencies',
      groupSlug: RingSlug.FAST_RING_DEV,
      ...NODE_GROUP_DEV,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: 'all fast ring peer dependencies',
      groupSlug: RingSlug.FAST_RING_PEER,
      ...NODE_GROUP_PEER,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
