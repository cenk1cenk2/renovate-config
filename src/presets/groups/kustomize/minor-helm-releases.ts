import { Labels } from '@constants'
import { Managers } from '@managers'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'kustomize all minor dependency updates',
      groupSlug: Groups.KUSTOMIZE_MINOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE]
    },
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE, Labels.AUTOMERGE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'kustomize all minor automerge dependency updates',
      groupSlug: Groups.KUSTOMIZE_MINOR_AUTOMERGE,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(feat)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/grafana/helm-charts'],
      matchPackageNames: ['prometheus-blackbox-exporter', 'alloy']
    }
  ]
})
