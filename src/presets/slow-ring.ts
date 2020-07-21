import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '^@typescript-eslint/', 'jest', '^@types/node$', '^eslint$', '^husky$', '^prettier$', '^lint-staged$', '^cz-conventional-changelog$' ],
      groupName: 'all slow ring @weekly',
      groupSlug: 'slow-ring-weekly',
      schedule: [ SCHEDULE.WEEKLY ]
    },
    {
      packageNames: [ 'node' ],
      enabled: false
    }
  ]
})
