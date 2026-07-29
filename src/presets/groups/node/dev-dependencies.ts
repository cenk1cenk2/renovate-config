import {
  NODE_GROUP_DEV,
  NODE_GROUP_BUILD,
  NODE_GROUP_DOCS,
  NODE_GROUP_PACKAGE_MANAGER,
  NODE_AUTOMERGE_PACKAGE_MANAGER,
  NODE_RANGE_PACKAGE_MANAGER,
  NODE_BUILD_PACKAGES,
  NODE_DOCS_PACKAGES,
  NODE_DEV_PACKAGES
} from './groups.js'
import { SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    {
      ...NODE_GROUP_DEV,
      matchPackageNames: NODE_DEV_PACKAGES,
      groupName: 'node all development dependency updates',
      groupSlug: Groups.NODE_DEV,
      schedule: [SCHEDULE.ANY]
    },

    {
      ...NODE_GROUP_BUILD,
      matchPackageNames: NODE_BUILD_PACKAGES,
      groupName: 'node all build dependency updates',
      groupSlug: Groups.NODE_BUILD,
      schedule: [SCHEDULE.ANY]
    },

    {
      ...NODE_GROUP_DOCS,
      matchPackageNames: NODE_DOCS_PACKAGES,
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
    NODE_AUTOMERGE_PACKAGE_MANAGER,
    NODE_RANGE_PACKAGE_MANAGER,
    {
      matchManagers: [Managers.NODE],
      matchDepTypes: ['devDependencies'],
      rangeStrategy: 'bump'
    }
  ]
})
