import base from '@presets/base'
import branchBeta from '@presets/branches/branch-beta'
import branchDevelop from '@presets/branches/branch-develop'
import _default from '@presets/default'
import fastring from '@presets/fast-ring'
import groupDevDependencies from '@presets/group-dev-dependencies'
import groupMinorDependencies from '@presets/group-minor-dependencies'
import groupPeerDependencies from '@presets/group-peer-dependencies'
import lockFile from '@presets/lock-file'
import noTests from '@presets/no-tests'
import slowring from '@presets/slow-ring'
import { RenovateConfig } from 'renovate/dist/config/common'

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
