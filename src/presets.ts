import base from '@presets/base'
import _default from '@presets/default'
import devDependencies from '@presets/dev-dependencies'
import groupTogether from '@presets/group-together'
import minorDependencies from '@presets/minor-dependencies'
import monthly from '@presets/weekly'
import { RenovateConfig } from 'renovate/dist/config/common'

export default {
  base,
  default: _default,
  devDependencies,
  minorDependencies,
  monthly,
  groupTogether
} as Record<string, RenovateConfig>
