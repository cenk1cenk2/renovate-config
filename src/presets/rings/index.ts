// Ring slugs are manager-qualified because renovate derives the branch name from `groupSlug` — a shared
// slug collapses the go and node ring updates of a polyglot repository into a single merge request.
export enum Rings {
  NODE_FAST = 'node-fast-ring',
  NODE_FAST_DEV = 'node-fast-ring-dev',
  NODE_FAST_PEER = 'node-fast-ring-peer',
  NODE_SLOW = 'node-slow-ring',

  GO_FAST = 'go-fast-ring',
  GO_SLOW = 'go-slow-ring'
}
