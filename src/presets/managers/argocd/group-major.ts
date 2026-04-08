import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure'],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'argocd all major dependency updates for {{ packageFileDir }}',
      groupSlug: 'argocd-major',
      commitMessageExtra: '[{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchManagers: [Managers.ARGOCD],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure', 'automerge'],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'argocd all major automerge dependency updates for {{ packageFileDir }}',
      groupSlug: 'argocd-major-automerge',
      commitMessageExtra: '[{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(perf)'],
      matchManagers: [Managers.ARGOCD],
      schedule: [SCHEDULE.ANY],
      matchPackageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    }
  ]
})
