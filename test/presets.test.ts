import { getOptions } from 'renovate/dist/config/options/index.js'
import type { PackageRule, RenovateConfig } from 'renovate/dist/config/types.js'
import { describe, expect, it } from 'vitest'

import { Labels, SCHEDULE, SCOPE } from '@constants'
import { Groups } from '@groups'
import { NODE_BUILD_PACKAGES, NODE_DOCS_PACKAGES, PACKAGE_MANAGERS } from '@presets/groups/node/groups.js'
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

      // `automerge` is in the predicate so the policy checks below cannot be dodged by a rule that
      // carries no labels and no group at all.
      if ('labels' in record || 'addLabels' in record || 'groupSlug' in record || 'automerge' in record) {
        found.push(record as PackageRule)
      }

      Object.values(record).forEach(walk)
    }
  }

  walk(preset)

  return found
}

// Two views: every labelled object anywhere in a preset, and just the declared `packageRules`.
const allRules = entries.flatMap(([name, preset]) => rules(preset).map((rule) => [name, rule] as const))
const allPackageRules = entries.flatMap(([name, preset]) => (preset.packageRules ?? []).map((rule) => [name, rule] as const))

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

  // Two rules can each be well-formed and still stack two values of one axis onto the same dependency,
  // because `addLabels` accumulates. The dep groups are the case where that actually overlaps.
  it('keeps the dep axis mutually exclusive', () => {
    const claimed = [...NODE_BUILD_PACKAGES, ...NODE_DOCS_PACKAGES, ...PACKAGE_MANAGERS]
    const catchAll = allPackageRules.find(([, rule]) => rule.groupSlug === Groups.NODE_DEV)?.[1]

    expect(catchAll, 'the node dev catch-all should exist').toBeDefined()

    for (const name of claimed) {
      expect(catchAll.matchPackageNames, `dev catch-all must exclude ${name}, which another dep group claims`).toContain(`!${name}`)
    }
  })

  it('never adds an area from a datasource rule', () => {
    const offenders = allRules.filter(([, rule]) => rule.matchDatasources && !rule.matchManagers && rule.addLabels?.some((label) => label.startsWith('area:'))).map(([name]) => name)

    expect(offenders, 'a datasource spans many managers, so it cannot know the area').toEqual([])
  })
})

describe('automerge policy', () => {
  const BREAKING: string[] = ['major', 'replacement']

  it('never automerges a breaking update', () => {
    const offenders = allRules
      .filter(([, rule]) => rule.automerge === true && rule.matchUpdateTypes?.some((updateType) => BREAKING.includes(updateType)))
      .map(([name, rule]) => `${name}:${rule.groupSlug ?? '?'}`)

    expect(offenders, 'a major or replacement update is a breaking change and must be merged by a human').toEqual([])
  })

  it('never leaves a breaking update unbounded by an update-type matcher', () => {
    // `lock-file` is exempt: lockFileMaintenance is its own update type and never carries a version bump.
    const offenders = allRules.filter(([name, rule]) => name !== Preset.LOCK_FILE && rule.automerge === true && !rule.matchUpdateTypes).map(([name, rule]) => `${name}:${rule.groupSlug ?? '?'}`)

    expect(offenders, 'an automerge rule without matchUpdateTypes also catches major updates').toEqual([])
  })
})

// The whole taxonomy rests on renovate's mergeability flags. A renovate bump that flipped one of these
// would silently invalidate the design, so pin them here rather than trusting the docs.
describe('renovate merge model', () => {
  const options = new Map(getOptions().map((option) => [option.name, option]))

  it('accumulates addLabels', () => {
    expect(options.get('addLabels')?.mergeable).toBe(true)
  })

  it.each(['labels', 'schedule', 'automerge', 'groupSlug', 'enabled'])('does not merge %s', (name) => {
    expect(options.get(name)?.mergeable).toBeFalsy()
  })
})

describe('rule validity', () => {
  it('never combines matchUpdateTypes with a pre-lookup option', () => {
    // renovate rejects all of these outright — they are resolved before the update type is known.
    // Mirrors `preLookupOptions` in renovate/dist/config/validation.js.
    const PRE_LOOKUP = [
      'allowedVersions',
      'extractVersion',
      'followTag',
      'ignoreDeps',
      'ignoreUnstable',
      'rangeStrategy',
      'registryUrls',
      'respectLatest',
      'rollbackPrs',
      'separateMajorMinor',
      'separateMinorPatch',
      'separateMultipleMajor',
      'separateMultipleMinor',
      'versioning'
    ] as const

    const offenders = allPackageRules.flatMap(([name, rule]) => (rule.matchUpdateTypes ? PRE_LOOKUP.filter((option) => rule[option] !== undefined).map((option) => `${name}.${option}`) : []))

    expect(offenders).toEqual([])
  })

  it('never writes an empty matcher array', () => {
    const matchers = ['matchManagers', 'matchUpdateTypes', 'matchDepTypes', 'matchPackageNames', 'matchDatasources', 'matchSourceUrls', 'matchDepNames'] as const
    const offenders = allPackageRules.flatMap(([name, rule]) => matchers.filter((matcher) => Array.isArray(rule[matcher]) && rule[matcher].length === 0).map((matcher) => `${name}.${matcher}`))

    expect(offenders, 'an empty matcher array matches nothing and silently disables the rule').toEqual([])
  })

  it('gives every rule at least one matcher', () => {
    const offenders = allPackageRules.filter(([, rule]) => !Object.keys(rule).some((key) => key.startsWith('match'))).map(([name]) => name)

    expect(offenders, 'a rule with no matcher applies to every dependency in every consuming repository').toEqual([])
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

  it('gives every slug exactly one name', () => {
    const names = new Map<string, Set<string>>()

    for (const [, rule] of allRules) {
      if (rule.groupSlug && rule.groupName) {
        names.set(rule.groupSlug, (names.get(rule.groupSlug) ?? new Set()).add(rule.groupName))
      }
    }

    expect([...names].filter(([, set]) => set.size > 1).map(([slug]) => slug), 'one slug is one merge request, so two names for it is a copy-paste divergence').toEqual([])
  })

  it('always pairs a slug with a name', () => {
    expect(allPackageRules.filter(([, rule]) => rule.groupSlug && !rule.groupName).map(([name]) => name)).toEqual([])
  })

  it('uses every slug the enums declare', () => {
    const used = new Set(allRules.map(([, rule]) => rule.groupSlug))

    expect([...known].filter((slug) => !used.has(slug)), 'orphan slug in an enum').toEqual([])
  })
})

// Multi-directory managers resolve one dependency per package file, so a rule that disambiguates the
// branch must also disambiguate the commit message, and vice versa — half of Pattern M is a bug.
describe('pattern M', () => {
  const multiDirectory = allPackageRules.filter(([, rule]) => rule.additionalBranchPrefix ?? rule.commitMessageExtra)

  it('is applied to some rules', () => {
    expect(multiDirectory.length).toBeGreaterThan(0)
  })

  it('always pairs the branch prefix with the commit message extra', () => {
    expect(multiDirectory.filter(([, rule]) => !(rule.additionalBranchPrefix && rule.commitMessageExtra)).map(([name]) => name)).toEqual([])
  })

  it('scopes both to the package file directory', () => {
    for (const [name, rule] of multiDirectory) {
      expect(rule.additionalBranchPrefix, name).toContain('{{packageFileDir}}')
      expect(rule.commitMessageExtra, name).toContain('{{packageFileDir}}')
    }
  })

  it('uses feat for minor and perf for major', () => {
    for (const [name, rule] of multiDirectory) {
      const expected = rule.matchUpdateTypes?.includes('major') ? 'perf' : 'feat'

      expect(rule.extends, name).toEqual([`:semanticCommitTypeAll(${expected})`])
    }
  })
})

describe('schedule', () => {
  it('never sets a schedule at the top level of a preset', () => {
    // A top-level schedule is non-mergeable and global — the last extended preset that sets one wins
    // for every dependency, not just that preset's own rules.
    expect(entries.filter(([, preset]) => preset.schedule).map(([name]) => name)).toEqual([])
  })

  it('only uses schedules from the enum', () => {
    const known = new Set<string>(Object.values(SCHEDULE))
    const used = allPackageRules.flatMap(([, rule]) => rule.schedule ?? [])

    expect([...new Set(used)].filter((schedule) => !known.has(schedule))).toEqual([])
  })
})

describe('wiring', () => {
  const scoped = (preset: RenovateConfig): Preset[] => (preset.extends ?? []).filter((entry) => entry.startsWith(SCOPE)).map((entry) => entry.slice(SCOPE.length) as Preset)

  // Consumer-facing presets are extended by the repositories that use them, not from inside this repo.
  const ENTRYPOINTS: Preset[] = [Preset.DEFAULT, Preset.NO_TESTS, Preset.BRANCH_DEVELOP, Preset.BRANCH_BETA]

  it('references every preset it emits', () => {
    const referenced = new Set(entries.flatMap(([, preset]) => scoped(preset)))
    const orphans = Object.values(Preset).filter((name) => !ENTRYPOINTS.includes(name) && !referenced.has(name))

    expect(orphans, 'these presets are written into default.json but nothing extends them').toEqual([])
  })

  it('only references presets that exist', () => {
    const dangling = entries.flatMap(([name, preset]) => scoped(preset).filter((target) => !(target in presets)).map((target) => `${name} -> ${target}`))

    expect(dangling).toEqual([])
  })

  it('enables every manager it writes rules for', () => {
    const enabled = new Set(presets[Preset.DEFAULT].enabledManagers)
    const matched = new Set(allPackageRules.flatMap(([, rule]) => rule.matchManagers ?? []))

    expect([...matched].filter((manager) => !enabled.has(manager)), 'a rule matches a manager that default.ts never enables, so it can never fire').toEqual([])
  })

  it('only matches managers from the enum', () => {
    const known = new Set<string>(Object.values(Managers))
    const used = new Set(allPackageRules.flatMap(([, rule]) => rule.matchManagers ?? []))

    expect([...used].filter((manager) => !known.has(manager))).toEqual([])
  })

  it('only matches custom dep types that a custom manager emits', () => {
    const emitted = new Set(entries.flatMap(([, preset]) => (preset.customManagers ?? []).map((manager) => manager.depTypeTemplate).filter(Boolean)))
    const regexRules = allPackageRules.filter(([, rule]) => rule.matchManagers?.includes(Managers.REGEX))

    for (const [name, rule] of regexRules) {
      for (const depType of rule.matchDepTypes ?? []) {
        expect(emitted, `${name} matches custom depType ${depType}`).toContain(depType)
      }
    }
  })

  it('scopes every custom manager rule by dep type', () => {
    // custom.regex is shared by the terraform and gitlab-ci custom managers, so an unscoped rule
    // would apply one manager's config to the other's dependencies.
    expect(allPackageRules.filter(([, rule]) => rule.matchManagers?.includes(Managers.REGEX) && !rule.matchDepTypes).map(([name]) => name)).toEqual([])
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
