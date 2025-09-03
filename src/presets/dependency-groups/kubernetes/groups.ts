import type { PackageRule } from 'renovate/dist/config/types.js'

import { Managers } from '@constants'

export const KUBERNETES_GROUP_MINOR: PackageRule = {
  matchUpdateTypes: ['minor', 'patch', 'digest'],
  labels: ['renovate', 'minor'],
  automerge: false,
  matchManagers: [Managers.KUBERNETES]
}
