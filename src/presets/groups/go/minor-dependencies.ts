import { GO_GROUP_MINOR } from './groups.js'
import { SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'go all minor dependency updates',
      groupSlug: Groups.GO_MINOR,
      ...GO_GROUP_MINOR,
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
