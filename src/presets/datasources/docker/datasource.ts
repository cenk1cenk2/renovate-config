import { Labels } from '@constants'
import { Datasources } from '@datasources'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      // No area here. 36 managers emit docker deps, spanning pipelines and infrastructure, and
      // `addLabels` cannot be unset — a second area value on the same MR would be unremovable.
      matchDatasources: [Datasources.DOCKER],
      addLabels: [Labels.RENOVATE, Labels.DATASOURCE_DOCKER]
    }
  ]
})
