import { SCHEDULE } from '@constants/renovate'
import { createPreset } from '@lib/preset-factory'

/**
 * Auto-merge all development dependencies.
 */

export default createPreset({
  packageRules: [
    {
      packagePatterns: [
        '*'
      ],
      depTypeList: [ 'devDependencies' ],
      groupName: 'all development packages',
      groupSlug: 'all-dev'
    },
    {
      packagePatterns: [
        '*'
      ],
      depTypeList: [ 'peerDependencies' ],
      groupName: 'all peer packages',
      groupSlug: 'all-peer'
    },
    {
      packagePatterns: [
        '*'
      ],
      depTypeList: [ 'dependencies' ],
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      groupName: 'all minor package updates',
      groupSlug: 'all'
    }
  ]
})
