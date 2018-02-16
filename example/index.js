var css = require('sheetify')
var choo = require('../')

css('todomvc-common/base.css')
css('todomvc-app-css/index.css')

var app = choo()
app.use(require('choo-devtools'))
app.use(require('./store'))
app.view(require('./view'))

if (module.parent) module.exports = app
else app.mount('body')
