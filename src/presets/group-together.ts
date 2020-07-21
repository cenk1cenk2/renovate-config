import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '*' ],
      depTypeList: [ 'devDependencies', 'peerDependencies' ],
      groupName: 'all development packages',
      groupSlug: 'all-dev'
    },
    {
      packagePatterns: [ '*' ],
      depTypeList: [ 'dependencies' ],
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      groupName: 'all minor package updates',
      groupSlug: 'all'
    }
  ]
})
