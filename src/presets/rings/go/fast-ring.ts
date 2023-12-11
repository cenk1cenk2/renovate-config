import { createPreset } from '@lib'

import { GO_FAST_RING_PACKAGES, GO_GROUP_MINOR, RingSlug, SCHEDULE } from '@constants'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: GO_FAST_RING_PACKAGES,
      groupName: 'all fast ring minor dependencies',
      groupSlug: RingSlug.FAST_RING,
      ...GO_GROUP_MINOR,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
