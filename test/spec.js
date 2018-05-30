const execaWrap = require('execa-wrap')
const cachedir = require('cachedir')
const la = require('lazy-ass')

const cacheFolder = cachedir('Cypress')
console.log('Cache folder', cacheFolder)

// imagine "npm ci" ran
// blow away ~/.cache
// then first test installs Cypress (takes a while)
// then second test does not have to download Cypress
// so the second test is much faster.

describe('Cypress caching', () => {
  before(() => {
    return execaWrap('rm', ['-rf', cacheFolder])
      .then((() => console.log('deleted cache folder %s', cacheFolder)))
  })

  const installCypress = () =>
    execaWrap('npm', ['run', 'conditional-install'])

  const nothingToInstallMessage = 'nothing to install'
  const downloadingMessage = 'Downloading Cypress'

  it('runs first time in a few minutes', () => {
    return installCypress()
      .then((output) => {
        if (output.includes(nothingToInstallMessage)) {
          console.log('there was nothing to install')
        } else {
          console.log('first test installed Cypress')
          la(output.includes(downloadingMessage),
            'expected to find downloading ... in the output\n', output)
        }
      })
  })

  it('runs second time in a few seconds', () => {
    return installCypress()
      .then((output) => {
        if (output.includes(nothingToInstallMessage)) {
          console.log('there was nothing to install')
        } else {
          console.log('second test installed Cypress')
          la(!output.includes(downloadingMessage),
            'found downloading ... in the output the second time around\n', output)
        }
      })
  })
})
