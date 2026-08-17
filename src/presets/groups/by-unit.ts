import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      matchFileNames: ['{{arg0}}/**'],
      additionalBranchPrefix: '{{arg0}}-',
      commitMessageExtra: 'to {{{newValue}}} [{{arg0}}]',
      // The unit collapses every directory onto one branch, so the directory the multi-directory
      // managers put in `group.commitMessageTopic` is whichever dependency renovate happens to sort
      // first. `group` is `mergeable: true`, so overriding this one key leaves `branchTopic` alone.
      group: { commitMessageTopic: '{{{groupName}}} [{{arg0}}]' }
    }
  ]
})
