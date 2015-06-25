# cpim.js

JavaScript implementation of CPIM "Common Presence and Instant Messaging" ([RFC 3862](https://tools.ietf.org/html/rfc3862)).

Suitable for parsing and generating CPIM messages, allowing access to CPIM headers, MIME headers and MIME body of messages such as:

```
From: Iñaki Baz Castillo <im:inaki.baz@eface2face.com>
To: Alice <sip:alice@atlanta.com>
Subject: Wines tonight!
DateTime: 2015-06-25T11:30:00-08:00

Content-type: text/plain; charset=utf-8

Hi Alice, tonight wines at home
```


## Installation

### **npm**:

```bash
$ npm install cpim --save
```

And then:

```javascript
var cpim = require('cpim');
```


## Browserified library

Take the browserified version of the library at `dist/cpim.js`. It exposes the global `window.cpim` module.

```html
<script type='text/javascript' src='js/cpim.js'></script>
```


## Documentation

You can read the full [API documentation](docs/index.md) in the *docs* folder.


### Debugging

The library includes the Node [debug](https://github.com/visionmedia/debug) module. In order to enable debugging:

In Node set the `DEBUG=cpim*` environment variable before running the application, or set it at the top of the script:

```javascript
process.env.DEBUG = 'cpim*';
```

In the browser run `cpim.debug.enable('cpim*');` and reload the page. Note that the debugging settings are stored into the browser LocalStorage. To disable it run `cpim.debug.disable('cpim*');`.


## Author

Iñaki Baz Castillo at [eFace2Face, inc.](https://eface2face.com)


## License

[MIT](./LICENSE) :)
