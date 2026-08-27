import { Labels } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per package, argument passed by the consuming repository. Mirrors the central group down to
// the slug, so an opt-in shares its merge request. No `digest` update type: pep621 resolves versions
// from pypi, which has no digest to pin.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['{{arg0}}'],
      groupName: 'python all minor dependency updates',
      groupSlug: Groups.PYTHON_MINOR,
      matchUpdateTypes: ['minor', 'patch', 'pin'],
      addLabels: [Labels.RENOVATE, Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.PYTHON_PEP621]
    }
  ]
})
