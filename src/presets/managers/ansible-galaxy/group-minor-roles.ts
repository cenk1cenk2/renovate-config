import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackagePatterns: ['*'],
      groupName: 'all minor dependency updates',
      groupSlug: 'all',
      matchDepTypes: ['collections', 'roles'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      rangeStrategy: 'bump',
      commitMessageSuffix: '[skip ci]',
      labels: ['renovate', 'minor', 'automerge'],
      automerge: true,
      matchManagers: [Managers.ANSIBLE_GALAXY],
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
