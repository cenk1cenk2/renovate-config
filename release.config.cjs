module.exports = {
  extends: '@cenk1cenk2/semantic-release-config',
  plugins: [['@cenk1cenk2/semantic-release-config/presets/tag', { commit: false, changelog: false }], '@semantic-release/gitlab']
}
