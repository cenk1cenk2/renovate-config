import base from '@presets/base'
import _default from '@presets/default'
import devDependencies from '@presets/dev-dependencies'
import groupTogether from '@presets/group-together'
import minorDependencies from '@presets/minor-dependencies'
import slowring from '@root/presets/slow-ring'
import { RenovateConfig } from 'renovate/dist/config/common'

export default {
  base,
  default: _default,
  devDependencies,
  minorDependencies,
  slowring,
  groupTogether
} as Record<string, RenovateConfig>
