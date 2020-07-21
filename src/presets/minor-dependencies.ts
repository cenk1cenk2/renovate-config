import { createPreset } from '@lib/preset-factory'

export default createPreset({
  packageRules: [
    {
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      automerge: true
    }
  ]
})
