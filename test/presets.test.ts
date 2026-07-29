import type { PackageRule, RenovateConfig } from 'renovate/dist/config/types.js'
import { describe, expect, it } from 'vitest'

import { Labels } from '@constants'
import { Groups } from '@groups'
import { Managers } from '@managers'
import { PRESETS, Preset } from '@presets'
import { Rings } from '@rings'

const presets = Object.fromEntries(await Promise.all(Object.entries(PRESETS).map(async([name, preset]) => [name, await preset] as const))) as Record<Preset, RenovateConfig>
const entries = Object.entries(presets) as [Preset, RenovateConfig][]

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

const allRules = entries.flatMap(([name, preset]) => rules(preset).map((rule) => [name, rule] as const))

describe('preset registry', () => {
  it('registers every enum member exactly once', () => {
    expect(Object.keys(PRESETS).sort()).toEqual(Object.values(Preset).sort())
  })
})

describe('labels', () => {
  it('declares `labels` only in the base preset', () => {
    const offenders = allRules.filter(([name, rule]) => name !== Preset.BASE && 'labels' in rule).map(([name]) => name)

    expect(offenders, 'only `base` may use `labels` — every other preset must use `addLabels`, which accumulates instead of overwriting').toEqual([])
  })

  it('sets the base label', () => {
    expect(presets[Preset.BASE].labels).toEqual([Labels.RENOVATE])
  })

  it('only ever adds labels from the enum', () => {
    const known = new Set<string>(Object.values(Labels))

    expect(allRules.flatMap(([, rule]) => rule.addLabels ?? []).filter((label) => !known.has(label)), 'raw string labels are not allowed').toEqual([])
  })

  it('uses every label the enum declares', () => {
    const used = new Set(allRules.flatMap(([, rule]) => rule.addLabels ?? []))

    expect(Object.values(Labels).filter((label) => label !== Labels.RENOVATE && !used.has(label)), 'orphan labels in the enum').toEqual([])
  })

  it('namespaces every axis except the umbrella and the automerge flag', () => {
    expect(Object.values(Labels).filter((label) => !label.includes(':')).sort()).toEqual([Labels.AUTOMERGE, Labels.RENOVATE].sort())
  })
})

describe('update axis', () => {
  function labelFor(updateType: string): Labels[] {
    return presets[Preset.BASE].packageRules.filter((rule) => rule.matchUpdateTypes?.includes(updateType as never)).flatMap((rule) => rule.addLabels ?? []) as Labels[]
  }

  // `rollback` is intentionally absent: `rollbackPrs` defaults to false and is never enabled here.
  for (const updateType of ['minor', 'patch', 'pin', 'digest', 'pinDigest', 'bump', 'lockfileUpdate']) {
    it(`labels ${updateType} as a minor update`, () => {
      expect(labelFor(updateType)).toEqual([Labels.UPDATE_MINOR])
    })
  }

  for (const updateType of ['major', 'replacement']) {
    it(`labels ${updateType} as a major update`, () => {
      expect(labelFor(updateType)).toEqual([Labels.UPDATE_MAJOR])
    })
  }
})

// `addLabels` accumulates and can never be unset, so a single-valued axis is only safe if exactly one
// kind of rule ever contributes it. These guard that ownership rather than the label values themselves.
describe('axis ownership', () => {
  function adding(prefix: string): (readonly [Preset, PackageRule])[] {
    return allRules.filter(([, rule]) => rule.addLabels?.some((label) => label.startsWith(prefix)))
  }

  it('only ever adds an area from a manager-scoped rule', () => {
    expect(
      adding('area:').filter(([, rule]) => !rule.matchManagers).map(([name]) => name),
      'the manager owns the area axis — a rule that adds an area without matching managers can stack a second area onto the same update'
    ).toEqual([])
  })

  it('only ever adds a manager label from a manager-scoped rule', () => {
    expect(adding('manager:').filter(([, rule]) => !rule.matchManagers).map(([name]) => name)).toEqual([])
  })

  it('only ever adds a datasource label from a datasource-scoped rule', () => {
    expect(adding('datasource:').filter(([, rule]) => !rule.matchDatasources).map(([name]) => name)).toEqual([])
  })

  it('never adds an area from a datasource rule', () => {
    const offenders = allRules.filter(([, rule]) => rule.matchDatasources && !rule.matchManagers && rule.addLabels?.some((label) => label.startsWith('area:'))).map(([name]) => name)

    expect(offenders, 'a datasource spans many managers, so it cannot know the area').toEqual([])
  })
})

describe('standalone consumption', () => {
  // Each preset ships as its own key in default.json, so a repository can extend `default/manager-helm`
  // without `base`. Those presets have to carry the umbrella themselves or such a repo gets no labels.
  const standalone = entries.filter(([name]) => name.startsWith('manager-') || name.startsWith('datasource-')).filter(([, preset]) => rules(preset).some((rule) => rule.addLabels))

  for (const [name, preset] of standalone) {
    it(`carries the umbrella label in ${name}`, () => {
      expect(rules(preset).some((rule) => rule.addLabels?.includes(Labels.RENOVATE))).toBe(true)
    })
  }
})

describe('grouping', () => {
  const known = new Set<string>([...Object.values(Groups), ...Object.values(Rings)])

  it('only uses slugs declared in an enum', () => {
    const used = new Set(allRules.map(([, rule]) => rule.groupSlug).filter(Boolean))

    expect([...used].filter((slug) => !known.has(slug))).toEqual([])
  })

  it('never shares a ring slug across managers', () => {
    expect(new Set(Object.values(Rings)).size).toBe(Object.values(Rings).length)
  })
})

describe('managers', () => {
  const identities: [Managers, Labels][] = [
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

  for (const [manager, label] of identities) {
    it(`tags ${manager} with ${label}`, () => {
      expect(allRules.some(([, rule]) => rule.matchManagers?.includes(manager) && rule.addLabels?.includes(label))).toBe(true)
    })
  }

  it('tags the docker datasource', () => {
    expect(allRules.some(([, rule]) => rule.matchDatasources?.length && rule.addLabels?.includes(Labels.DATASOURCE_DOCKER))).toBe(true)
  })

  it.each([Labels.RING_FAST, Labels.RING_SLOW])('tags %s', (label) => {
    expect(allRules.some(([, rule]) => rule.addLabels?.includes(label))).toBe(true)
  })
})
