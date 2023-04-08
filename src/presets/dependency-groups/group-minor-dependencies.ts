import { createPreset } from '@lib/preset-factory'

import { GO_GROUP_MINOR, NODE_GROUP_MINOR } from '@constants/patterns'
import { SCHEDULE } from '@constants/renovate'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: [ '*' ],
      groupName: 'all minor dependency updates',
      groupSlug: 'all',
      ...NODE_GROUP_MINOR,
      schedule: [ SCHEDULE.DAILY ]
    },
    {
      matchPackagePatterns: [ '*' ],
      groupName: 'all minor dependency updates',
      groupSlug: 'all',
      ...GO_GROUP_MINOR,
      schedule: [ SCHEDULE.DAILY ]
    }
  ]
})
