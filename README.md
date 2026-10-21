# @cenk1cenk2/renovate-config

## Group selected dependencies

Extend `group(<name>)` inside each native `packageRules` object, after the central presets. Each object supplies its own manager or datasource scope and package matchers; independently matched objects using the same name share one group across managers, datasources and directories.

```json
{
  "extends": ["local>renovate/renovate-config:default/default"],
  "packageRules": [
    {
      "matchManagers": ["helmv3", "kustomize"],
      "matchPackageNames": ["vertical-pod-autoscaler"],
      "extends": ["local>renovate/renovate-config:default/group(vpa)"]
    },
    {
      "matchDatasources": ["docker"],
      "matchPackageNames": ["registry.k8s.io/autoscaling/vpa-recommender"],
      "extends": ["local>renovate/renovate-config:default/group(vpa)"]
    }
  ]
}
```

Use a distinct, branch-safe name for each group. Native matchers (including exclusions and `matchFileNames`) remain available on each object. Do not extend this preset at repository level: it deliberately contains no matchers and would group everything. It clears inherited directory/unit branch prefixes and directory-specific group titles; place these rules after any `group-by-unit` preset.

Grouping does not grant automerge, enable dependencies, change schedules, semantic commit types or update policy. Existing major separation remains in effect (`renovate/vpa` and `renovate/major-vpa` with Renovate defaults). A mixed group automerges only if every included update already permits it.

[![pipeline status](https://gitlab.kilic.dev/renovate/renovate-config/badges/master/pipeline.svg)](https://gitlab.kilic.dev/renovate/renovate-config/-/commits/master) [![Version](https://img.shields.io/npm/v/@cenk1cenk2/renovate-config.svg)](https://npmjs.org/package/@cenk1cenk2/renovate-config) [![Downloads/week](https://img.shields.io/npm/dw/@cenk1cenk2/renovate-config.svg)](https://npmjs.org/package/@cenk1cenk2/renovate-config) [![Dependencies](https://img.shields.io/librariesio/release/npm/@cenk1cenk2/renovate-config)](https://npmjs.org/package/@cenk1cenk2/renovate-config) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
