import { Managers, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'ansible-galaxy all minor dependency updates',
      groupSlug: 'ansible-galaxy-minor',
      labels: ['renovate', 'minor', 'automerge'],
      automerge: true,
      matchDepTypes: ['collections', 'roles'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      commitMessageSuffix: '[skip ci]',
      matchManagers: [Managers.ANSIBLE_GALAXY],
      schedule: [SCHEDULE.DAILY]
    },
    {
      matchManagers: [Managers.ANSIBLE_GALAXY],
      matchDepTypes: ['collections', 'roles'],
      rangeStrategy: 'bump'
    }
  ]
})
