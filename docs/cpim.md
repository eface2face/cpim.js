# cpim Module API

The top-level module exported by the library is a JavaScript object with the entries described below.


### `cpim.factory(data)`

Returns an instance of [Message](Message.md).

If given, `data` object may contain the following fields:

* `from` (Object): Same data passed to [message.from(data)](Message.md#messagefromdata).
* `to` (Object): Same data passed to [message.to(data)](Message.md#messagetodata).
* `contentType` (Object): Same data passed to [message.contentType(data)](Message.md#messagecontenttypedata).
* `dateTime` (Boolean): If `false` the message will not include a *DateTime* header with the current date.
* `body` (String): MIME body of the message.

```javascript
var message = cpim.factory({
    from: {name: 'Alice', uri: 'im:alice@atlanta.com'},
    to: {name: 'Bob', uri: 'im:bob@biloxi.com'},
    contentType: {type: 'text', subtype: 'plain'},
    body: 'HELLO'
});
```

*Note:* Further modifications can be done to the message returned by the `factory()` call by means of the [Message](Message.md) API.


### `cpim.parse(raw)`

Parses the given raw CPIM message. If valid an instance of [Message](Message.md) is returned, `false` otherwise.

* `raw` (String): A CPIM message.

```javascript
myWebSocket.onmessage = function (event) {
    var
        raw = event.data,
        message = cpim.parse(raw);

    if (message) {
        console.log('CPIM message received: %o', message);
    } else {
        console.error('invalid CPIM message received: "%s"', raw);
    }
});
```


### `cpim.Message`

The [Message](Message.md) class. Useful to check `instanceof cpim.Message`.
