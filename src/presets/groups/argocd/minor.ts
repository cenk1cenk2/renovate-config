import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// argocd resolves git refs, so pinned digests are in scope here where the other multi-directory
// managers only ever see semver ranges.
const MATCH_UPDATE_TYPES = ['minor', 'patch', 'pin', 'digest', 'pinDigest'] as const

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      matchUpdateTypes: [...MATCH_UPDATE_TYPES],
      commitType: 'feat',
      groupSlug: Groups.ARGOCD_MINOR,
      matchManagers: [Managers.ARGOCD]
    }),
    createMultiDirectoryGroupRule({
      name: 'argocd',
      matchUpdateTypes: [...MATCH_UPDATE_TYPES],
      commitType: 'feat',
      groupSlug: Groups.ARGOCD_MINOR_AUTOMERGE,
      matchManagers: [Managers.ARGOCD],
      automerge: true,
      matchPackageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    })
  ]
})
