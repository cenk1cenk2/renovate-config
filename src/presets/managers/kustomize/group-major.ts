import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['major'],
      rangeStrategy: 'auto',
      labels: ['renovate', 'major', 'infrastructure'],
      automerge: false,
      extends: [':semanticCommitTypeAll(perf)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
