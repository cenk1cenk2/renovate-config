import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// The automerge twin carries a bounded exact-name matchPackageNames allowlist for charts whose major
// version tracks an upstream dependency bump rather than a chart-level breaking change. matchDepTypes
// must mirror the catch-all and the minor twin — omitting it makes the rule match nothing silently.
// replacement updates stay banned outright by policy.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.KUSTOMIZE_MAJOR,
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart']
    }),
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.KUSTOMIZE_MAJOR_AUTOMERGE,
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart'],
      automerge: true,
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/grafana/helm-charts', 'https://gitlab.com/gitlab-org/charts/gitlab-runner'],
      matchPackageNames: ['prometheus-blackbox-exporter', 'alloy', 'gitlab-runner']
    })
  ]
})
