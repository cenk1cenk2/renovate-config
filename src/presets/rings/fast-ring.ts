import { createPreset } from '@lib/preset-factory'

import { GROUP_MINOR, GROUP_DEV, GROUP_PEER } from '@constants/patterns'
import { SCHEDULE } from '@constants/renovate'
import { FAST_RING_PACKAGES } from '@constants/rings'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: FAST_RING_PACKAGES,
      groupName: 'all fast ring minor dependencies',
      groupSlug: 'fast-ring',
      ...GROUP_MINOR,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackagePatterns: FAST_RING_PACKAGES,
      groupName: 'all fast ring dev dependencies',
      groupSlug: 'fast-ring-dev',
      ...GROUP_DEV,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackagePatterns: FAST_RING_PACKAGES,
      groupName: 'all fast ring peer dependencies',
      groupSlug: 'fast-ring-peer',
      ...GROUP_PEER,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
