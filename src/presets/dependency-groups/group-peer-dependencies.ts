import { createPreset } from '@lib/preset-factory'

import { GROUP_PEER } from '@constants/patterns'
import { SCHEDULE } from '@constants/renovate'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '*' ],
      groupName: 'all peer dependency updates',
      groupSlug: 'all-peer',
      ...GROUP_PEER,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
