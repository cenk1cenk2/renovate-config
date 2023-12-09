import type { Preset } from '@presets'

import { SCOPE } from '@constants'

export function createScope (name: Preset): string {
  return (SCOPE + name.toString()) as string
}
