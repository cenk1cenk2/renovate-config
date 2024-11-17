import { GO_GROUP_MINOR, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: ['*'],
      groupName: 'all minor dependency updates',
      groupSlug: 'all',
      ...GO_GROUP_MINOR,
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
