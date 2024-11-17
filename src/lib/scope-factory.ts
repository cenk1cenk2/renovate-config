import { SCOPE } from '@constants'
import type { Preset } from '@presets'

export function createScope(name: Preset): string {
  return (SCOPE + name.toString()) as string
}

export function createScopes(...names: Preset[]): string[] {
  return names.map(createScope)
}
