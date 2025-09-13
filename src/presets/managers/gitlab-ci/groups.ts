import type { PackageRule } from 'renovate/dist/config/types.js'

export const GITLAB_CI_MINOR_UPDATES: PackageRule = {
  matchPackagePatterns: ['*'],
  groupName: 'all minor dependency updates for pipelines',
  groupSlug: 'gitlab-ci-minor',
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest']
}
