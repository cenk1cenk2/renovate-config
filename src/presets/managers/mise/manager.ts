import { Labels, MINIMUM_RELEASE_AGE } from '@constants'
import { Groups } from '@groups'
import { createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in, extended by a repository after `default/default`. A mise config is a toolchain whose upgrade cadence
// is the repository's call, so `default` extracts mise files but disables their dependencies; this preset's
// `enabled: true` comes later and wins. It cannot instead add mise to `enabledManagers`: that option is not
// mergeable, so a one-manager list here would replace `default`'s and switch every other manager off.
// mise skips its own `minimum_release_age` for an exact version, so the delay has to live here.
export default createPreset({
  packageRules: [
    {
      matchManagers: [Managers.MISE],
      enabled: true,
      minimumReleaseAge: MINIMUM_RELEASE_AGE,
      addLabels: [Labels.RENOVATE, Labels.MANAGER_MISE]
    },
    {
      matchPackageNames: ['*'],
      groupName: 'mise all minor dependency updates',
      groupSlug: Groups.MISE_MINOR,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      automerge: false,
      matchManagers: [Managers.MISE]
    }
  ]
})
