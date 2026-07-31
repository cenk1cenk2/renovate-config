import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// The automerge twin carries a bounded exact-name matchPackageNames allowlist of git URLs for chart
// repos whose major version tracks an upstream dependency bump rather than a chart-level breaking
// change. argocd uses git URLs as package names with no matchSourceUrls — do not normalise to chart
// names. replacement updates stay banned outright by policy.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.ARGOCD_MAJOR,
      matchManagers: [Managers.ARGOCD]
    }),
    createMultiDirectoryGroupRule({
      name: 'argocd',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.ARGOCD_MAJOR_AUTOMERGE,
      matchManagers: [Managers.ARGOCD],
      automerge: true,
      matchPackageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    })
  ]
})
