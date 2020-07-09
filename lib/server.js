var assert = require('assert')

var Choo = require('./browser')

Choo.prototype.toString = function (state) {
  this.state = Object.assign({}, this.state, state || {})

  assert.notEqual(typeof window, 'object', 'choo.mount: window was found. .toString() must be called in Node, use .start() or .mount() if running in the browser')
  assert.equal(typeof this.state, 'object', 'choo.toString: state should be type object')

  var self = this

  this._setCache(state)
  this._stores.forEach(function (initStore) {
    initStore()
  })

  var html = self._viewHandler(self.state, function (eventName, data) {
    self.emitter.emit.apply(self.emitter, arguments)
  })
  assert.ok(html, 'choo.toString: no valid value returned for the view')
  assert(!Array.isArray(html), 'choo.toString: return value was an array for the view')
  return typeof html.outerHTML === 'string' ? html.outerHTML : html.toString()
}

module.exports = Choo
