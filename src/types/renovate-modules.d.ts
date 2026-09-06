declare module 'renovate/dist/config/migration.js' {
  import type { MigratedConfig, RenovateConfig } from 'renovate/dist/config/types.js'

  export function migrateConfig(config: RenovateConfig, parentKey?: string): MigratedConfig
}

declare module 'renovate/dist/config/validation.js' {
  import type { RenovateConfig, RenovateConfigStage, ValidationResult } from 'renovate/dist/config/types.js'

  export function validateConfig(configType: RenovateConfigStage, config: RenovateConfig, isPreset?: boolean, parentPath?: string): Promise<ValidationResult>
}

declare module 'renovate/dist/config/presets/index.js' {
  import type { RenovateConfig } from 'renovate/dist/config/types.js'

  export function resolveConfigPresets(
    inputConfig: RenovateConfig,
    baseConfig?: RenovateConfig,
    ignorePresets?: string[],
    existingPresets?: string[],
    mergeInternalPresets?: boolean
  ): Promise<{ config: RenovateConfig, visitedPresets: { merged: string[], unmerged: string[] } }>
}
