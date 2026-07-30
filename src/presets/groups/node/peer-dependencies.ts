import { NODE_GROUP_PEER, NODE_RANGE_PEER, PACKAGE_MANAGERS } from './groups.js'
import { SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      ...NODE_GROUP_PEER,
      // The package manager group claims these at any dep type, so exclude them here rather than let
      // both contribute a `dep:` value. A negation-only list already means "everything except".
      matchPackageNames: PACKAGE_MANAGERS.map((name) => `!${name}`),
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
