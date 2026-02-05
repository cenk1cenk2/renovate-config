import { Datasources, SCHEDULE } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      labels: ['renovate', 'minor', 'infrastructure'],
      groupName: 'docker datasource minor dependency updates',
      groupSlug: 'docker-minor',
      automerge: true,
      matchDatasources: [Datasources.DOCKER],
      matchPackageNames: ['ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector-contrib'],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
