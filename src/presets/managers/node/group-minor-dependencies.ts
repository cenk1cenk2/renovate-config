import { NODE_GROUP_MINOR } from './groups.js'
import { SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: ['*'],
      groupName: '[node] all minor dependency updates',
      groupSlug: 'node-minor',
      ...NODE_GROUP_MINOR,
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
