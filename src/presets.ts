import base from '@presets/base'
import branchBeta from '@presets/branch-beta'
import branchDevelop from '@presets/branch-develop'
import _default from '@presets/default'
import devDependencies from '@presets/dev-dependencies'
import groupTogether from '@presets/group-together'
import minorDependencies from '@presets/minor-dependencies'
import slowring from '@presets/slow-ring'
import { RenovateConfig } from 'renovate/dist/config/common'

export default {
  base,
  default: _default,
  devDependencies,
  minorDependencies,
  slowring,
  groupTogether,
  branchDevelop,
  branchBeta
} as Record<string, RenovateConfig>
