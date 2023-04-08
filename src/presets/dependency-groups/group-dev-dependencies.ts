import { createPreset } from '@lib/preset-factory'

import { NODE_GROUP_BUILD, NODE_GROUP_DEV } from '@constants/patterns'
import { SCHEDULE } from '@constants/renovate'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: [ '*' ],
      groupName: 'all development dependency updates',
      groupSlug: 'all-dev',
      ...NODE_GROUP_DEV,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackageNames: [ 'typescript', 'tsup', 'prettier', 'eslint', '@cenk1cenk2/eslint-config', '@swc/core', '@types/jest', 'jest', 'ts-jest', 'vue' ],
      matchPackagePatterns: [ '^eslint-plugin-', '^vuepress', '^@vuepress/', '^jest' ],
      groupName: 'all build dependency updates',
      groupSlug: 'all-build',
      ...NODE_GROUP_BUILD,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
