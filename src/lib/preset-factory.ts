import type { RenovateConfig } from 'renovate/dist/config/types.js'

// `schedule` and `labels` are non-mergeable, so at the top level of a preset they apply globally to the
// assembled config and the last extended preset that sets one wins for every dependency. Scope a
// schedule to a packageRule, and add labels with `addLabels`.
export type PresetConfig = Omit<RenovateConfig, 'schedule' | 'labels'>

export function createPreset(config: PresetConfig): RenovateConfig {
  return config
}

// Only the base preset may declare the umbrella label and it has no schedule — every other preset
// composes on top of it.
export function createBasePreset(config: RenovateConfig): RenovateConfig {
  return config
}
