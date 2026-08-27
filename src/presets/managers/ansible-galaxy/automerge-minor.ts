import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per role or collection, argument passed by the consuming repository. Mirrors the central group
// down to the dep types and the skip-ci suffix, but keeps its own slug: the central group automerges
// nothing, and a grouped branch automerges only when every upgrade on it does.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'ansible-galaxy all minor automerge dependency updates',
      groupSlug: Groups.ANSIBLE_GALAXY_MINOR_AUTOMERGE,
      matchDepTypes: ['collections', 'roles'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      commitMessageSuffix: '[skip ci]',
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.ANSIBLE_GALAXY],
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
