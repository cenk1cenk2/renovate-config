import { GROUP_DEV } from '@constants/patterns'
import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '*' ],
      groupName: 'all development dependency updates',
      groupSlug: 'all-dev',
      ...GROUP_DEV,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
