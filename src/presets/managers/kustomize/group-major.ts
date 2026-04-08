import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure'],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'kustomize all major dependency updates for {{ packageFileDir }}',
      groupSlug: 'kustomize-major',
      commitMessageExtra: '[{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure', 'automerge'],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'kustomize all major automerge dependency updates for {{ packageFileDir }}',
      groupSlug: 'kustomize-major-automerge',
      commitMessageExtra: '[{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/grafana/helm-charts'],
      matchPackageNames: ['prometheus-blackbox-exporter', 'alloy']
    }
  ]
})
