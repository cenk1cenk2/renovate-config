import { matchRegexOrGlobList } from 'renovate/dist/util/string-match.js'
import { describe, expect, it } from 'vitest'

import { Managers } from '@managers'
import gitlabCi from '@presets/managers/gitlab-ci/manager.js'

describe.each([Managers.GITLAB_CI, Managers.GITLAB_CI_INCLUDE])('%s file patterns', (name) => {
  const patterns = (gitlabCi as Record<string, { managerFilePatterns: string[] }>)[name].managerFilePatterns

  // `managerFilePatterns` is matched against the path relative to the repository root, so suffixed files
  // pulled in through `trigger: include` have to match at any depth.
  it.each(['.gitlab-ci.yml', '.gitlab-ci.yaml', '.gitlab-ci.app.yml', '.gitlab-ci.pipe.yaml', 'sub/dir/.gitlab-ci.bootstrap.yml'])('matches %s', (path) => {
    expect(matchRegexOrGlobList(path, patterns)).toBe(true)
  })

  it.each(['.gitlab-ci.app.yml.j2', 'gitlab-ci.yml', '.gitlab-ci.app.json', '.gitlab-ci/app.yml'])('does not match %s', (path) => {
    expect(matchRegexOrGlobList(path, patterns)).toBe(false)
  })
})
