import { GO_GROUP_MINOR } from './groups.js'
import { SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: ['*'],
      groupName: 'go all minor dependency updates',
      groupSlug: 'go-minor',
      ...GO_GROUP_MINOR,
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
