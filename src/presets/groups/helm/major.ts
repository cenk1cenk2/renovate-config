import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'helm',
      updateType: 'major',
      slug: Groups.HELM_MAJOR,
      managers: [Managers.HELM]
    }),
    createMultiDirectoryGroupRule({
      name: 'helm',
      updateType: 'major',
      slug: Groups.HELM_MAJOR_AUTOMERGE,
      managers: [Managers.HELM],
      automerge: true,
      sourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/open-telemetry/opentelemetry-helm-charts'],
      packageNames: ['kube-prometheus-stack', 'blackbox-exporter', 'opentelemetry-operator']
    })
  ]
})
