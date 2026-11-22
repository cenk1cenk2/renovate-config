import { COMMIT_MESSAGE_NEW_VALUE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  groupName: '{{arg0}}',
  groupSlug: '{{arg0}}',
  additionalBranchPrefix: '',
  commitMessageExtra: `to ${COMMIT_MESSAGE_NEW_VALUE}`,
  group: { commitMessageTopic: '{{{groupName}}}' }
})
