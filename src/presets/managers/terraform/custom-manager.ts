import { DEP_TYPE_TERRAFORM_MANAGER_MONOREPO } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  customManagers: [
    {
      depTypeTemplate: DEP_TYPE_TERRAFORM_MANAGER_MONOREPO,
      customType: 'regex',
      managerFilePatterns: ['/\\.tf$/'],
      matchStringsStrategy: 'any',
      matchStrings: [
        // source = "git::git@gitlab.kilic.dev:terraform/tf-modules.git//reloader?ref=reloader@1.0.6"
        /"git::git@(?<registryUrl>[^:]+):(?<packageName>[^.]+)(\.git)?\/\/.*\?ref=(?<depName>.+)@(?<currentValue>[^"]+)"/.source
        // source = "git::git@gitlab.kilic.dev:terraform/tf-modules.git//reloader"
        // /"git::git@(?<registryUrl>[^:]+):(?<packageName>[^.]+)(\.git)?\/\/(?<depName>[^?"]+)"/.source
      ],
      extractVersionTemplate: '^{{{depName}}}@(?<version>.*)$',
      registryUrlTemplate: 'https://{{{registryUrl}}}',
      datasourceTemplate: 'gitlab-tags',
      versioningTemplate: 'semver'
    }
  ]
})
