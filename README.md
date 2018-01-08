<h1 align="center">nanochoo</h1>

<div align="center">
  ½🚂🚋🚋🚋🚋
</div>
<div align="center">
  <strong><a href='https://github.com/choojs/choo'>choo</a> but half the size</strong>
</div>
<div align="center">
  A <code>2kb</code> framework for creating sturdy frontend applications on a diet
</div>

<br />

<div align="center">
  <sub>Fork of <a href='https://github.com/choojs/choo'>choo</a>. Built with ❤︎ by
  <a href="https://twitter.com/yoshuawuyts">Yoshua Wuyts</a> and
  <a href="https://github.com/heyitsmeuralex/nanochoo/graphs/contributors">
    contributors
  </a>
</div>

#### with npm

```
> npm install nanochoo
```

#### with <script>

```html
<script src='//unpkg.com/nanochoo/dist/bundle.min.js'></script>
```

Major and minor version numbers equate to choo's: `choo@^7.0 == nanochoo@^7.0`. Patch
numbers don't!

## Key differences

* `choo/html` removed - use [bel](https://unpkg.com/bel) (`npm install bel`) directly
* Removed router:
  * `choo()` no longer takes an `opts` argument
  * `choo.route(location, handler)` replaced by `choo.view(handler)`
  * `pushState`, `popState`, `replaceState`, `navigate` events removed
  * nanorouter, nanohref, scroll-to-anchor, nanolocation no longer dependencies
* document-ready no longer a dependency
* `choo.toString` not exported in the browser

See [choo](https://github.com/choojs/choo) for documentation - just ignore
routing-related things, use `choo.view` over `choo.route`, and you'll be fine.

## Example
```js
var html = require('bel')
var choo = require('choo')

var app = choo()
app.use(countStore)
app.view(mainView) // !!!
app.mount('body')

function mainView (state, emit) {
  return html`
    <body>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Increment</button>
    </body>
  `

  function onclick () {
    emit('increment', 1)
  }
}

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
  })
}
```

## License
[MIT](https://tldrlegal.com/license/mit-license). See [choo](https://github.com/choojs/choo)
