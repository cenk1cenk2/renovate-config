import { NODE_GROUP_MINOR } from './groups.js'
import { SCHEDULE } from '@constants'
import { Managers } from '@managers'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'node all minor dependency updates',
      groupSlug: Groups.NODE_MINOR,
      ...NODE_GROUP_MINOR,
      schedule: [SCHEDULE.DAILY]
    },
    {
      matchManagers: [Managers.NODE],
      matchDepTypes: ['dependencies'],
      rangeStrategy: 'bump'
    }
  ]
})
