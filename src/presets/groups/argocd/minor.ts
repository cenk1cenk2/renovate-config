import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// argocd resolves git refs, so pinned digests are in scope here where the other multi-directory
// managers only ever see semver ranges.
export const ARGOCD_MINOR_UPDATE_TYPES = ['minor', 'patch', 'pin', 'digest', 'pinDigest'] as const

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      matchUpdateTypes: [...ARGOCD_MINOR_UPDATE_TYPES],
      commitType: 'feat',
      groupSlug: Groups.ARGOCD_MINOR,
      matchManagers: [Managers.ARGOCD]
    })
  ]
})
