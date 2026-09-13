import { createPreset, createScopes } from '@lib'
import { Preset } from '@presets'

// `config:recommended`, reached through `base`, extends `:ignoreModulesAndTests`, whose `ignorePaths` skip
// every `test`, `tests` and `__tests__` directory. `ignorePresets` drops that preset wherever it is nested,
// but only below the preset that declares it, so this one wraps `default` rather than sitting beside it:
// a repository extends it instead of `default/default`, never alongside. Beside `default`, the ignore list
// would already be resolved, and re-extending `config:recommended` would replay its `packageRules` after
// every central rule. `ignorePaths` falls back to renovate's own default, which still skips
// `node_modules` and `bower_components` but no longer `vendor`, `examples` or `__fixtures__`.
export default createPreset({
  extends: createScopes(Preset.DEFAULT),
  ignorePresets: [':ignoreModulesAndTests']
})
