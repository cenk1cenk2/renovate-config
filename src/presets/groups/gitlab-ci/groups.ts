import type { PackageRule } from 'renovate/dist/config/types.js'
import { Groups } from '@groups'

export const GITLAB_CI_MINOR_UPDATES: PackageRule = {
  matchPackageNames: ['*'],
  groupName: 'gitlab-ci all minor dependency updates',
  groupSlug: Groups.GITLAB_CI_MINOR,
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest']
}
