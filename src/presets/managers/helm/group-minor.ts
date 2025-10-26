import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch'],
      labels: ['renovate', 'minor', 'infrastructure'],
      groupName: 'helm all minor dependency updates for {{ packageFileDir }}',
      groupSlug: 'helm-minor-{{ packageFileDir }}',
      automerge: false,
      extends: [':semanticCommitTypeAll(feat)'],
      matchManagers: [Managers.HELM],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
