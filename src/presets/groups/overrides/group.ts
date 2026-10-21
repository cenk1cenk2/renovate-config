import { createPreset } from '@lib'

export default createPreset({
  groupName: '{{arg0}}',
  groupSlug: '{{arg0}}',
  additionalBranchPrefix: '',
  commitMessageExtra: 'to {{{newValue}}}',
  group: { commitMessageTopic: '{{{groupName}}}' }
})
