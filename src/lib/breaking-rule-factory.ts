import type { PackageRule } from 'renovate/dist/config/types.js'

// The conventional breaking marker, as a whole `type(scope):` prefix.
//
// Renovate assembles that prefix itself, but only while `commitMessagePrefix` is unset
// (`!upgrade.commitMessagePrefix`, `dist/workers/repository/updates/generate.js:53`), and it has no slot
// for the `!`. Supplying a prefix therefore replaces the assembly rather than adding to it, so this
// rebuilds exactly what renovate would have produced — the `if (semanticCommitScope)` branch included —
// and appends the marker.
//
// The type has to stay a template. A literal `perf(deps)!:` would flatten `fix` for node dependencies,
// `build` and `docs` for the node dev groups, `ci` for gitlab-ci and `perf` for the Pattern M majors onto
// a single type for every major in the estate. `commitMessage` is compiled three times, so these
// handlebars survive the first pass and resolve on the next.
export const BREAKING_COMMIT_MESSAGE_PREFIX = '{{semanticCommitType}}{{#if semanticCommitScope}}({{semanticCommitScope}}){{/if}}!:'

// Everything a call site may pass. The three fields the factories own are withheld: `matchUpdateTypes`
// because a marker that is not bounded to `major` would mark every update type breaking, and the two
// commit-message fields because they are the whole point of the factory rather than a default.
export type BreakingMajorRule = Omit<PackageRule, 'matchUpdateTypes' | 'commitMessagePrefix' | 'commitMessageAction'>

// Note the spread goes first and the owned fields last, the opposite way round from
// `createMultiDirectoryGroupRule`, whose derived fields are defaults a call site may override. These two
// functions are the only place in the repo that decides whether a major commit carries the marker.

// A major of whatever the call site matches breaks the consuming repository's own contract.
export function createBreakingMajorRule(rule: BreakingMajorRule): PackageRule {
  return {
    ...rule,
    matchUpdateTypes: ['major'],
    commitMessagePrefix: BREAKING_COMMIT_MESSAGE_PREFIX,
    // Supplying a prefix also skips the branch that sets renovate's internal `toLowerCase` flag
    // (`generate.js:58`), so the capitalised `Update` that every other update type loses would survive
    // here. Stating the action in lower case restores it.
    commitMessageAction: 'update'
  }
}

// It does not — the dependency moved, the repository's own contract did not.
export function createNoBreakingMajorRule(rule: BreakingMajorRule): PackageRule {
  return {
    ...rule,
    matchUpdateTypes: ['major'],
    // Empty rather than absent. This rule lands after the one it undoes and `commitMessagePrefix` is
    // last-match-wins, so omitting the field would leave the earlier marker standing. `''` is falsy at
    // `generate.js:53`, which puts renovate back on its own assembly — and so back on the `toLowerCase`
    // flag, which is why the action returns to renovate's own default rather than the lower-case one.
    commitMessagePrefix: '',
    commitMessageAction: 'Update'
  }
}
