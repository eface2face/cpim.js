/**
 * Expose the Message class.
 */
module.exports = Message;

var
	/**
	 * Dependencies.
	 */
	debug = require('debug')('cpim:Message'),
	debugerror = require('debug')('cpim:ERROR:Message'),
	mimemessage = require('mimemessage'),
	grammar = require('./grammar'),
	parseHeaderValue = require('./parse').parseHeaderValue;

debugerror.log = console.warn.bind(console);


function Message() {
	debug('new()');

	this._headers = {};
	this._body = null;
	this._nsUris = {};
}


Message.prototype.from = function (value) {
	// Get.
	if (!value && value !== null) {
		if (this._headers.From) {
			return this._headers.From[0];
		}
	// Set.
	} else if (value) {
		this._headers.From = [
			parseHeaderValue(grammar.headerRules.From, value)
		];
	// Delete.
	} else {
		delete this._headers.From;
	}
};


Message.prototype.to = function (value) {
	// Get.
	if (!value && value !== null) {
		if (this._headers.To) {
			return this._headers.To[0];
		}
	// Set.
	} else if (value) {
		this._headers.To = [
			parseHeaderValue(grammar.headerRules.To, value)
		];
	// Delete.
	} else {
		delete this._headers.To;
	}
};


Message.prototype.tos = function (values) {
	// Get.
	if (!values) {
		return this._headers.To || [];
	// Set.
	} else {
		this._headers.To = [];
		values.forEach(function (value) {
			this._headers.To.push(
				parseHeaderValue(grammar.headerRules.To, value)
			);
		}, this);
	}
};


Message.prototype.cc = function (value) {
	// Get.
	if (!value && value !== null) {
		if (this._headers.CC) {
			return this._headers.CC[0];
		}
	// Set.
	} else if (value) {
		this._headers.CC = [
			parseHeaderValue(grammar.headerRules.CC, value)
		];
	// Delete.
	} else {
		delete this._headers.CC;
	}
};


Message.prototype.ccs = function (values) {
	// Get.
	if (!values) {
		return this._headers.CC || [];
	// Set.
	} else {
		this._headers.CC = [];
		values.forEach(function (value) {
			this._headers.CC.push(
				parseHeaderValue(grammar.headerRules.CC, value)
			);
		}, this);
	}
};


Message.prototype.subject = function (value) {
	// Get.
	if (!value && value !== null) {
		if (this._headers.Subject) {
			return this._headers.Subject[0].value;
		}
	// Set.
	} else if (value) {
		this._headers.Subject = [{
			value: value
		}];
	// Delete.
	} else {
		delete this._headers.Subject;
	}
};


Message.prototype.subjects = function (values) {
	// Get.
	if (!values) {
		if (this._headers.Subject) {
			return this._headers.Subject.map(function (data) {
				return data.value;
			});
		} else {
			return [];
		}
	// Set.
	} else {
		this._headers.Subject = [];
		values.forEach(function (value) {
			this._headers.Subject.push({value: value});
		}, this);
	}
};


Message.prototype.dateTime = function (date) {
	// Get.
	if (!date && date !== null) {
		if (this._headers.DateTime) {
			return this._headers.DateTime[0].date;
		}
	// Set.
	} else if (date) {
		this._headers.DateTime = [
			parseHeaderValue(grammar.headerRules.DateTime, date)
		];
	// Delete.
	} else {
		delete this._headers.DateTime;
	}
};


Message.prototype.header = function (nsUri, name, value) {
	if (nsUri) {
		nsUri = nsUri.toLowerCase();
		name = nsUri + '@' + name;
	}

	// Get.
	if (!value && value !== null) {
		if (this._headers[name]) {
			return this._headers[name][0].value;
		}
	// Set.
	} else if (value) {
		this.addNS(nsUri);

		this._headers[name] = [{
			value: value
		}];
	// Delete.
	} else {
		delete this._headers[name];
	}
};


Message.prototype.headers = function (nsUri, name, values) {
	if (nsUri) {
		nsUri = nsUri.toLowerCase();
		name = nsUri + '@' + name;
	}

	// Get.
	if (!values) {
		if (this._headers[name]) {
			return this._headers[name].map(function (data) {
				return data.value;
			});
		} else {
			return [];
		}
	// Set.
	} else {
		this.addNS(nsUri);

		this._headers[name] = [];
		values.forEach(function (value) {
			this._headers[name].push({
				value: value
			});
		}, this);
	}
};


Object.defineProperty(Message.prototype, 'mime', {
	get: function () {
		return this._mime;
	},
	set: function (mime) {
		if (mime) {
			if (mime instanceof mimemessage.Entity) {
				this._mime = mime;
			} else {
				throw new TypeError('mime property must be an instance of mimemessage.Entity');
			}
		} else {
			delete this._mime;
		}
	}
});


Message.prototype.toString = function () {
	var
		raw = '',
		i, len,
		uri, name, splitted,
		headers, header;

	// First print CPIM NS headers.

	for (uri in this._nsUris) {
		if (this._nsUris.hasOwnProperty(uri)) {
			raw += 'NS: ' + this._nsUris[uri] + ' <' + uri + '>\r\n';
		}
	}

	// Then all the other CPIM headers.

	for (name in this._headers) {
		if (this._headers.hasOwnProperty(name)) {
			// Ignore NS headers.
			if (name === 'NS') {
				continue;
			}

			headers = this._headers[name];

			// Split prefixed headers.
			if (name.indexOf('@') !== -1) {
				splitted = name.split('@');
				uri = splitted[0];
				name = splitted[1];
			} else {
				uri = undefined;
			}

			for (i = 0, len = headers.length; i < len; i++) {
				header = headers[i];

				if (uri) {
					raw += this._nsUris[uri] + '.' + name + ': ' + header.value + '\r\n';
				} else {
					raw += name + ': ' + header.value + '\r\n';
				}
			}
		}
	}

	// Blank line.

	raw += '\r\n';

	// Then the MIME message.

	if (this._mime) {
		raw += this._mime.toString();
	}

	return raw;
};


/**
 * Private API.
 */


Message.prototype.addNS = function (uri) {
	var prefix;

	if (typeof uri !== 'string' || !uri) {
		throw new Error('argument must be a non empty String');
	}

	if (this._nsUris[uri] || uri === grammar.NS_PREFIX_CORE) {
		return;
	}

	prefix = 'Prefix' + (Object.keys(this._nsUris).length + 1);
	this._nsUris[uri] = prefix;
};
