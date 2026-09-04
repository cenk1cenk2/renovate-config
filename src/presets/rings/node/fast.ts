import { NODE_FAST_RING_PACKAGES } from './rings.js'
import { Labels, SCHEDULE } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'
import { Rings } from '@rings'

// A ring owns cadence and grouping and nothing else. It is extended after the dep-type groups so its
// `groupSlug` and `schedule` win on last-match, which is also why it must restate none of their fields:
// the commit type, `[skip ci]`, `ignoreTests` and `automerge` belong to the group that claimed the
// package, and a ring that spread them would strip a build dependency of its pipeline.
export default createPreset({
  packageRules: [
    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      addLabels: [Labels.RING_FAST]
    },

    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      matchDepTypes: ['dependencies'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      groupName: 'node fast ring minor dependencies',
      groupSlug: Rings.NODE_FAST,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      matchDepTypes: ['devDependencies'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      groupName: 'node fast ring dev dependencies',
      groupSlug: Rings.NODE_FAST_DEV,
      schedule: [SCHEDULE.ANY]
    },

    {
      matchManagers: [Managers.NODE],
      matchPackageNames: NODE_FAST_RING_PACKAGES,
      matchDepTypes: ['peerDependencies', 'optionalDependencies'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      groupName: 'node fast ring peer dependencies',
      groupSlug: Rings.NODE_FAST_PEER,
      schedule: [SCHEDULE.ANY]
    }
  ]
})
