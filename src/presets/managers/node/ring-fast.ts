import { NODE_GROUP_MINOR, NODE_GROUP_DEV, NODE_GROUP_PEER } from './groups.js'
import { NODE_FAST_RING_PACKAGES } from './rings.js'
import { RingSlug, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: '[node] fast ring minor dependencies',
      groupSlug: RingSlug.FAST_RING,
      ...NODE_GROUP_MINOR,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: '[node] fast ring dev dependencies',
      groupSlug: RingSlug.FAST_RING_DEV,
      ...NODE_GROUP_DEV,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: '[node] fast ring peer dependencies',
      groupSlug: RingSlug.FAST_RING_PEER,
      ...NODE_GROUP_PEER,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
