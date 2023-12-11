import { createPreset } from '@lib'

import { GO_GROUP_MINOR, SCHEDULE } from '@constants'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: [ '*' ],
      groupName: 'all minor dependency updates',
      groupSlug: 'all',
      ...GO_GROUP_MINOR,
      schedule: [ SCHEDULE.DAILY ]
    }
  ]
})
