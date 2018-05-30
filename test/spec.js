const execaWrap = require('execa-wrap')
const cachedir = require('cachedir')

const cacheFolder = cachedir('Cypress')
console.log('Cache folder', cacheFolder)

// imagine "npm ci" ran
// blow away ~/.cache
// then first test installs Cypress (takes a while)
// then second test does not have to download Cypress
// so the second test is much faster.

describe('Cypress caching', () => {
  before(() => {
    return execaWrap('rm', ['-rf', cacheFolder]).then(console.log)
  })

  const installCypress = () => {
    const started = new Date()
    return execaWrap('npm', ['install', 'cypress'])
    .then(console.log)
    .then(() => {
      const ended = new Date()
      return ended - started
    })
  }

  let installTook = 0

  it('runs first time in a few minutes', () => {
    return installCypress()
      .then((took) => {
        installTook = took
        console.log('install took %d ms', installTook)
      })
  })

  it('runs second time in a few seconds', () => {
    return installCypress()
      .then((took) => {
        console.log('install took %d ms', took)
        console.assert(took < 0.5 * installTook, 'took too long')
      })
  })
})
