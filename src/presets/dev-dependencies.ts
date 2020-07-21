import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      depTypeList: [ 'devDependencies' ],
      automerge: true,
      commitMessageSuffix: '[skip ci]',
      labels: [ 'renovate', 'dev-deps', 'automerge' ],
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
