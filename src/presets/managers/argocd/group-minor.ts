import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest', 'pinDigest'],
      labels: ['renovate', 'minor', 'infrastructure'],
      groupName: 'argocd all minor dependency updates for {{ packageFileDir }}',
      groupSlug: 'argocd-minor-{{ packageFileDir }}',
      commitMessageExtra: '[{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.ARGOCD],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest', 'pinDigest'],
      labels: ['renovate', 'minor', 'infrastructure', 'automerge'],
      groupName: 'argocd all minor dependency updates',
      groupSlug: 'argocd-minor',
      automerge: true,
      extends: [':semanticCommitTypeAll(fix)'],
      matchManagers: [Managers.ARGOCD],
      schedule: [SCHEDULE.ANY],
      matchPackageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    }
  ]
})
