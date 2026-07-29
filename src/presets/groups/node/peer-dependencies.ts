import { NODE_GROUP_PEER } from './groups.js'
import { SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      ...NODE_GROUP_PEER,
      matchPackageNames: ['*'],
      groupName: 'node all peer dependency updates',
      groupSlug: Groups.NODE_PEER,
      enabled: false,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
