module.exports = {
  platform: 'github',
  gitAuthor: 'renovate-bot <renovate@kilic.dev>',
  enabledManagers: [ 'github-actions', 'ansible', 'ansible-galaxy', 'docker-compose', 'dockerfile', 'droneci', 'git-submodules', 'gomod', 'kubernetes', 'npm', 'nvm' ],
  logLevel: 'debug',
  masterIssueTitle: 'Update Dependencies (renovate-bot)',
  onboarding: true,
  repositories: [
    'cenk1cenk2/boilerplate-oclif'
  ]
};