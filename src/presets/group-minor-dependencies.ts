import { GROUP_MINOR } from '@constants/patterns'
import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '*' ],
      groupName: 'all minor dependency updates',
      groupSlug: 'all',
      ...GROUP_MINOR,
      schedule: [ SCHEDULE.DAILY ]
    }
  ]
})
