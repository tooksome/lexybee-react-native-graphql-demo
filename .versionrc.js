
// Docs Here:
//    https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md

const StandardVersionConfig = {
  skip: {
    tag:    false,
    commit: false,
  },
  bumpFiles: [
    {
      filename: 'package.json',
    },
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo'),
    },
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo/android/code'),
    },
    {
      filename: 'app.json',
      updater: require.resolve('standard-version-expo/ios'),
    },
  ],
  types: [
    {type: "feat",     section: "Features"},
    {type: "fix",      section: "Bug Fixes"},
    {type: "perf",     section: "Performance"},
    {type: "chore",    hidden: true},
    {type: "docs",     hidden: true},
    {type: "style",    hidden: true},
    {type: "refactor", hidden: true},
    {type: "test",     hidden: true},
    {type: "meta",     hidden: false},
  ]
}


module.exports = StandardVersionConfig;
