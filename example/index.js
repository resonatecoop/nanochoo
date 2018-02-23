var css = require('sheetify')
var choo = require('../')

css('todomvc-common/base.css')
css('todomvc-app-css/index.css')

var app = choo()
app.use(require('choo-devtools'))
app.use(require('./store'))
app.view(require('./view'))

module.exports = app.mount('body')
