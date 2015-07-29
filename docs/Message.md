# Message Class API

A `Message` instance represents a CPIM message (including CPIM headers, MIME headers and MIME body) as the [RFC 3862](http://tools.ietf.org/html/rfc3862) states.


## Constructor

```javascript
var message = new cpim.Message();
```


## Methods


### `message.from()`

Returns the CPIM *From* header as an object with these fields:

* `name` (String, optional): Display name.
* `uri` (String): URI.
* `value` (String): The full string value.

Returns `undefined` if there is no *From* header.

```javascript
message.from();

// => {name: 'Iñaki Baz Castillo', uri: 'im:inaki.baz@eface2face.com'}
```


### `message.from(value)`

Sets the CPIM *From* header with the given string.

If `value` is `null` the header is removed.

```javascript
message.from('Alice <im:alice@atlanta.com>');
message.from('<im:alice@atlanta.com>');
```


### `message.to()`

Returns the first CPIM *To* header as an object with these fields:

* `name` (String, optional): Display name.
* `uri` (String): URI.
* `value` (String): The full string value.

Returns `undefined` if there is no *To* header.


### `message.to(value)`

Sets the CPIM *To* header with the given string.

If `value` is `null` the header is removed.


### `message.tos()`

Returns an array with all the CPIM *To* headers. Each entry in the array is an object with these fields:

* `name` (String, optional): Display name.
* `uri` (String): URI.
* `value` (String): The full string value.

Returns an empty array if there is no *To* header.


### `message.tos(values)`

Sets the CPIM *To* headers (multiple values). Given `values` must be an array of strings.

```javascript
message.tos([
    'Alice Ω∑© <im:alice@atlanta.com>',
    'Bob å∫∂ <im:bob@biloxi.com>',
    '<im:carol@carolina.org>'
]);
```


### `message.cc()`

Returns the first CPIM *CC* header as an object with these fields:

* `name` (String, optional): Display name.
* `uri` (String): URI.
* `value` (String): The full string value.

Returns `undefined` if there is no *CC* header.


### `message.cc(value)`

Sets the CPIM *To* header with the given string.

If `value` is `null` the header is removed.


### `message.ccs()`

Returns an array with all the CPIM *CC* headers. Each entry in the array is an object with these fields:

* `name` (String, optional): Display name.
* `uri` (String): URI.
* `value` (String): The full string value.

Returns an empty array if there is no *CC* header.


### `message.ccs(values)`

Sets the CPIM *CC* headers (multiple values). Given `values` must be an array of strings.


### `message.subject()`

Returns the first CPIM *Subject* header as a string.

Returns `undefined` if there is no *Subject* header.

```javascript
message.subject();

// => "Party invitation"
```


### `message.subject(value)`

Sets the CPIM *Subject* header. Given `value` must be a string.

If `value` is `null` the header is removed.

```javascript
message.subject('Party with drinks at home!');
```


### `message.subjects()`

Returns an array with all the CPIM *Subject* headers. Each entry in the array is a string.

Returns an empty array if there is no *Subject* header.


### `message.subjects(values)`

Sets the CPIM *Subject* headers (multiple values). Given `values` must be an array of strings.


### `message.dateTime()`

Returns a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) instance representing the value of the first CPIM *DateTime* header.

Returns `undefined` if there is no *DateTime* header.

```javascript
message.dateTime();

// => Date instance
```


### `message.dateTime(date)`

Sets the CPIM *DateTime* header. Given `date` must be an instance of [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

If `date` is `null` the header is removed.

*NOTE:* For outgoing messages the library automatically appends the *DateTime* header if the given message does not already contain it.

```javascript
var now = new Date(Date.now());

message.dateTime(now);
```


### `message.header(nsUri, name)`

> Headers others that those defined in [RFC 3862](http://tools.ietf.org/html/rfc3862) must carry a prefix perviously defined within a *NS* header (see [RFC 3862 section 3.4](http://tools.ietf.org/html/rfc3862#section-3.4).

This method returns the first CPIM header value (string) mathing the given `nsUri` (*NS URI*string) and header `name` (string).

Returns `undefined` if there is such a header.

```javascript
message.header('urn:ietf:params:imdn', 'Message-ID');

// => "34jk324j"
```


### `message.header(nsUri, name, value)`

Sets the CPIM header with the given `nsUri` (*NS URI* string), header `name` (string) and header `value` (string).

If `value` is `null` the header is removed.

```javascript
message.header('urn:ietf:params:imdn', 'Message-ID', '1234j67asd');
```


### `message.headers(nsUri, name)`

Returns an array with all the CPIM headers mathing the given `nsUri` (*NS URI* string) and header `name` (string). Each entry in the array must be a string.

Returns an empty array if there is no such a header.

```javascript
message.headers('urn:local.test', 'Foo');

// => ["foo1", "foo2"]
```



### `message.headers(nsUri, name, values)`

Sets the CPIM *Subject* headers (multiple values) mathing the given `nsUri` (*NS URI* string) and header `name` (string). Given `values` must be an array of strings.

```javascript
message.headers('urn:local.test', 'Bar', ['bar1', 'bar2']);
```


### `message.contentType()`

Returns the MIME *Content-Type* header as an object with these fields:

* `type` (String): Type.
* `subtype` (String): Subtype.
* `params` (Object): Param/value pairs.

Returns `undefined` if there is no *Content-Type* header.

```javascript
message.contentType();

// => {type: 'text', subtype: 'plain', params: {charset: 'utf-16'}}
```


### `message.contentType(value)`

Sets the MIME *Content-Type* header with the given string.

If `value` is `null` the header is removed.

```javascript
message.contentType('text/html;charset=utf-8');
message.contentType('text/plain  ; charset = utf-16');
```


### `message.mimeHeader()`

Returns the MIME header value (string) mathing the given header `name` (string).

Returns `undefined` if there is such a header.

```javascript
message.mimeHeader('Content-ID');

// => "<kjhsd7kjasd@test.local>"
```


### `message.mimeHeader(name, value)`

Sets the MIME header with the given header `name` (string) and header `value` (string).

If `value` is `null` the header is removed.

```javascript
message.mimeHeader('Content-ID', '<1234@foo.com>');
```


### `message.body()`

Returns the MIME body of the message as a string (or `undefined` if there is no body).


### `message.body(body)`

Sets the MIME body of the message to the given `body` (string).

If `body` is `null` the body is removed.


### `message.toString()`

Serializes the message into a single string suitable for being sent to the remote peer.

```javascript
myWebSocket.send(message.toString());
```


### `message.isValid()`

Returns `true` if the current message is valid according to the specification rules (for example it MUST contain, at least, the 'Content-Type' MIME header).
