var nanomorph = require('nanomorph')
var nanoraf = require('nanoraf')
var nanobus = require('nanobus')
var assert = require('assert')
var Cache = require('../component/cache')

function documentReady (f) {
  if (document.readyState === 'complete' || document.readyState === 'interactive') f()
  else document.addEventListener('DOMContentLoaded', f)
}

module.exports = Choo

function Choo (opts) {
  if (!(this instanceof Choo)) return new Choo(opts)
  opts = opts || {}

  var self = this

  // define events used by choo
  this._events = {
    DOMCONTENTLOADED: 'DOMContentLoaded',
    DOMTITLECHANGE: 'DOMTitleChange',
    RENDER: 'render'
  }

  // properties for internal use only
  this._hasWindow = typeof window !== 'undefined'
  this._cache = opts.cache
  this._loaded = false
  this._stores = []
  this._tree = null
  this._viewHandler = null

  var _state = {
    events: this._events,
    components: {}
  }

  // properties that are part of the API
  this.emitter = nanobus('choo.emit')
  this.emit = this.emitter.emit.bind(this.emitter)

  if (this._hasWindow) {
    this.state = window.initialState
      ? Object.assign({}, window.initialState, _state)
      : _state
    delete window.initialState
  } else {
    this.state = _state
  }

  // listen for title changes; available even when calling .toString()
  if (this._hasWindow) this.state.title = document.title
  this.emitter.prependListener(this._events.DOMTITLECHANGE, function (title) {
    assert.equal(typeof title, 'string', 'events.DOMTitleChange: title should be type string')
    self.state.title = title
    if (self._hasWindow) document.title = title
  })
}

Choo.prototype.view = function (handler) {
  assert.equal(typeof handler, 'function', 'choo.view: handler should be type function')
  this._viewHandler = handler
}

Choo.prototype.use = function (cb) {
  assert.equal(typeof cb, 'function', 'choo.use: cb should be type function')
  var self = this
  this._stores.push(function () {
    cb(self.state, self.emitter, self)
  })
}

Choo.prototype.start = function () {
  assert.equal(typeof window, 'object', 'choo.start: window was not found. .start() must be called in a browser, use .toString() if running in Node')
  assert.equal(typeof this._viewHandler, 'function', 'choo.start: view handler was not found. try calling choo.view')

  var self = this

  this._setCache(this.state)
  this._stores.forEach(function (initStore) {
    initStore()
  })

  function render () {
    return self._viewHandler(self.state, function (eventName, data) {
      self.emitter.emit.apply(self.emitter, arguments)
    })
  }

  this._tree = render()
  assert.ok(this._tree, 'choo.start: no valid DOM node returned')

  this.emitter.prependListener(self._events.RENDER, nanoraf(function () {
    var newTree = render()
    assert.ok(newTree, 'choo.render: no valid DOM node returned')

    assert.equal(self._tree.nodeName, newTree.nodeName, 'choo.render: The target node <' +
      self._tree.nodeName.toLowerCase() + '> is not the same type as the new node <' +
      newTree.nodeName.toLowerCase() + '>.')

    nanomorph(self._tree, newTree)
  }))

  documentReady(function () {
    self.emitter.emit(self._events.DOMCONTENTLOADED)
    self._loaded = true
  })

  return this._tree
}

Choo.prototype.mount = function mount (selector) {
  if (typeof window !== 'object') {
    assert.ok(typeof selector === 'string', 'choo.mount: selector should be type String')
    this.selector = selector
    return this
  }

  assert.ok(typeof selector === 'string' || typeof selector === 'object', 'choo.mount: selector should be type String or HTMLElement')

  var self = this

  documentReady(function () {
    var newTree = self.start()
    if (typeof selector === 'string') {
      self._tree = document.querySelector(selector)
    } else {
      self._tree = selector
    }

    assert.ok(self._tree, 'choo.mount: could not query selector: ' + selector)
    assert.equal(self._tree.nodeName, newTree.nodeName, 'choo.mount: The target node <' +
      self._tree.nodeName.toLowerCase() + '> is not the same type as the new node <' +
      newTree.nodeName.toLowerCase() + '>.')

    nanomorph(self._tree, newTree)
  })
}

Choo.prototype._setCache = function (state) {
  var cache = new Cache(state, this.emitter.emit.bind(this.emitter), this._cache)
  state.cache = renderComponent

  function renderComponent (Component, id) {
    assert.equal(typeof Component, 'function', 'choo.state.cache: Component should be type function')
    var args = []
    for (var i = 0, len = arguments.length; i < len; i++) {
      args.push(arguments[i])
    }
    return cache.render.apply(cache, args)
  }

  // When the state gets stringified, make sure `state.cache` isn't
  // stringified too.
  renderComponent.toJSON = function () {
    return null
  }
}
