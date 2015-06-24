# Session Class API

A session represents a flow of CPIM messages between two peers, the local one and the remote one.

A peer may be an intermediary box sending/forwarding messages in behalf of other peers, so a session is not tied to specific identities. In other words: a session represents a channel from which remote CPIM messages are received and where locally generated CPIM messages are sent to remote recipients.

A `Session` instance is usually associated to a "network channel" (such as an already established *WebSocket*, *RTCDataChannel*, a [MSRP](https://tools.ietf.org/html/rfc4975) session, etc). It is up to the application/user to manage such a relationship between both entities.

A `Session` does not send messages over the Internet by itself, nor it receives messages. Instead the application must provide the `Session` with messages received from the remote peer, and must tell the `Session` about  outgoing messages. The `Session` will then emit events to notify the application about the receipt of a CPIM message or the need of sending a message to the remote peer.


## Constructor

```javascript
var session = new cpim.Session(data);
```

The constructor accepts the following argument:

* `data` (Object, optional): Session data.

If given, `data` object may contain the following fields:

* `from` (Object): Same data passed to [message.from(data)](Message.md#messagefromdata). Outgoing messages will have this *From* header if no *From* header is present in them.
* `to` (Object): Same data passed to [message.to(data)](Message.md#messagetodata). Outgoing messages will have this *To* header if no *To* header is present in them.
* `contentType` (Object): Same data passed to [message.contentType(data)](Message.md#messagecontenttypedata). Outgoing messages will have this *Content-Type* MIME header if no *Content-Type* header is present in them.

*Example:*

```javascript
var session = new cpim.Session({
    from: {name: 'Alice', uri: 'im:alice@atlanta.com'},
    to: {name: 'Bob', uri: 'im:bob@biloxi.com'}
});
```


## Methods


### `session.receive(raw)`

The application must call this method whenever a raw CPIM message is received from the remote peer.

If the provided raw message is valid the `Session` will emit a *received* event.

* `raw` (String): The received CPIM raw message.

The method returns `true` if the given raw message is valid, `false` otherwise.


### `session.send(message)`

The application must call this method whenever it wants to send a CPIM message to the remote peer.

If the provided message is valid the `Session` will emit a *send* event.

* `message` ([Message](Message.md)): The message to be sent.

The method returns `true` if the given message is valid, `false` otherwise.


## Events

The `Session` class inherits from the Node [EventEmitter](https://nodejs.org/api/events.html#events_class_events_eventemitter) class. The list of emitted events is described below.


### `session.on('received', callback(message))` 

Emitted after calling `receive()` with a received raw message.

The given callback function is called with a instance of [Message](Message.md) representing the received message.


### `session.on('send', callback(message))` 

Emitted after calling `send()` and in other cases in which the library internally decides that a message must be sent to the remote peer.

The given callback function is called with a instance of [Message](Message.md) representing the message to be sent.
