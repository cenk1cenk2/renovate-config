import { NODE_FAST_RING_PACKAGES } from './rings.js'
import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'
import { NODE_GROUP_MINOR, NODE_GROUP_DEV, NODE_GROUP_PEER } from '@presets/groups/node/groups.js'
import { Rings } from '@rings'

export default createPreset({
  packageRules: [
    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      addLabels: [Labels.RING_FAST]
    },
    {
      ...NODE_GROUP_MINOR,
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring minor dependencies',
      groupSlug: Rings.NODE_FAST,
      schedule: [SCHEDULE.ANY]
    },

    // These override the `dep:` value the spread carries. The ring patterns overlap the build and docs
    // lists — `@cenk1cenk2/eslint-config` is in both — so claiming a dep value here would stack a second
    // one onto the overlap. The dep axis stays with the dep groups.
    {
      ...NODE_GROUP_DEV,
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring dev dependencies',
      groupSlug: Rings.NODE_FAST_DEV,
      addLabels: [Labels.AUTOMERGE],
      schedule: [SCHEDULE.ANY]
    },

    {
      ...NODE_GROUP_PEER,
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      groupName: 'node fast ring peer dependencies',
      groupSlug: Rings.NODE_FAST_PEER,
      addLabels: [Labels.AUTOMERGE],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
