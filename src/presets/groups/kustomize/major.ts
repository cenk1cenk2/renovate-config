import { Labels } from '@constants'
import { Managers } from '@managers'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: [Labels.RENOVATE, Labels.MAJOR, Labels.INFRASTRUCTURE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'kustomize all major dependency updates',
      groupSlug: Groups.KUSTOMIZE_MAJOR,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      labels: [Labels.RENOVATE, Labels.MAJOR, Labels.INFRASTRUCTURE, Labels.AUTOMERGE],
      additionalBranchPrefix: '{{packageFileDir}}-',
      groupName: 'kustomize all major automerge dependency updates',
      groupSlug: Groups.KUSTOMIZE_MAJOR_AUTOMERGE,
      commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
      automerge: true,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/grafana/helm-charts'],
      matchPackageNames: ['prometheus-blackbox-exporter', 'alloy']
    }
  ]
})
