import type { PackageRule } from 'renovate/dist/config/types.js'

import { Managers } from '@managers'

export const GO_GROUP_MINOR: PackageRule = {
  matchUpdateTypes: ['minor', 'patch', 'digest'],
  automerge: false,
  matchManagers: [Managers.GO]
}
