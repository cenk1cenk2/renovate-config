import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '*' ],
      depTypeList: [ 'peerDependencies' ],
      groupName: 'all peer dependencies',
      groupSlug: 'all-peer',
      commitMessageSuffix: '[skip ci]',
      labels: [ 'renovate', 'peer-deps', 'automerge' ],
      automerge: true,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
