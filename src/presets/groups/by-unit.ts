import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchFileNames: ['{{arg0}}/**'],
      additionalBranchPrefix: '{{arg0}}-',
      commitMessageExtra: 'to {{{newValue}}} [{{arg0}}]'
    }
  ]
})
