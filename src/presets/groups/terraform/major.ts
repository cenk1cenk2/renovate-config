import { Groups } from '@groups'
import { createBreakingMajorRule, createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'
import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '@presets/managers/terraform/custom-manager.js'

// The one manager whose majors are breaking centrally. A terraform major moves a provider, a module or a
// release that the repository's own state is pinned to, so the plan it produces is not the plan the
// previous version produced - that is the repository's contract, not a dependency's. Every other manager
// leaves the call to the consuming repository via `manager-<name>-breaking-major`.
//
// A repository that bundles many units rather than wrapping one opts back out with
// `manager-terraform-non-breaking-major`, which lands after `default/default` and wins on last-match.
export default createPreset({
  packageRules: [
    createBreakingMajorRule(
      createMultiDirectoryGroupRule({
        name: 'terraform',
        matchUpdateTypes: ['major'],
        commitType: 'perf',
        groupSlug: Groups.TERRAFORM_MAJOR,
        matchManagers: [Managers.TERRAFORM],
        matchDepTypes: ['helm_release', 'provider', 'required_provider', 'module']
      })
    ),
    createBreakingMajorRule(
      createMultiDirectoryGroupRule({
        name: 'terraform-monorepo',
        matchUpdateTypes: ['major'],
        commitType: 'perf',
        groupSlug: Groups.TERRAFORM_MONOREPO_MAJOR,
        matchManagers: [Managers.REGEX],
        matchDepTypes: [DEP_TYPE_TERRAFORM_MANAGER_MONOREPO],
        matchSourceUrls: ['https://gitlab.kilic.dev/**']
      })
    )
  ]
})
