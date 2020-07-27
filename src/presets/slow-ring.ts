import { SCHEDULE } from '@constants/renovate'
import { SLOW_RING_PACKAGES, DISABLED_PACKAGES } from '@constants/rings'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: SLOW_RING_PACKAGES,
      groupName: 'all slow ring @weekly',
      groupSlug: 'slow-ring-weekly',
      schedule: [ SCHEDULE.WEEKLY ]
    },
    {
      packageNames: DISABLED_PACKAGES,
      enabled: false
    }
  ]
})
