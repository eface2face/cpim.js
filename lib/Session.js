/**
 * Expose the Session class.
 */
module.exports = Session;


/**
 * Dependencies.
 */
var
	debug = require('debug')('cpim:Session'),
	debugerror = require('debug')('cpim:ERROR:Session'),
	EventEmitter = require('events').EventEmitter,
	Message = require('./Message'),
	parse = require('./parse');


debugerror.log = console.warn.bind(console);


function Session(data) {
	debug('new() | [data:%o]', data);

	this.data = data || {};

	// Inherit from EventEmitter.
	EventEmitter.call(this);
}


// Inherit from EventEmitter.
Session.prototype = Object.create(EventEmitter.prototype, {
	constructor: {
		value: Session,
		enumerable: false,
		writable: true,
		configurable: true
	}
});


/**
 * Provide the session with a received raw CPIM message.
 */
Session.prototype.receive = function (raw) {
	debug('receive()');

	var message = parse(raw);

	if (message) {
		emit.call(this, 'received', message);

		return true;
	} else {
		debugerror('receive() | invalid message [raw:%s]', raw);

		return false;
	}
};


/**
 * Provide the session with a message to be sent.
 */
Session.prototype.send = function (message) {
	debug('send()');

	if (!(message instanceof Message)) {
		throw new Error('message must be a Message instance');
	}

	// Add From if not set.
	if (this.data.from && !message.from()) {
		message.from(this.data.from);
	}

	// Add To if not set.
	if (this.data.to && !message.to()) {
		message.to(this.data.to);
	}

	// Add Content-Type if not set.
	if (this.data.contentType && !message.contentType()) {
		message.contentType(this.data.contentType);
	}

	// Add DateTime if not set.
	if (!message.dateTime()) {
		message.dateTime(new Date(Date.now()));
	}

	// Check the whole message.
	if (!message.isValid()) {
		throw new Error('given Message is invalid');
	}

	emit.call(this, 'send', message);
};


/**
 * Private API.
 */


function emit() {
	if (arguments.length === 1) {
		debug('emit "%s"', arguments[0]);
	} else {
		debug('emit "%s" [arg:%o]', arguments[0], arguments[1]);
	}

	try {
		this.emit.apply(this, arguments);
	} catch (error) {
		debugerror('emit() | error running an event handler for "%s" event: %o', arguments[0], error);
	}
}
