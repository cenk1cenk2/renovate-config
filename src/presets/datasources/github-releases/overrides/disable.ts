import { Labels } from '@constants'
import { Datasources } from '@datasources'
import { createPreset } from '@lib'

// Opt-in per package a repository has frozen. Scoped to the github-releases datasource so a package of the same name
// from another datasource keeps updating. Unbounded by update type for the same reason as the docker disable.
export default createPreset({
  packageRules: [
    {
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchPackageNames: ['{{arg0}}'],
      matchDatasources: [Datasources.GITHUB_RELEASES],
      enabled: false
    }
  ]
})
