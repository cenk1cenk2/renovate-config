import { NODE_FAST_RING_PACKAGES } from './rings.js'
import { SCHEDULE } from '@constants'
import { Rings } from '@rings'
import { createPreset } from '@lib'
import { NODE_GROUP_MINOR, NODE_GROUP_DEV, NODE_GROUP_PEER } from '@presets/groups/node/groups.js'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring minor dependencies',
      groupSlug: Rings.FAST_RING,
      ...NODE_GROUP_MINOR,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring dev dependencies',
      groupSlug: Rings.FAST_RING_DEV,
      ...NODE_GROUP_DEV,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring peer dependencies',
      groupSlug: Rings.FAST_RING_PEER,
      ...NODE_GROUP_PEER,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
