import type { RenovateConfig } from 'renovate/dist/config/types.js'

export function createPreset(config: RenovateConfig & Record<PropertyKey, any>): RenovateConfig {
  return config
}
