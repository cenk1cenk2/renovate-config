import type { PackageRule } from 'renovate/dist/config/types.js'

import { Labels } from '@constants'
import { Managers } from '@managers'
export const GO_GROUP_MINOR: PackageRule = {
  matchUpdateTypes: ['minor', 'patch', 'digest'],
  labels: [Labels.RENOVATE, Labels.MINOR, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.GO]
}
