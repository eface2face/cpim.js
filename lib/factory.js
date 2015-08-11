/**
 * Expose the factory function.
 */
module.exports = factory;

var
	/**
	 * Dependencies.
	 */
	debug = require('debug')('cpim:factory'),
	debugerror = require('debug')('cpim:ERROR:factory'),
	Message = require('./Message');

debugerror.log = console.warn.bind(console);


function factory(data) {
	debug('factory() | [data:%o]', data);

	var message = new Message();

	data = data || {};

	// Add From if given.
	if (data.from) {
		message.from(data.from);
	}

	// Add To if given.
	if (data.to) {
		message.to(data.to);
	}

	// Add DateTime unless explicitly not requested.
	if (data.dateTime !== false) {
		message.dateTime(new Date(Date.now()));
	}

	// Add body.
	if (data.mime) {
		message.mime = data.mime;
	}

	return message;
}
