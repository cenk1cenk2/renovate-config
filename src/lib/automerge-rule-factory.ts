import type { PackageRule } from 'renovate/dist/config/types.js'

// Renovate decides a branch's automerge as `config.upgrades.every((upgrade) => upgrade.automerge)`
// (`dist/workers/repository/updates/generate.js:250`), and nothing downstream ever reads a per-upgrade
// flag — `update/branch/index.js:721` and `update/branch/automerge.js:10` both read the branch-level one.
// So `automerge: false` on its own does NOT opt one package out of a group that automerges: the package
// stays on the shared branch and takes automerge away from every other dependency sitting on it.
//
// The package has to leave the branch, and `groupName: null` is what does that. It is renovate's own
// default for the option (`config/options/index.js:2512`), `generate.js:129` keys "is this a group" on
// `groupName !== null`, and `branch-name.js:42` skips the entire group block when it is falsy — so
// `groupSlug`, the `separate*` slug prefixes and the `group.branchTopic` override are all bypassed and
// the branch falls back to the per-dependency `branchTopic` default. `config/utils.js:14` merges child
// over parent with a plain object spread, so a later `null` overwrites the group's string; the mergeable
// loop below it is gated on truthiness, so null never reaches it. `validation.js:240` skips every type
// check for null, and `presets/index.js:70` passes null through `replaceArgs` untouched, so it survives
// inside a parameterized preset next to `matchPackageNames: ['{{arg0}}']`.
//
// The string `'null'` is not special anywhere in renovate — that would be a literal group named "null".

// `groupName` ships as `string | undefined` even though null is renovate's own default for it, and
// TypeScript declaration merging cannot widen a property that already exists. The null therefore arrives
// through this one cast rather than through a cast at every call site.
const UNGROUPED = null as unknown as PackageRule['groupName']

// `automerge` and `groupName` are the factory's own. A call site passes the matchers only — it mirrors
// the matchers and `matchUpdateTypes` of the automerge preset it inverts, so the two stay in step.
export type NoAutomergeRule = Omit<PackageRule, 'automerge' | 'groupName'>

// Opt one package out of a group that automerges, without taking the rest of that group down with it.
export function createNoAutomergeRule(rule: NoAutomergeRule): PackageRule {
  return {
    ...rule,
    groupName: UNGROUPED,
    automerge: false
  }
}
