/**
 * Expose the Message class.
 */
module.exports = Message;


/**
 * Dependencies.
 */
var
	debug = require('debug')('cpim:Session');
// debugerror = require('debug')('cpim:ERROR:Session'),


// debugerror.log = console.warn.bind(console);


function Message() {
	debug('new()');

	this._headers = {};
	this._body = null;
}


Object.defineProperties(Message.prototype, {
	headers: {
		get: function () {
			return this._headers;
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
