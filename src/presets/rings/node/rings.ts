export const NODE_FAST_RING_PACKAGES = ['^@cenk1cenk2/', 'listr2', '^@cenk1cenk2-.*/', '^@kilic.dev/']

export const NODE_SLOW_RING_PACKAGES = [
  '^@typescript-eslint/',
  'jest',
  '@types/jest',
  '^@types/node$',
  '^eslint$',
  '^husky$',
  '^prettier$',
  '^lint-staged$',
  '^cz-conventional-changelog$',
  '^simple-git-hooks$'
]

export const NODE_DISABLED_PACKAGES = ['node']

export const NODE_DISABLED_ENGINES = ['node', 'npm', 'pnpm', 'yarn']
