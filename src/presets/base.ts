import { ASSIGNEES, Labels, TIMEZONE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  extends: ['config:recommended', ':configMigration', ':dependencyDashboard', ':disableRateLimiting', ':updateNotScheduled', ':enableVulnerabilityAlerts'],
  timezone: TIMEZONE,
  semanticCommits: 'enabled',
  // assignees: ASSIGNEES,
  reviewers: ASSIGNEES,
  labels: [Labels.RENOVATE],
  prCreation: 'immediate',
  packageRules: [
    // The update axis is assigned once here so no downstream rule has to restate it. `rollback` is left
    // uncovered on purpose: `rollbackPrs` defaults to false and this config never enables it.
    {
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest', 'pinDigest', 'bump'],
      addLabels: [Labels.UPDATE_MINOR]
    },
    {
      matchUpdateTypes: ['major', 'replacement'],
      addLabels: [Labels.UPDATE_MAJOR]
    },

    // Renovate assembles the semantic `type(scope):` prefix itself, but only while `commitMessagePrefix`
    // is unset (`dist/workers/repository/updates/generate.js`), and it has no slot for the conventional
    // breaking marker. Supplying the whole prefix is the only way to reach it, so this rebuilds what
    // renovate would have produced — `if (semanticCommitScope)` branch included — and appends the `!`.
    // The type has to stay a template: a literal would flatten `fix` for node dependencies, `build` and
    // `docs` for the node dev groups, `ci` for gitlab-ci and `perf` for the Pattern M majors onto one.
    // `commitMessage` is compiled three times, so these handlebars survive the first pass and resolve on
    // the next.
    //
    // `replacement` is left unmarked: renovate swaps a package for another rather than bumping a version.
    {
      matchUpdateTypes: ['major'],
      commitMessagePrefix: '{{semanticCommitType}}{{#if semanticCommitScope}}({{semanticCommitScope}}){{/if}}!:',
      // A supplied prefix also skips the branch that sets renovate's internal `toLowerCase` flag, so the
      // capitalised `Update` every other update type loses would survive here. Lower case restores it.
      commitMessageAction: 'update'
    }
  ]
})
