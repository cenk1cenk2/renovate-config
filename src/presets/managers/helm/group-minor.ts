import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure'],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'helm all minor dependency updates for {{ packageFileDir }}',
      groupSlug: 'helm-minor',
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.HELM],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure', 'automerge'],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'helm all minor automerge dependency updates for {{ packageFileDir }}',
      groupSlug: 'helm-minor-automerge',
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.HELM],
      schedule: [SCHEDULE.ANY],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/open-telemetry/opentelemetry-helm-charts'],
      matchPackageNames: ['kube-prometheus-stack', 'blackbox-exporter', 'opentelemetry-operator']
    }
  ]
})
