import { NODE_GROUP_PEER } from './groups.js'
import { SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'node all peer dependency updates',
      groupSlug: Groups.NODE_PEER,
      enabled: false,
      ...NODE_GROUP_PEER,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
