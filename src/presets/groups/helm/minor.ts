import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'helm all minor dependency updates',
      groupSlug: Groups.HELM_MINOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.HELM]
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE, Labels.AUTOMERGE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'helm all minor automerge dependency updates',
      groupSlug: Groups.HELM_MINOR_AUTOMERGE,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.HELM],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/open-telemetry/opentelemetry-helm-charts'],
      matchPackageNames: ['kube-prometheus-stack', 'blackbox-exporter', 'opentelemetry-operator']
    }
  ]
})
