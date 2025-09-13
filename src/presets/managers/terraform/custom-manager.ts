import { createPreset } from '@lib'

export const DEP_TYPE_TERRAFORM_MANAGER_MONOREPO = 'terraform-manager-git-monorepo'

export default createPreset({
  customManagers: [
    {
      depTypeTemplate: DEP_TYPE_TERRAFORM_MANAGER_MONOREPO,
      customType: 'regex',
      managerFilePatterns: ['/\\.tf$/'],
      matchStringsStrategy: 'any',
      matchStrings: [
        // source = "git::git@gitlab.kilic.dev:terraform/tf-modules.git//reloader?ref=reloader@1.0.6"
        /"git::git@(?<registryUrl>[^:]+):(?<packageName>[^.]+)(\.git)?\/\/.*\?ref=(?<depName>.+)@(?<currentValue>[^"]+)"/.source,
        // source = "git::git@gitlab.kilic.dev:terraform/tf-modules.git//reloader"
        /"git::git@(?<registryUrl>[^:]+):(?<packageName>[^.]+)(\.git)?\/\/(?<depName>[^?"]+)"/.source
      ],
      autoReplaceStringTemplate: '"git::git@{{{ replace registryUrl \'https://\' \'\' }}}:{{{ packageName }}}.git//{{{ depName }}}?ref={{{ depName }}}@{{{ newValue }}}"',
      extractVersionTemplate: '^{{{depName}}}@(?<version>.*)$',
      currentValueTemplate: '{{#if currentValue }}{{{ currentValue }}}{{else}}0.0.0{{/if}}',
      registryUrlTemplate: 'https://{{{registryUrl}}}',
      datasourceTemplate: 'gitlab-tags',
      versioningTemplate: 'semver'
    }
  ]
})
