import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure'],
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchManagers: [Managers.HELM],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: ['renovate', 'major', 'infrastructure', 'automerge'],
      automerge: true,
      extends: [':semanticCommitTypeAll(perf)'],
      matchManagers: [Managers.HELM],
      schedule: [SCHEDULE.ANY],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/open-telemetry/opentelemetry-helm-charts'],
      matchPackageNames: ['kube-prometheus-stack', 'blackbox-exporter', 'opentelemetry-operator']
    }
  ]
})
