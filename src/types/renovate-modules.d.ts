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

  export function resolveConfigPresets(inputConfig: RenovateConfig): Promise<{ config: RenovateConfig }>
}

declare module 'renovate/dist/modules/manager/custom/regex/index.js' {
  import type { CustomExtractConfig, PackageDependency, PackageFileContent } from 'renovate/dist/modules/manager/types.js'

  // Every dependency a custom manager extracts carries the exact string it was matched through, which is
  // what the auto-replacer rewrites.
  type ExtractedDependency = PackageDependency & { replaceString: string }

  export function extractPackageFile(content: string, packageFile: string, config: CustomExtractConfig): (PackageFileContent & { deps: ExtractedDependency[] }) | null
}

declare module 'renovate/dist/workers/repository/update/branch/auto-replace.js' {
  export function doAutoReplace(upgrade: Record<string, unknown>, existingContent: string, reuseExistingBranch: boolean, firstUpdate?: boolean): Promise<string>
}
