import { extractPackageFile } from 'renovate/dist/modules/manager/custom/regex/index.js'
import { matchRegexOrGlobList } from 'renovate/dist/util/string-match.js'
import { describe, expect, it } from 'vitest'

import disable from '@presets/datasources/docker/overrides/disable.js'
import kargo from '@presets/managers/kargo/manager.js'

const CONTENT = `---
warehouses:
  - name: gokapi
    spec:
      subscriptions:
        - image:
            repoURL: f0rc3/gokapi
            constraint: "^2.0.0"
            imageSelectionStrategy: SemVer
    pins:
      - file: .deploy/{stage}/deployment.yaml
        key: spec.template.spec.containers.0.image

  - name: valkey
    spec:
      subscriptions:
        - chart:
            repoURL: https://valkey.io/valkey-helm/
            name: valkey
            semverConstraint: "^0.12.0"
    pins:
      - file: .deploy/{stage}/valkey/kustomization.yaml
        key: helmCharts.0.version

  - name: operator-lb
    spec:
      subscriptions:
        - chart:
            repoURL: oci://registry.kilic.dev/cluster/operators/operator-lb/operator-lb
            semverConstraint: ~1.2.0
    pins:
      - file: "{stage}/operator-lb/patch-applicationset.yaml"
        key: spec.template.spec.sources.0.targetRevision

  - name: opentelemetry-operator
    spec:
      subscriptions:
        - git:
            repoURL: https://gitlab.kilic.dev/cluster/charts/chart-opentelemetry-operator.git
            commitSelectionStrategy: SemVer
            semverConstraint: "^1.0.0"
    pins:
      - file: "{stage}/opentelemetry-operator/patch-applicationset.yaml"
        key: spec.template.spec.sources.0.targetRevision

  - name: busybox
    spec:
      subscriptions:
        - image:
            repoURL: busybox
            constraint: latest
            imageSelectionStrategy: Digest
    pins:
      - file: .deploy/{stage}/deployment.yaml
        key: spec.template.spec.initContainers.0.image

  - name: rustfs
    spec:
      subscriptions:
        - chart:
            repoURL: https://charts.rustfs.com/
            name: rustfs
            semverConstraint: "*"
    pins:
      - file: .deploy/rubik/{stage}/kustomization.yaml
        key: helmCharts.0.version
`

describe('kargo warehouse manager', () => {
  const deps = kargo.customManagers.flatMap((manager) => extractPackageFile(CONTENT, '.promote/values.yaml', manager)?.deps ?? [])

  it.each(['.promote/values.yaml', '.promote/opentelemetry-operator/values.yaml'])('matches %s', (path) => {
    expect(kargo.customManagers.every((manager) => matchRegexOrGlobList(path, manager.managerFilePatterns))).toBe(true)
  })

  it.each(['.deploy/rubik/kustomization.yaml', 'promote/values.yaml', '.promote/kustomization.json'])('does not match %s', (path) => {
    expect(kargo.customManagers.some((manager) => matchRegexOrGlobList(path, manager.managerFilePatterns))).toBe(false)
  })

  it('extracts only capped constraints, one per subscription kind', () => {
    expect(deps.map(({ depName, packageName, datasource, registryUrls, currentValue }) => ({ depName, packageName, datasource, registryUrls, currentValue }))).toEqual([
      { depName: 'f0rc3/gokapi', packageName: undefined, datasource: 'docker', registryUrls: undefined, currentValue: '^2.0.0' },
      { depName: 'valkey', packageName: undefined, datasource: 'helm', registryUrls: ['https://valkey.io/valkey-helm/'], currentValue: '^0.12.0' },
      { depName: 'registry.kilic.dev/cluster/operators/operator-lb/operator-lb', packageName: undefined, datasource: 'docker', registryUrls: undefined, currentValue: '~1.2.0' },
      {
        depName: 'cluster/charts/chart-opentelemetry-operator',
        packageName: 'cluster/charts/chart-opentelemetry-operator',
        datasource: 'gitlab-tags',
        registryUrls: ['https://gitlab.kilic.dev/'],
        currentValue: '^1.0.0'
      }
    ])
  })

  it('keeps a frozen image updating its warehouse constraint', () => {
    expect(matchRegexOrGlobList('.promote/values.yaml', disable.packageRules[0].matchFileNames)).toBe(false)
    expect(matchRegexOrGlobList('.promote/external-dns-opnsense-loki/values.yaml', disable.packageRules[0].matchFileNames)).toBe(false)
    expect(matchRegexOrGlobList('.deploy/rubik/deployment.yaml', disable.packageRules[0].matchFileNames)).toBe(true)
  })
})
