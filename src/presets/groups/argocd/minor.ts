import { Labels } from '@constants'
import { Groups } from '@groups'
import { Managers } from '@managers'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest', 'pinDigest'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'argocd all minor dependency updates',
      groupSlug: Groups.ARGOCD_MINOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.ARGOCD]
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest', 'pinDigest'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE, Labels.AUTOMERGE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'argocd all minor automerge dependency updates',
      groupSlug: Groups.ARGOCD_MINOR_AUTOMERGE,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.ARGOCD],
      matchPackageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    }
  ]
})
