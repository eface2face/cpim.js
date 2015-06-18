/**
 * Expose the Message class.
 */
module.exports = Message;


/**
 * Dependencies.
 */
var
	debug = require('debug')('cpim:Message');
// debugerror = require('debug')('cpim:ERROR:Message'),


// debugerror.log = console.warn.bind(console);


function Message() {
	debug('new()');

	this._headers = {};
	this._mimeHeaders = {};
	this._body = null;
}


Object.defineProperties(Message.prototype, {
	headers: {
		get: function () {
			return this._headers;
		}
	},
	mimeHeaders: {
		get: function () {
			return this._mimeHeaders;
		}
	},
	body: {
		get: function () {
			return this._body;
		},
		set: function (value) {
			this._body = value;
		}
	}
});
