import 'renovate/dist/config/types.js'

declare module 'renovate/dist/config/types.js' {
  interface PackageRule {
    additionalBranchPrefix?: string
    commitMessageSuffix?: string
  }
}
