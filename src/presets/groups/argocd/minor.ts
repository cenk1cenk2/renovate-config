import { Groups } from '@groups'
import type { MultiDirectoryGroupRule } from '@lib'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// argocd resolves git refs, so pinned digests are in scope here where the other multi-directory
// managers only ever see semver ranges.
const UPDATE_TYPES: MultiDirectoryGroupRule['updateTypes'] = ['minor', 'patch', 'pin', 'digest', 'pinDigest']

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      updateType: 'minor',
      updateTypes: UPDATE_TYPES,
      slug: Groups.ARGOCD_MINOR,
      managers: [Managers.ARGOCD]
    }),
    createMultiDirectoryGroupRule({
      name: 'argocd',
      updateType: 'minor',
      updateTypes: UPDATE_TYPES,
      slug: Groups.ARGOCD_MINOR_AUTOMERGE,
      managers: [Managers.ARGOCD],
      automerge: true,
      packageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    })
  ]
})
