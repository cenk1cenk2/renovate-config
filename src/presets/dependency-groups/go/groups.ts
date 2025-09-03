import type { PackageRule } from 'renovate/dist/config/types.js'

import { Managers } from '@constants'

export const GO_GROUP_MINOR: PackageRule = {
  matchUpdateTypes: ['minor', 'patch', 'digest'],
  labels: ['renovate', 'minor', 'automerge'],
  automerge: true,
  matchManagers: [Managers.GO]
}
