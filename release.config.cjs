module.exports = {
  extends: '@cenk1cenk2/semantic-release-config',
  plugins: [
    [
      '@cenk1cenk2/semantic-release-config/presets/npm',
      { publish: 'staged', client: 'pnpm', assets: { extend: ['default.json'] } }
    ],
    '@semantic-release/gitlab'
  ]
}
