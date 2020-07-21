import base from '@presets/base'
import _default from '@presets/default'
import devDependencies from '@presets/dev-dependencies'
import minorDependencies from '@presets/minor-dependencies'
import monthly from '@root/presets/weekly'
import { RenovateConfig } from 'renovate/dist/config/common'

export default {
  base,
  default: _default,
  devDependencies,
  minorDependencies,
  monthly
} as Record<string, RenovateConfig>
