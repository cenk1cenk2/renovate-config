import { NODE_GROUP_PEER, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: ['*'],
      groupName: 'all peer dependency updates',
      groupSlug: 'all-peer',
      enabled: false,
      ...NODE_GROUP_PEER,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
