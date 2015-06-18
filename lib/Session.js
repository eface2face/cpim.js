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
	EventEmitter = require('events').EventEmitter;


debugerror.log = console.warn.bind(console);


function Session(data) {
	debug('new() | [data:%o]', data);

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
 * Private API.
 */


// function emit() {
// 	if (arguments.length === 1) {
// 		debug('emit "%s"', arguments[0]);
// 	} else {
// 		debug('emit "%s" [arg:%o]', arguments[0], arguments[1]);
// 	}

// 	try {
// 		this.emit.apply(this, arguments);
// 	} catch (error) {
// 		debugerror('emit() | error running an event handler for "%s" event: %o', arguments[0], error);
// 	}
// }
