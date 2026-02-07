import { NODE_GROUP_MINOR } from './groups.js'
import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'node all minor dependency updates',
      groupSlug: 'node-minor',
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
