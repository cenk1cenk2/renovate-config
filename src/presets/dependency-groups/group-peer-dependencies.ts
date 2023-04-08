import { createPreset } from '@lib/preset-factory'

import { NODE_GROUP_PEER } from '@constants/patterns'
import { SCHEDULE } from '@constants/renovate'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: [ '*' ],
      groupName: 'all peer dependency updates',
      groupSlug: 'all-peer',
      ...NODE_GROUP_PEER,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
