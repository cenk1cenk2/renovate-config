import { Labels } from '@constants'
import { Datasources } from '@datasources'
import { createPreset } from '@lib'

// Opt-in per image a repository has frozen. Scoped to the docker datasource so a package of the same name from
// another datasource keeps updating. Unbounded by update type on purpose: renovate applies `enabled: false` at the
// pre-lookup stage, where the dependency is skipped before any registry lookup (`workers/repository/process/fetch.js`);
// `updateType` is still undefined there, so a rule bounded by `matchUpdateTypes` only filters those updates out after the lookup.
export default createPreset({
  packageRules: [
    {
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchPackageNames: ['{{arg0}}'],
      matchDatasources: [Datasources.DOCKER],
      enabled: false
    }
  ]
})
