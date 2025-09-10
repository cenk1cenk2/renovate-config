import { Managers } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.GITLAB_CI_INCLUDE, Managers.GITLAB_CI]
})
