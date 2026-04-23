import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'ansible-galaxy all minor dependency updates',
      groupSlug: Groups.ANSIBLE_GALAXY_MINOR,
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.AUTOMERGE],
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
