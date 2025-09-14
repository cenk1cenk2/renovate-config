import type { PackageRule } from 'renovate/dist/config/types.js'

export const GITLAB_CI_MINOR_UPDATES: PackageRule = {
  matchPackagePatterns: ['*'],
  groupName: 'gitlab-ci all minor dependency updates',
  groupSlug: 'gitlab-ci-minor',
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest']
}
