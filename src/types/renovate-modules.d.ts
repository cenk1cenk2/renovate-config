declare module 'renovate/dist/config/migration.js' {
  import type { MigratedConfig, RenovateConfig } from 'renovate/dist/config/types.js'

  export function migrateConfig(config: RenovateConfig, parentKey?: string): MigratedConfig
}

declare module 'renovate/dist/config/validation.js' {
  import type { RenovateConfig, RenovateConfigStage, ValidationResult } from 'renovate/dist/config/types.js'

  export function validateConfig(configType: RenovateConfigStage, config: RenovateConfig, isPreset?: boolean, parentPath?: string): Promise<ValidationResult>
}
