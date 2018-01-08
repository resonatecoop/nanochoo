var tape = require('tape')

var html = require('bel')
var raw = require('bel/raw')
var choo = require('./')

tape('should render on the server', function (t) {
  var app = choo()
  app.view(function (state, emit) {
    var strong = '<strong>Hello filthy planet</strong>'
    return html`
      <p>${raw(strong)}</p>
    `
  })
  var res = app.toString()
  var exp = '<p><strong>Hello filthy planet</strong></p>'
  t.equal(res.toString().trim(), exp, 'result was OK')
  t.end()
})
