import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure'],
      additionalBranchPrefix: 'kustomize-',
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
      additionalBranchPrefix: 'kustomize-',
      automerge: true,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts'],
      matchPackageNames: ['prometheus-blackbox-exporter']
    }
  ]
})
