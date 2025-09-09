import { SCOPE } from '@constants'
import type { Preset } from '@presets'

export function createScopes(...names: Preset[]): string[] {
  return names.map((name) => SCOPE + name.toString())
}
