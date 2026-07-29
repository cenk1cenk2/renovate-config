import { NODE_FAST_RING_PACKAGES } from './rings.js'
import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'
import { NODE_GROUP_MINOR, NODE_GROUP_DEV, NODE_GROUP_PEER } from '@presets/groups/node/groups.js'
import { Rings } from '@rings'

export default createPreset({
  packageRules: [
    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      addLabels: [Labels.RING_FAST]
    },
    {
      ...NODE_GROUP_MINOR,
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring minor dependencies',
      groupSlug: Rings.NODE_FAST,
      schedule: [SCHEDULE.ANY]
    },

    {
      ...NODE_GROUP_DEV,
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring dev dependencies',
      groupSlug: Rings.NODE_FAST_DEV,
      schedule: [SCHEDULE.ANY]
    },

    {
      ...NODE_GROUP_PEER,
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring peer dependencies',
      groupSlug: Rings.NODE_FAST_PEER,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
