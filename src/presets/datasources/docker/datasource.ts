import { Labels, SCHEDULE } from '@constants'
import { Datasources } from '@datasources'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      labels: [Labels.RENOVATE, Labels.MINOR, Labels.INFRASTRUCTURE, Labels.AUTOMERGE],
      groupName: 'docker datasource minor dependency updates',
      groupSlug: Groups.DOCKER_MINOR,
      automerge: true,
      matchDatasources: [Datasources.DOCKER],
      matchPackageNames: ['ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector-contrib', 'renovate/renovate'],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
