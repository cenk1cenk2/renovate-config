import { createPreset } from '@lib/preset-factory'

import { NODE_GROUP_BUILD, NODE_GROUP_DEV, NODE_GROUP_DOCS } from '@constants/patterns'
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
      matchPackageNames: [ 'typescript', 'tsup', 'prettier', 'eslint', '@cenk1cenk2/eslint-config', '@swc/core', '@types/jest', 'jest', 'ts-jest' ],
      matchPackagePatterns: [ '^eslint-plugin-', '^jest' ],
      groupName: 'all build dependency updates',
      groupSlug: 'all-build',
      ...NODE_GROUP_BUILD,
      schedule: [ SCHEDULE.ANY ]
    },

    {
      matchPackageNames: [ 'typedoc', 'typedoc-plugin-markdown', 'vue' ],
      matchPackagePatterns: [ '^vuepress', '^@vuepress/' ],
      groupName: 'all docs dependency updates',
      groupSlug: 'all-docs',
      ...NODE_GROUP_DOCS,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
