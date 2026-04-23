import { GO_FAST_RING_PACKAGES } from './rings.js'
import { SCHEDULE } from '@constants'
import { Rings } from '@rings'
import { createPreset } from '@lib'
import { GO_GROUP_MINOR } from '@presets/groups/go/groups.js'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: GO_FAST_RING_PACKAGES,
      groupName: 'go fast ring minor dependencies',
      groupSlug: Rings.FAST_RING,
      ...GO_GROUP_MINOR,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
