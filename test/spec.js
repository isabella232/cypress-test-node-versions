const execaWrap = require('execa-wrap')

describe('Cypress caching', () => {
  it('runs in a few minutes', () =>
    execaWrap('npm', ['ci'])
    .then(console.log)
  )
})
