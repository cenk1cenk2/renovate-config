import { createPreset } from '@lib/preset-factory'

import { SCHEDULE } from '@constants/renovate'
import { SLOW_RING_PACKAGES, DISABLED_PACKAGES } from '@constants/rings'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: SLOW_RING_PACKAGES,
      groupName: 'all slow ring @weekly',
      groupSlug: 'slow-ring-weekly',
      schedule: [ SCHEDULE.WEEKLY ]
    },
    {
      matchPackageNames: DISABLED_PACKAGES,
      enabled: false
    }
  ]
})
