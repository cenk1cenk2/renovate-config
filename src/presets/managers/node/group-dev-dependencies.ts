import { NODE_GROUP_DEV, NODE_GROUP_BUILD, NODE_GROUP_DOCS, NODE_GROUP_PACKAGE_MANAGER } from './groups.js'
import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'node all development dependency updates',
      groupSlug: 'node-dev',
      ...NODE_GROUP_DEV,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackageNames: [
        'typescript',
        'tsup',
        'tsdown',
        'prettier',
        'eslint',
        '@cenk1cenk2/eslint-config',
        '@swc/core',
        '@types/jest',
        'jest',
        'ts-jest',
        '/^eslint-plugin-/',
        '/^jest/'
      ],
      groupName: 'node all build dependency updates',
      groupSlug: 'node-build',
      ...NODE_GROUP_BUILD,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackageNames: ['typedoc', 'typedoc-plugin-markdown', '/^vitepress/', '/^markdown-it/'],
      groupName: 'node all docs dependency updates',
      groupSlug: 'node-docs',
      ...NODE_GROUP_DOCS,
      schedule: [SCHEDULE.ANY]
    },

    {
      groupName: 'node all package manager',
      groupSlug: 'node-package-manager',
      ...NODE_GROUP_PACKAGE_MANAGER,
      schedule: [SCHEDULE.ANY]
    },
    {
      matchManagers: [Managers.NODE],
      matchDepTypes: ['devDependencies'],
      rangeStrategy: 'bump'
    }
  ]
})
