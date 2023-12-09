import { createPreset } from '@lib'

import { NODE_GROUP_PEER, SCHEDULE } from '@constants'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: [ '*' ],
      groupName: 'all peer dependency updates',
      groupSlug: 'all-peer',
      ...NODE_GROUP_PEER,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
