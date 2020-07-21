import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '^@typescript-eslint/', 'jest' ],
      schedule: [ SCHEDULE.WEEKLY ]
    },
    {
      packageNames: [ '@types/node', 'eslint', 'husky', 'prettier', 'lint-staged', 'cz-conventional-changelog' ],
      schedule: [ SCHEDULE.WEEKLY ]
    },
    {
      packageNames: [ 'node' ],
      enabled: false
    }
  ]
})
