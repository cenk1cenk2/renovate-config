import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'helm',
      updateType: 'major',
      groupSlug: Groups.HELM_MAJOR,
      matchManagers: [Managers.HELM]
    }),
    createMultiDirectoryGroupRule({
      name: 'helm',
      updateType: 'major',
      groupSlug: Groups.HELM_MAJOR_AUTOMERGE,
      matchManagers: [Managers.HELM],
      automerge: true,
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/open-telemetry/opentelemetry-helm-charts'],
      matchPackageNames: ['kube-prometheus-stack', 'blackbox-exporter', 'opentelemetry-operator']
    })
  ]
})
