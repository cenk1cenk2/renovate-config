import { Labels } from '@constants'
import { Datasources } from '@datasources'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      // No area here. Any custom manager can resolve a dependency through github releases, so the datasource
      // cannot know whether it is a pipeline tool or an infrastructure one.
      matchDatasources: [Datasources.GITHUB_RELEASES],
      addLabels: [Labels.RENOVATE, Labels.DATASOURCE_GITHUB_RELEASES]
    }
  ]
})
