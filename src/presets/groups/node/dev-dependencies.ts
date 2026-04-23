import { NODE_GROUP_DEV, NODE_GROUP_BUILD, NODE_GROUP_DOCS, NODE_GROUP_PACKAGE_MANAGER } from './groups.js'
import { SCHEDULE } from '@constants'
import { Managers } from '@managers'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'node all development dependency updates',
      groupSlug: Groups.NODE_DEV,
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
      groupSlug: Groups.NODE_BUILD,
      ...NODE_GROUP_BUILD,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchPackageNames: ['typedoc', 'typedoc-plugin-markdown', '/^vitepress/', '/^markdown-it/'],
      groupName: 'node all docs dependency updates',
      groupSlug: Groups.NODE_DOCS,
      ...NODE_GROUP_DOCS,
      schedule: [SCHEDULE.ANY]
    },

    {
      groupName: 'node all package manager',
      groupSlug: Groups.NODE_PACKAGE_MANAGER,
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
