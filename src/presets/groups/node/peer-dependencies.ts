import { NODE_GROUP_PEER, NODE_RANGE_PEER } from './groups.js'
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
      schedule: [SCHEDULE.ANY]
    },
    // The disable rides on the unbounded rule so it also covers major updates and the pre-lookup stage,
    // where `updateType` is undefined and an update-type-bounded rule would not match.
    {
      ...NODE_RANGE_PEER,
      enabled: false
    }
  ]
})
