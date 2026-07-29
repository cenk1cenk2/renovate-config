import type { RenovateConfig } from 'renovate/dist/config/types.js'

// `schedule` is non-mergeable, so at the top level of a preset it applies globally to the assembled
// config and the last extended preset that sets one wins for every dependency. Scope a schedule to a
// packageRule instead. `labels` is also non-mergeable but the base preset legitimately owns the umbrella
// label, so it stays allowed here; `test/presets.test.ts` enforces that only `base` sets it — every other
// preset adds labels with `addLabels`, which accumulates.
export type PresetConfig = Omit<RenovateConfig, 'schedule'>

export function createPreset(config: PresetConfig): RenovateConfig {
  return config
}
