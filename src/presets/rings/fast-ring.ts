import { createPreset } from '@lib/preset-factory'

import { GO_GROUP_MINOR, NODE_GROUP_DEV, NODE_GROUP_MINOR, NODE_GROUP_PEER } from '@constants/patterns'
import { SCHEDULE } from '@constants/renovate'
import { GO_FAST_RING_PACKAGES, NODE_FAST_RING_PACKAGES } from '@constants/rings'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: 'all fast ring minor dependencies',
      groupSlug: 'fast-ring',
      ...NODE_GROUP_MINOR,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackagePatterns: GO_FAST_RING_PACKAGES,
      groupName: 'all fast ring minor dependencies',
      groupSlug: 'fast-ring',
      ...GO_GROUP_MINOR,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: 'all fast ring dev dependencies',
      groupSlug: 'fast-ring-dev',
      ...NODE_GROUP_DEV,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackagePatterns: NODE_FAST_RING_PACKAGES,
      groupName: 'all fast ring peer dependencies',
      groupSlug: 'fast-ring-peer',
      ...NODE_GROUP_PEER,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
