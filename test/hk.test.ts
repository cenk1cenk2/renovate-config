import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { GlobalConfig } from 'renovate/dist/config/global.js'
import { extractPackageFile } from 'renovate/dist/modules/manager/custom/regex/index.js'
import { matchRegexOrGlobList } from 'renovate/dist/util/string-match.js'
import { doAutoReplace } from 'renovate/dist/workers/repository/update/branch/auto-replace.js'
import { beforeAll, describe, expect, it } from 'vitest'

import { Managers } from '@managers'
import { DEP_TYPE_HK_PKL_SCHEMA } from '@presets/managers/hk/manager.js'
import hk from '@presets/managers/hk/manager.js'

const PACKAGE_FILE = 'hk.pkl'
const CURRENT_VERSION = '2.0.1'
const NEW_VERSION = '2.1.0'

// The file hk itself generates: the schema is pinned twice on every line, once in the release path and
// once in the package fragment.
const CONTENT = [
  `amends "package://github.com/jdx/hk/releases/download/v${CURRENT_VERSION}/hk@${CURRENT_VERSION}#/Config.pkl"`,
  `import "package://github.com/jdx/hk/releases/download/v${CURRENT_VERSION}/hk@${CURRENT_VERSION}#/Builtins.pkl"`,
  '',
  'hooks {',
  '  ["pre-commit"] {',
  '    fix = true',
  '  }',
  '}',
  ''
].join('\n')

const manager = hk.customManagers[0]

describe('hk pkl schema manager', () => {
  it('is a regex manager emitting its own dep type', () => {
    expect(hk.customManagers).toHaveLength(1)
    expect(manager.customType).toBe('regex')
    expect(manager.depTypeTemplate).toBe(DEP_TYPE_HK_PKL_SCHEMA)
    expect(hk.enabledManagers).toEqual([Managers.REGEX])
  })

  // `managerFilePatterns` is matched against the path relative to the repository root, so a pattern
  // anchored to the file name alone would miss a subproject's own `hk.pkl`.
  it.each(['hk.pkl', 'packages/api/hk.pkl', 'a/b/c/hk.pkl'])('matches %s', (path) => {
    expect(matchRegexOrGlobList(path, manager.managerFilePatterns)).toBe(true)
  })

  it.each(['hk.pkl.j2', 'nothk.pkl', 'hk.pkl/config.pkl', 'mise.toml'])('does not match %s', (path) => {
    expect(matchRegexOrGlobList(path, manager.managerFilePatterns)).toBe(false)
  })

  describe('extraction', () => {
    const extracted = extractPackageFile(CONTENT, PACKAGE_FILE, manager)

    // Two lines, two pins each: renovate rewrites a custom-manager dependency through the exact string it
    // matched, so every occurrence has to come back as its own dependency or it is left behind.
    it('extracts every pinned occurrence', () => {
      expect(extracted.deps).toHaveLength(4)
    })

    it('resolves each occurrence to the hk release', () => {
      for (const dep of extracted.deps) {
        expect(dep.depName).toBe('hk')
        expect(dep.packageName).toBe('jdx/hk')
        expect(dep.datasource).toBe('github-releases')
        expect(dep.depType).toBe(DEP_TYPE_HK_PKL_SCHEMA)
      }
    })

    // The path segment carries the tag's `v` and the package fragment does not, so both are captured
    // bare and `extractVersion` strips the prefix off the tag instead.
    it('extracts the bare version from both the path and the fragment', () => {
      expect(extracted.deps.map((dep) => dep.currentValue)).toEqual([CURRENT_VERSION, CURRENT_VERSION, CURRENT_VERSION, CURRENT_VERSION])
      expect(extracted.deps.filter((dep) => dep.replaceString.includes(`download/v${CURRENT_VERSION}/`))).toHaveLength(2)
      expect(extracted.deps.filter((dep) => dep.replaceString.includes(`hk@${CURRENT_VERSION}#`))).toHaveLength(2)
    })

    it('strips the tag prefix off the datasource version', () => {
      for (const dep of extracted.deps) {
        expect(new RegExp(dep.extractVersion).exec(`v${NEW_VERSION}`)?.groups?.version).toBe(NEW_VERSION)
      }
    })
  })

  // `getUpdatedPackageFiles` walks the branch's upgrades in order, handing each one the content the
  // previous upgrade produced (`dist/workers/repository/update/branch/get-updated.js`), and
  // `flatten.js` numbers the deps it extracted as `depIndex`. Replayed here over renovate's own
  // `doAutoReplace`, which is what proves the duplicated pins all move rather than only the first.
  describe('replacement', () => {
    let updated: string

    beforeAll(async () => {
      const localDir = await mkdtemp(join(tmpdir(), 'hk-pkl-'))

      await writeFile(join(localDir, PACKAGE_FILE), CONTENT)
      GlobalConfig.set({ localDir })

      const upgrades = extractPackageFile(CONTENT, PACKAGE_FILE, manager).deps.map((dep, depIndex) => ({
        ...manager,
        ...dep,
        depIndex,
        // `custom.regex` is the name the configuration uses; renovate registers the manager itself under
        // the bare `regex` (`dist/modules/manager/custom/api.js`), and that is what an upgrade carries.
        manager: 'regex',
        packageFile: PACKAGE_FILE,
        newValue: NEW_VERSION
      }))

      updated = CONTENT

      let firstUpdate = true

      for (const upgrade of upgrades) {
        updated = await doAutoReplace(upgrade, updated, false, firstUpdate)
        firstUpdate = false
      }
    }, 60_000)

    it('leaves no occurrence of the old version behind', () => {
      expect(updated).not.toContain(CURRENT_VERSION)
    })

    it('bumps both pins on both lines', () => {
      expect(updated).toContain(`amends "package://github.com/jdx/hk/releases/download/v${NEW_VERSION}/hk@${NEW_VERSION}#/Config.pkl"`)
      expect(updated).toContain(`import "package://github.com/jdx/hk/releases/download/v${NEW_VERSION}/hk@${NEW_VERSION}#/Builtins.pkl"`)
    })

    it('changes nothing else', () => {
      expect(updated).toBe(CONTENT.replaceAll(CURRENT_VERSION, NEW_VERSION))
    })
  })
})
