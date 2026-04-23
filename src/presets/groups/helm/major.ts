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
      groupName: 'helm all major dependency updates',
      groupSlug: Groups.HELM_MAJOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchManagers: [Managers.HELM]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: [Labels.RENOVATE, Labels.MAJOR, Labels.INFRASTRUCTURE, Labels.AUTOMERGE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'helm all major automerge dependency updates',
      groupSlug: Groups.HELM_MAJOR_AUTOMERGE,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(perf)'],
      matchManagers: [Managers.HELM],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/open-telemetry/opentelemetry-helm-charts'],
      matchPackageNames: ['kube-prometheus-stack', 'blackbox-exporter', 'opentelemetry-operator']
    }
  ]
})
