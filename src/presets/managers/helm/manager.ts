import { Labels, SCHEDULE } from '@constants'
import { Datasources } from '@datasources'
import { createPreset, createScopes } from '@lib'
import { Managers } from '@managers'
import { Preset } from '@presets'

export default createPreset({
  enabledManagers: [Managers.HELM, Managers.HELM_VALUES],
  postUpdateOptions: ['helmUpdateSubChartArchives'],
  extends: createScopes(Preset.GROUP_HELM_MINOR, Preset.GROUP_HELM_MAJOR),
  packageRules: [
    {
      matchManagers: [Managers.HELM, Managers.HELM_VALUES],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_HELM, Labels.AREA_INFRASTRUCTURE],
      schedule: [SCHEDULE.ANY]
    },
    {
      // The helm groups are scoped to `helmv3`, so an image pinned in a chart's `values.yaml` matches no
      // commit-type rule and falls through to `:semanticCommitTypeFixDepsChoreOthers`, which calls it
      // `chore`. semantic-release cuts no version for `chore`, so the bump sat on the default branch
      // until some unrelated commit released it. `fix` releases a patch, which is what a chart shipping a
      // new image version is. Scoped to the docker datasource so it only claims the image bumps, and
      // scoped off `helmv3` so an OCI chart dependency keeps the `feat`/`perf` its group assigns.
      matchManagers: [Managers.HELM_VALUES],
      matchDatasources: [Datasources.DOCKER],
      semanticCommitType: 'fix'
    }
  ]
})
