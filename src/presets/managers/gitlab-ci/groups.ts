import type { PackageRule } from 'renovate/dist/config/types.js'

export const GITLAB_CI_MINOR_UPDATES: PackageRule = {
  matchPackagePatterns: ['*'],
  groupName: 'all minor dependency updates for pipelines',
  groupSlug: 'all',
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest']
}
