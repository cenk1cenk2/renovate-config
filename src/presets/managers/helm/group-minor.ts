import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure'],
      groupName: 'helm all minor dependency updates for {{ packageFileDir }}',
      groupSlug: 'helm-minor-{{ packageFileDir }}',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.HELM],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major', 'minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure', 'automerge'],
      groupName: 'helm all minor automerge dependency updates',
      groupSlug: 'helm-minor-',
      automerge: true,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.HELM],
      schedule: [SCHEDULE.ANY],
      matchRepositories: ['https://prometheus-community.github.io/helm-charts', 'https://open-telemetry.github.io/opentelemetry-helm-charts'],
      matchPackageNames: ['kube-prometheus-stack', 'blackbox-exporter', 'opentelemetry-operator']
    }
  ]
})
