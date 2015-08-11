# cpim Module API

The top-level module exported by the library is a JavaScript object with the entries described below.


### `cpim.factory(data)`

Returns an instance of [Message](Message.md).

If given, `data` object may contain the following fields:

* `from` (String): Same data passed to [message.from(value)](Message.md#messagefromvalue).
* `to` (String): Same data passed to [message.to(value)](Message.md#messagetovalue).
* `dateTime` (Boolean): If `false` the message will not include a *DateTime* header with the current date.
* `mime` ([mimemessage.Entity](https://github.com/eface2face/mimemessage.js/blob/master/docs/Entity.md)): MIME component of the CPIM message.

```javascript
var cpim = require('cpim');

var mime = cpim.mimemessage.factory({
    contentType: 'text/plain',
    body: 'HELLO'
});

var message = cpim.factory({
    from: 'Alice <im:alice@atlanta.com>',
    to: 'Bob <im:bob@biloxi.com>',
    mime: mime
});
```

*Note:* Further modifications can be done to the message returned by the `factory()` call by means of the [Message](Message.md) API.


### `cpim.parse(raw)`

Parses the given raw CPIM message. If valid an instance of [Message](Message.md) is returned, `false` otherwise.

* `raw` (String): A raw CPIM message.

```javascript
myWebSocket.onmessage = function (event) {
    var
        raw = event.data,
        message = cpim.parse(raw);

    if (message) {
        console.log('CPIM message received: %s', message);
    } else {
        console.error('invalid CPIM message received: "%s"', raw);
    }
});
```


### `cpim.Message`

The [Message](Message.md) class. Useful to check `instanceof cpim.Message`.


### `cpim.mimemessage`

Reference to the [mimemessage](https://github.com/eface2face/mimemessage.js/) library. Useful to build MIME messages via `mimemessage.factory()`.
