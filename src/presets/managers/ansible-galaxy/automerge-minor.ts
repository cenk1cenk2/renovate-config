import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per role or collection, argument passed by the consuming repository. Mirrors the central twin
// down to the slug, the dep types and the skip-ci suffix, so an early opt-in shares its merge request.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'ansible-galaxy all minor dependency updates',
      groupSlug: Groups.ANSIBLE_GALAXY_MINOR,
      matchDepTypes: ['collections', 'roles'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      commitMessageSuffix: '[skip ci]',
      ignoreTests: true,
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.ANSIBLE_GALAXY],
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
