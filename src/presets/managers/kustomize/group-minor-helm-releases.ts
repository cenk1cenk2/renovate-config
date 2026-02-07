import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor'],
      groupSlug: 'kustomize-',
      automerge: false,
      extends: [':semanticCommitTypeAll(fix)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY]
    },
    {
      enabled: true,
      matchUpdateTypes: ['major', 'minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure', 'automerge'],
      groupName: 'helm all minor automerge dependency updates for kustomize',
      groupSlug: 'kustomize-minor-',
      automerge: true,
      extends: [':semanticCommitTypeAll(feat)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY],
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts'],
      matchPackageNames: ['blackbox-exporter']
    }
  ]
})
