const projects = [
  'cli',
  'core'
]

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/**/src/main/**/*'
  ],
  testFailureExitCode: 1,
  projects: projects.map(name => `<rootDir>/packages/${name}/`),
}
