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
      addLabels: [Labels.AUTOMERGE],
      automerge: true,
      matchDepTypes: ['collections', 'roles'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      commitMessageSuffix: '[skip ci]',
      ignoreTests: true,
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
