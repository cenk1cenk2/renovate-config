import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure'],
      groupName: 'kustomize all minor dependency updates for {{ packageFileDir }}',
      groupSlug: 'kustomize-minor-{{ packageFileDir }}',
      commitMessageExtra: '[{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure', 'automerge'],
      groupName: 'kustomize all minor automerge dependency updates for {{ packageFileDir }}',
      groupSlug: 'kustomize-minor-automerge-{{ packageFileDir }}',
      commitMessageExtra: '[{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(feat)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/grafana/helm-charts'],
      matchPackageNames: ['prometheus-blackbox-exporter', 'alloy']
    }
  ]
})
