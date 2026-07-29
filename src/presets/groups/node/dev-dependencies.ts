import { NODE_GROUP_DEV, NODE_GROUP_BUILD, NODE_GROUP_DOCS, NODE_GROUP_PACKAGE_MANAGER } from './groups.js'
import { SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    {
      ...NODE_GROUP_DEV,
      matchPackageNames: ['*'],
      groupName: 'node all development dependency updates',
      groupSlug: Groups.NODE_DEV,
      schedule: [SCHEDULE.ANY]
    },

    {
      ...NODE_GROUP_BUILD,
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
      schedule: [SCHEDULE.ANY]
    },

    {
      ...NODE_GROUP_DOCS,
      matchPackageNames: ['typedoc', 'typedoc-plugin-markdown', '/^vitepress/', '/^markdown-it/'],
      groupName: 'node all docs dependency updates',
      groupSlug: Groups.NODE_DOCS,
      schedule: [SCHEDULE.ANY]
    },

    {
      ...NODE_GROUP_PACKAGE_MANAGER,
      groupName: 'node all package manager',
      groupSlug: Groups.NODE_PACKAGE_MANAGER,
      schedule: [SCHEDULE.ANY]
    },
    {
      matchManagers: [Managers.NODE],
      matchDepTypes: ['devDependencies'],
      rangeStrategy: 'bump'
    }
  ]
})
