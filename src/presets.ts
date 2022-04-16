import base from '@presets/base'
import branchBeta from '@presets/branches/branch-beta'
import branchDevelop from '@presets/branches/branch-develop'
import _default from '@presets/default'
import groupDevDependencies from '@presets/dependency-groups/group-dev-dependencies'
import groupMinorDependencies from '@presets/dependency-groups/group-minor-dependencies'
import groupPeerDependencies from '@presets/dependency-groups/group-peer-dependencies'
import lockFile from '@presets/dependency-groups/lock-file'
import noTests from '@presets/no-tests'
import fastring from '@presets/rings/fast-ring'
import slowring from '@presets/rings/slow-ring'
import { RenovateConfig } from 'renovate/dist/config/types'

export default {
  base,
  default: _default,
  lockFile,
  noTests,
  slowring,
  fastring,
  groupDevDependencies,
  groupMinorDependencies,
  groupPeerDependencies,
  branchDevelop,
  branchBeta
} as Record<string, RenovateConfig>
