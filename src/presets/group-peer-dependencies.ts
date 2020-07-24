import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '*' ],
      depTypeList: [ 'peerDependencies' ],
      groupName: 'all peer dependency updates',
      groupSlug: 'all-peer',
      rangeStrategy: 'widen',
      commitMessageSuffix: '[skip ci]',
      labels: [ 'renovate', 'peer-deps', 'automerge' ],
      automerge: true,
      schedule: [ SCHEDULE.ANY ]
    }
  ]
})
