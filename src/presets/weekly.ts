import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

/**
 * Some packages are updated very often, but we don't always need the latest features
 * and thus we only want to update once a month.
 */

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
