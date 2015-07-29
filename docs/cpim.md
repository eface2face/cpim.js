# cpim Module API

The top-level module exported by the library is a JavaScript object with the entries described below.


### `cpim.factory(data)`

Returns an instance of [Message](Message.md).

If given, `data` object may contain the following fields:

* `from` (String): Same data passed to [message.from(value)](Message.md#messagefromvalue).
* `to` (String): Same data passed to [message.to(value)](Message.md#messagetovalue).
* `contentType` (String): Same data passed to [message.contentType(value)](Message.md#messagecontenttypevalue).
* `dateTime` (Boolean): If `false` the message will not include a *DateTime* header with the current date.
* `body` (String): MIME body of the message.

```javascript
var message = cpim.factory({
    from: 'Alice <im:alice@atlanta.com>',
    to: 'Bob <im:bob@biloxi.com>',
    contentType: 'text/plain',
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
