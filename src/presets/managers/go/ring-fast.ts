import { GO_GROUP_MINOR } from './groups.js'
import { GO_FAST_RING_PACKAGES } from './rings.js'
import { RingSlug, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: GO_FAST_RING_PACKAGES,
      groupName: '[go] fast ring minor dependencies',
      groupSlug: RingSlug.FAST_RING,
      ...GO_GROUP_MINOR,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
