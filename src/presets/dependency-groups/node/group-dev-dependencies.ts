import { createPreset } from '@lib'

import { NODE_GROUP_BUILD, NODE_GROUP_DEV, NODE_GROUP_DOCS, SCHEDULE } from '@constants'

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
      matchPackageNames: [ 'typedoc', 'typedoc-plugin-markdown' ],
      matchPackagePatterns: [ '^vitepress', '^markdown-it' ],
      groupName: 'all docs dependency updates',
      groupSlug: 'all-docs',
      ...NODE_GROUP_DOCS,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
