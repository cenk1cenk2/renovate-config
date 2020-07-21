module.exports = {
  extends: [ 'config:base', ':masterIssue', ':semanticPrefixFix' ],
  ignorePresets: [ ':prHourlyLimit2' ],
  timezone: 'Europe/Vienna',
  lockFileMaintenance: {
    enabled: true
  },
  major: {
    stabilityDays: 3
  },
  prCreation: 'not-pending',
  packageRules: [
    {
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      automerge: true
    },
    {
      depTypeList: [ 'devDependencies' ],
      automerge: true
    }
  ]
}
