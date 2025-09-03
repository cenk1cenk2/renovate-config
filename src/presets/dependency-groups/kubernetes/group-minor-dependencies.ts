import { KUBERNETES_GROUP_MINOR } from './groups.js'
import { SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: ['*'],
      groupName: 'all minor dependency updates',
      groupSlug: 'all',
      ...KUBERNETES_GROUP_MINOR,
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
