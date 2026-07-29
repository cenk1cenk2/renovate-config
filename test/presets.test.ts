import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import type { PackageRule, RenovateConfig } from 'renovate/dist/config/types.js'

import { Labels } from '@constants'
import { Groups } from '@groups'
import { Managers } from '@managers'
import { PRESETS, Preset } from '@presets'
import { Rings } from '@rings'

const presets = Object.fromEntries(await Promise.all(Object.entries(PRESETS).map(async([name, preset]) => [name, await preset] as const))) as Record<Preset, RenovateConfig>

// Rules live both in `packageRules` and in the `lockFileMaintenance` sub-config, and both can carry
// labels — walking the whole object is the only way to catch every assignment.
function rules(preset: RenovateConfig): PackageRule[] {
  const found: PackageRule[] = []

  function walk(value: unknown): void {
    if (Array.isArray(value)) {
      value.forEach(walk)

      return
    }

    if (value && typeof value === 'object') {
      const record = value as Record<string, unknown>

      if ('labels' in record || 'addLabels' in record || 'groupSlug' in record) {
        found.push(record as PackageRule)
      }

      Object.values(record).forEach(walk)
    }
  }

  walk(preset)

  return found
}

const entries = Object.entries(presets) as [Preset, RenovateConfig][]

describe('preset registry', () => {
  it('registers every enum member exactly once', () => {
    assert.deepEqual(Object.keys(PRESETS).sort(), Object.values(Preset).sort())
  })
})

describe('labels', () => {
  it('declares `labels` only in the base preset', () => {
    const offenders = entries.filter(([name]) => name !== Preset.BASE).flatMap(([name, preset]) => rules(preset).filter((rule) => 'labels' in rule).map(() => name))

    assert.deepEqual(offenders, [], 'only `base` may use `labels` — every other preset must use `addLabels`, which accumulates instead of overwriting')
  })

  it('sets the base label', () => {
    assert.deepEqual(presets[Preset.BASE].labels, [Labels.RENOVATE])
  })

  it('only ever adds labels from the enum', () => {
    const known = new Set<string>(Object.values(Labels))
    const used = entries.flatMap(([, preset]) => rules(preset).flatMap((rule) => rule.addLabels ?? []))

    assert.deepEqual(used.filter((label) => !known.has(label)), [], 'raw string labels are not allowed')
  })

  it('uses every label the enum declares', () => {
    const used = new Set(entries.flatMap(([, preset]) => rules(preset).flatMap((rule) => rule.addLabels ?? [])))

    assert.deepEqual(
      Object.values(Labels).filter((label) => label !== Labels.RENOVATE && !used.has(label)),
      [],
      'orphan labels in the enum'
    )
  })

  it('namespaces every axis except the umbrella and the automerge flag', () => {
    const flat = Object.values(Labels).filter((label) => !label.includes(':'))

    assert.deepEqual(flat.sort(), [Labels.AUTOMERGE, Labels.RENOVATE].sort())
  })
})

describe('update axis', () => {
  const base = presets[Preset.BASE].packageRules

  function labelFor(updateType: string): Labels[] {
    return base.filter((rule) => rule.matchUpdateTypes?.includes(updateType as never)).flatMap((rule) => rule.addLabels ?? []) as Labels[]
  }

  // `rollback` is intentionally absent: `rollbackPrs` defaults to false and is never enabled here.
  for (const updateType of ['minor', 'patch', 'pin', 'digest', 'pinDigest', 'bump', 'lockfileUpdate']) {
    it(`labels ${updateType} as a minor update`, () => {
      assert.deepEqual(labelFor(updateType), [Labels.UPDATE_MINOR])
    })
  }

  for (const updateType of ['major', 'replacement']) {
    it(`labels ${updateType} as a major update`, () => {
      assert.deepEqual(labelFor(updateType), [Labels.UPDATE_MAJOR])
    })
  }
})

describe('identity labels', () => {
  const all = entries.flatMap(([, preset]) => rules(preset))

  function adds(manager: Managers, label: Labels): boolean {
    return all.some((rule) => rule.matchManagers?.includes(manager) && rule.addLabels?.includes(label))
  }

  const managers: [Managers, Labels][] = [
    [Managers.ANSIBLE_GALAXY, Labels.MANAGER_ANSIBLE_GALAXY],
    [Managers.ARGOCD, Labels.MANAGER_ARGOCD],
    [Managers.DOCKERFILE, Labels.MANAGER_DOCKERFILE],
    [Managers.GITLAB_CI, Labels.MANAGER_GITLAB_CI],
    [Managers.GITLAB_CI_INCLUDE, Labels.MANAGER_GITLAB_CI],
    [Managers.GO, Labels.MANAGER_GO],
    [Managers.HELM, Labels.MANAGER_HELM],
    [Managers.HELM_VALUES, Labels.MANAGER_HELM],
    [Managers.KUBERNETES, Labels.MANAGER_KUBERNETES],
    [Managers.KUSTOMIZE, Labels.MANAGER_KUSTOMIZE],
    [Managers.NODE, Labels.MANAGER_NODE],
    [Managers.OPENTELEMETRY_COLLECTOR_BUILDER, Labels.MANAGER_OTEL_BUILDER],
    [Managers.PYTHON_PEP621, Labels.MANAGER_PYTHON],
    [Managers.RUST_CARGO, Labels.MANAGER_RUST],
    [Managers.TERRAFORM, Labels.MANAGER_TERRAFORM]
  ]

  for (const [manager, label] of managers) {
    it(`tags ${manager} with ${label}`, () => {
      assert.ok(adds(manager, label))
    })
  }

  it('tags the docker datasource', () => {
    assert.ok(all.some((rule) => rule.matchDatasources?.length && rule.addLabels?.includes(Labels.DATASOURCE_DOCKER)))
  })

  it('tags both rings', () => {
    for (const label of [Labels.RING_FAST, Labels.RING_SLOW]) {
      assert.ok(all.some((rule) => rule.addLabels?.includes(label)), `missing ${label}`)
    }
  })
})

// `addLabels` accumulates and can never be unset, so a single-valued axis is only safe if exactly one
// kind of rule ever contributes it. These guard that ownership rather than the label values themselves.
describe('axis ownership', () => {
  const all = entries.flatMap(([name, preset]) => rules(preset).map((rule) => [name, rule] as const))

  function adding(prefix: string): (readonly [Preset, PackageRule])[] {
    return all.filter(([, rule]) => rule.addLabels?.some((label) => label.startsWith(prefix)))
  }

  it('only ever adds an area from a manager-scoped rule', () => {
    assert.deepEqual(
      adding('area:').filter(([, rule]) => !rule.matchManagers).map(([name]) => name),
      [],
      'the manager owns the area axis — a rule that adds an area without matching managers can stack a second area onto the same update'
    )
  })

  it('only ever adds a manager label from a manager-scoped rule', () => {
    assert.deepEqual(adding('manager:').filter(([, rule]) => !rule.matchManagers).map(([name]) => name), [])
  })

  it('only ever adds a datasource label from a datasource-scoped rule', () => {
    assert.deepEqual(adding('datasource:').filter(([, rule]) => !rule.matchDatasources).map(([name]) => name), [])
  })

  it('never adds an area from a datasource rule', () => {
    const offenders = all.filter(([, rule]) => rule.matchDatasources && !rule.matchManagers && rule.addLabels?.some((label) => label.startsWith('area:'))).map(([name]) => name)

    assert.deepEqual(offenders, [], 'a datasource spans many managers, so it cannot know the area')
  })
})

describe('standalone consumption', () => {
  // Each preset ships as its own key in default.json, so a repository can extend `default/manager-helm`
  // without `base`. Those presets have to carry the umbrella themselves or such a repo gets no labels.
  const standalone = entries.filter(([name]) => name.startsWith('manager-') || name.startsWith('datasource-')).filter(([, preset]) => rules(preset).some((rule) => rule.addLabels))

  for (const [name, preset] of standalone) {
    it(`carries the umbrella label in ${name}`, () => {
      assert.ok(rules(preset).some((rule) => rule.addLabels?.includes(Labels.RENOVATE)))
    })
  }
})

describe('grouping', () => {
  const known = new Set<string>([...Object.values(Groups), ...Object.values(Rings)])

  it('only uses slugs declared in an enum', () => {
    const used = entries.flatMap(([, preset]) => rules(preset).map((rule) => rule.groupSlug).filter(Boolean))

    assert.deepEqual([...new Set(used)].filter((slug) => !known.has(slug)), [])
  })

  it('never shares a ring slug across managers', () => {
    assert.equal(new Set(Object.values(Rings)).size, Object.values(Rings).length)
  })
})
