/**
 * Expose the Message class.
 */
module.exports = Message;


/**
 * Dependencies.
 */
var
	debug = require('debug')('cpim:Message'),
	grammar = require('./grammar');


function Message() {
	debug('new()');

	this._headers = {};
	this._mimeHeaders = {};
	this._body = null;
}


Object.defineProperties(Message.prototype, {
	body: {
		get: function () {
			return this._body;
		}
	}
});


Message.prototype.from = function () {
	if (this._headers.From) {
		return this._headers.From[0];
	}
};


Message.prototype.to = function (all) {
	if (!all) {
		if (this._headers.To) {
			return this._headers.To[0];
		}
	} else {
		return this._headers.To || [];
	}
};


Message.prototype.cc = function (all) {
	if (!all) {
		if (this._headers.CC) {
			return this._headers.CC[0];
		}
	} else {
		return this._headers.CC || [];
	}
};


Message.prototype.dateTime = function () {
	if (this._headers.DateTime) {
		return this._headers.DateTime[0].date;
	}
};


Message.prototype.subject = function (all) {
	if (!all) {
		if (this._headers.Subject) {
			return this._headers.Subject[0].value;
		}
	} else {
		if (this._headers.Subject) {
			return this._headers.Subject.map(function (header) {
				return header.value;
			});
		} else {
			return [];
		}
	}
};


Message.prototype.header = function (prefix, name) {
	if (prefix) {
		name = prefix + '.' + name;
	}

	if (this._headers[name]) {
		return this._headers[name][0].value;
	}
};


Message.prototype.headers = function (prefix, name) {
	if (prefix) {
		name = prefix + '.' + name;
	}

	if (this._headers[name]) {
		return this._headers[name].map(function (header) {
			return header.value;
		});
	} else {
		return [];
	}
};


Message.prototype.contentType = function () {
	return this._mimeHeaders['Content-Type'];
};


Message.prototype.contentId = function () {
	if (this._mimeHeaders['Content-ID']) {
		return this._mimeHeaders['Content-ID'].value;
	}
};


Message.prototype.mimeHeader = function (name) {
	name = grammar.headerize(name);

	if (this._mimeHeaders[name]) {
		return this._mimeHeaders[name].value;
	}
};
