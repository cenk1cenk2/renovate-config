import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: [Labels.RENOVATE, Labels.MAJOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'argocd all major dependency updates',
      groupSlug: Groups.ARGOCD_MAJOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchManagers: [Managers.ARGOCD]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: [Labels.RENOVATE, Labels.MAJOR, Labels.INFRASTRUCTURE, Labels.AUTOMERGE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'argocd all major automerge dependency updates',
      groupSlug: Groups.ARGOCD_MAJOR_AUTOMERGE,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(perf)'],
      matchManagers: [Managers.ARGOCD],
      matchPackageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    }
  ]
})
