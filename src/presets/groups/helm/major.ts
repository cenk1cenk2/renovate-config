import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// The automerge twin carries a bounded exact-name matchPackageNames allowlist for charts whose major
// version tracks an upstream dependency bump (e.g. kube-prometheus-stack → prometheus-operator), not a
// chart-level breaking change. replacement updates stay banned outright by policy.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'helm',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.HELM_MAJOR,
      matchManagers: [Managers.HELM]
    }),
    createMultiDirectoryGroupRule({
      name: 'helm',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.HELM_MAJOR_AUTOMERGE,
      matchManagers: [Managers.HELM],
      automerge: true,
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/open-telemetry/opentelemetry-helm-charts'],
      matchPackageNames: ['kube-prometheus-stack', 'blackbox-exporter', 'opentelemetry-operator']
    })
  ]
})
