import { Labels, SCHEDULE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// No `digest` update type: pep621 resolves versions from pypi, which has no digest to pin. `major` stays
// out — a breaking python bump is opted into per package through `manager-python-automerge-major`.
export default createPreset({
  packageRules: [
    {
      matchPackageNames: ['*'],
      groupName: 'python all minor dependency updates',
      groupSlug: Groups.PYTHON_MINOR,
      matchUpdateTypes: ['minor', 'patch', 'pin'],
      addLabels: [Labels.AUTOMERGE],
      automerge: true,
      matchManagers: [Managers.PYTHON_PEP621],
      schedule: [SCHEDULE.DAILY]
    }
  ]
})
