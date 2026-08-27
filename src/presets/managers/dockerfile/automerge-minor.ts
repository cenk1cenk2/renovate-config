import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per image, argument passed by the consuming repository. Scoped to the dockerfile manager, so
// it matches only images declared in a Dockerfile — the docker datasource keys cover every other manager.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'dockerfile all minor automerge dependency updates',
      groupSlug: Groups.DOCKERFILE_MINOR_AUTOMERGE,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.DOCKERFILE]
    }
  ]
})
