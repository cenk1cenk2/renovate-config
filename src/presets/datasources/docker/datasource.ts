import { Labels, SCHEDULE } from '@constants'
import { Datasources } from '@datasources'
import { Groups } from '@groups'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      // No area here. 36 managers emit docker deps, spanning pipelines and infrastructure, and
      // `addLabels` cannot be unset — a second area value on the same MR would be unremovable.
      matchDatasources: [Datasources.DOCKER],
      addLabels: [Labels.RENOVATE, Labels.DATASOURCE_DOCKER]
    },
    {
      // The one package this config still automerges estate-wide. `docker/dockerfile` is the Dockerfile
      // syntax directive, not an application image: it ships the frontend every consuming repository
      // already builds with, so opting in per repository would be the same decision 99 times.
      enabled: true,
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      addLabels: [Labels.AUTOMERGE],
      groupName: 'docker datasource minor dependency updates',
      groupSlug: Groups.DOCKER_MINOR,
      automerge: true,
      matchDatasources: [Datasources.DOCKER],
      matchPackageNames: ['docker/dockerfile'],
      schedule: [SCHEDULE.ANY]
    }
  ]
})
