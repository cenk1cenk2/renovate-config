import { Managers } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  packageRules: [
    {
      enabled: true,
      matchManagers: [Managers.KUBERNETES],
      managerFilePatterns: [
        '/^\\.deploy\\/**\\/*\\.ya?ml$/'
        // '/^!\\.deploy\\/**\\/kustomization\\.ya?ml$/',
        // '/^!\\.deploy\\/**\\/templates\\//',
        // '/^!\\.deploy\\/**\\/files\\//',
        // '/^!\\.deploy\\/**\\/values\\//',
        // '/^!\\.deploy\\/**\\/values\\.ya?ml$/',
        // '/^!\\.deploy\\/**\\/chart\\.ya?ml$/'
      ]
    }
  ]
})
