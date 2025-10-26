import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor'],
      additionalBranchPrefix: 'kustomize-',
      automerge: false,
      extends: [':semanticCommitTypeAll(fix)'],
      matchDepTypes: ['HelmChart'],
      matchManagers: [Managers.KUSTOMIZE],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
