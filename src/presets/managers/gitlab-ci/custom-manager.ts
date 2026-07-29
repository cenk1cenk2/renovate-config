import { DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  customManagers: [
    {
      depTypeTemplate: DEP_TYPE_GITLAB_CI_MANAGER_GIT_MONOREPO,
      customType: 'regex',
      managerFilePatterns: ['/\\.gitlab-ci\\.ya?ml$/', '/\\.gitlab-ci\\..*\\.ya?ml$/'],
      matchStringsStrategy: 'any',
      matchStrings: [/project:\s+['"]?(?<packageName>[^'"\s]+)['"]?\s*ref:\s+['"]?(?<depName>[^@]+)@(?<currentValue>[^'"\s]+)['"]?/.source],
      registryUrlTemplate: 'https://gitlab.kilic.dev/',
      extractVersionTemplate: '^{{{depName}}}@(?<version>.*)$',
      datasourceTemplate: 'gitlab-tags',
      versioningTemplate: 'semver'
    }
  ]
})
