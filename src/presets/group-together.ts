import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      packagePatterns: [ '*' ],
      depTypeList: [ 'devDependencies', 'peerDependencies' ],
      labels: [ 'renovate', 'dev-deps', 'automerge' ],
      groupName: 'all development packages',
      groupSlug: 'all-dev'
    },
    {
      packagePatterns: [ '*' ],
      depTypeList: [ 'dependencies' ],
      labels: [ 'renovate', 'deps', 'automerge' ],
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      groupName: 'all minor package updates',
      groupSlug: 'all'
    }
  ]
})
