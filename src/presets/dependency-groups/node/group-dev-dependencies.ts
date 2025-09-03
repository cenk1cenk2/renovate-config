import { NODE_GROUP_DEV, NODE_GROUP_BUILD, NODE_GROUP_DOCS, NODE_GROUP_PACKAGE_MANAGER } from './groups.js'
import { SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: ['*'],
      groupName: 'all development dependency updates',
      groupSlug: 'all-dev',
      ...NODE_GROUP_DEV,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackageNames: ['typescript', 'tsup', 'tsdown', 'prettier', 'eslint', '@cenk1cenk2/eslint-config', '@swc/core', '@types/jest', 'jest', 'ts-jest'],
      matchPackagePatterns: ['^eslint-plugin-', '^jest'],
      groupName: 'all build dependency updates',
      groupSlug: 'all-build',
      ...NODE_GROUP_BUILD,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackageNames: ['typedoc', 'typedoc-plugin-markdown'],
      matchPackagePatterns: ['^vitepress', '^markdown-it'],
      groupName: 'all docs dependency updates',
      groupSlug: 'all-docs',
      ...NODE_GROUP_DOCS,
      schedule: [SCHEDULE.ANY]
    },

    {
      groupName: 'all package manager',
      groupSlug: 'all-package-manager',
      ...NODE_GROUP_PACKAGE_MANAGER,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
