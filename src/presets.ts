import base from '@presets/base'
import branchBeta from '@presets/branches/branch-beta'
import branchDevelop from '@presets/branches/branch-develop'
import _default from '@presets/default'
import groupDevDependencies from '@presets/group-dev-dependencies'
import groupMinorDependencies from '@presets/group-minor-dependencies'
import lockFile from '@presets/lock-file'
import slowring from '@presets/slow-ring'
import { RenovateConfig } from 'renovate/dist/config/common'

export default {
  base,
  default: _default,
  lockFile,
  slowring,
  groupDevDependencies,
  groupMinorDependencies,
  branchDevelop,
  branchBeta
} as Record<string, RenovateConfig>
