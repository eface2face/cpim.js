/**
 * Expose the Message class.
 */
module.exports = Message;


/**
 * Dependencies.
 */
var
	debug = require('debug')('cpim:Message'),
	debugerror = require('debug')('cpim:ERROR:Message'),
	grammar = require('./grammar');


debugerror.log = console.warn.bind(console);


function Message() {
	debug('new()');

	this._cpimHeaders = {};
	this._mimeHeaders = {};
	this._body = null;
	this._nsUris = {};
}


Message.prototype.from = function (data) {
	// Get.
	if (!data && data !== null) {
		if (this._cpimHeaders.From) {
			return this._cpimHeaders.From[0];
		}
	// Set.
	} else if (data) {
		data.value = grammar.cpimHeaderRules.From.format(data);
		this._cpimHeaders.From = [data];
	// Delete.
	} else {
		delete this._cpimHeaders.From;
	}
};


Message.prototype.to = function (data) {
	// Get.
	if (!data && data !== null) {
		if (this._cpimHeaders.To) {
			return this._cpimHeaders.To[0];
		}
	// Set.
	} else if (data) {
		data.value = grammar.cpimHeaderRules.To.format(data);
		this._cpimHeaders.To = [data];
	// Delete.
	} else {
		delete this._cpimHeaders.To;
	}
};


Message.prototype.tos = function (datas) {
	// Get.
	if (!datas) {
		return this._cpimHeaders.To || [];
	// Set.
	} else {
		this._cpimHeaders.To = [];
		datas.forEach(function (data) {
			data.value = grammar.cpimHeaderRules.To.format(data);
			this._cpimHeaders.To.push(data);
		}, this);
	}
};


Message.prototype.cc = function (data) {
	// Get.
	if (!data && data !== null) {
		if (this._cpimHeaders.CC) {
			return this._cpimHeaders.CC[0];
		}
	// Set.
	} else if (data) {
		data.value = grammar.cpimHeaderRules.CC.format(data);
		this._cpimHeaders.CC = [data];
	// Delete.
	} else {
		delete this._cpimHeaders.CC;
	}
};


Message.prototype.ccs = function (datas) {
	// Get.
	if (!datas) {
		return this._cpimHeaders.CC || [];
	// Set.
	} else {
		this._cpimHeaders.CC = [];
		datas.forEach(function (data) {
			data.value = grammar.cpimHeaderRules.CC.format(data);
			this._cpimHeaders.CC.push(data);
		}, this);
	}
};


Message.prototype.subject = function (value) {
	// Get.
	if (!value && value !== null) {
		if (this._cpimHeaders.Subject) {
			return this._cpimHeaders.Subject[0].value;
		}
	// Set.
	} else if (value) {
		this._cpimHeaders.Subject = [{
			value: value
		}];
	// Delete.
	} else {
		delete this._cpimHeaders.Subject;
	}
};


Message.prototype.subjects = function (values) {
	// Get.
	if (!values) {
		if (this._cpimHeaders.Subject) {
			return this._cpimHeaders.Subject.map(function (data) {
				return data.value;
			});
		} else {
			return [];
		}
	// Set.
	} else {
		this._cpimHeaders.Subject = [];
		values.forEach(function (value) {
			this._cpimHeaders.Subject.push({value: value});
		}, this);
	}
};


Message.prototype.dateTime = function (date) {
	var data;

	// Get.
	if (!date && date !== null) {
		if (this._cpimHeaders.DateTime) {
			return this._cpimHeaders.DateTime[0].date;
		}
	// Set.
	} else if (date) {
		data = {
			date: date
		};
		data.value = grammar.cpimHeaderRules.DateTime.format(data);
		this._cpimHeaders.DateTime = [data];
	// Delete.
	} else {
		delete this._cpimHeaders.DateTime;
	}
};


Message.prototype.header = function (nsUri, name, value) {
	if (nsUri) {
		nsUri = nsUri.toLowerCase();
		name = nsUri + '@' + name;
	}

	// Get.
	if (!value && value !== null) {
		if (this._cpimHeaders[name]) {
			return this._cpimHeaders[name][0].value;
		}
	// Set.
	} else if (value) {
		this.addNS(nsUri);

		this._cpimHeaders[name] = [{
			value: value
		}];
	// Delete.
	} else {
		delete this._cpimHeaders[name];
	}
};


Message.prototype.headers = function (nsUri, name, values) {
	if (nsUri) {
		nsUri = nsUri.toLowerCase();
		name = nsUri + '@' + name;
	}

	// Get.
	if (!values) {
		if (this._cpimHeaders[name]) {
			return this._cpimHeaders[name].map(function (data) {
				return data.value;
			});
		} else {
			return [];
		}
	// Set.
	} else {
		this.addNS(nsUri);

		this._cpimHeaders[name] = [];
		values.forEach(function (value) {
			this._cpimHeaders[name].push({
				value: value
			});
		}, this);
	}
};


Message.prototype.contentType = function (data) {
	// Get.
	if (!data && data !== null) {
		return this._mimeHeaders['Content-Type'];
	// Set.
	} else if (data) {
		data.value = grammar.mimeHeaderRules['Content-Type'].format(data);
		this._mimeHeaders['Content-Type'] = data;
	// Delete.
	} else {
		delete this._mimeHeaders['Content-Type'];
	}
};


Message.prototype.contentId = function () {
	var args = Array.prototype.slice.call(arguments);

	args.unshift('Content-ID');
	return this.mimeHeader.apply(this, args);
};


Message.prototype.mimeHeader = function (name, value) {
	name = grammar.headerize(name);

	// Get.
	if (!value && value !== null) {
		if (this._mimeHeaders[name]) {
			return this._mimeHeaders[name].value;
		}
	// Set.
	} else if (value) {
		this._mimeHeaders[name] = {
			value: value
		};
	// Delete.
	} else {
		delete this._mimeHeaders[name];
	}
};


Message.prototype.body = function (body) {
	// Get.
	if (!body && body !== null) {
		return this._body;
	// Set.
	} else if (body) {
		this._body = body;
	// Delete.
	} else {
		delete this._body;
	}
};


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

	for (name in this._cpimHeaders) {
		if (this._cpimHeaders.hasOwnProperty(name)) {
			// Ignore NS headers.
			if (name === 'NS') {
				continue;
			}

			headers = this._cpimHeaders[name];

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

	// Then all the MIME headers.

	for (name in this._mimeHeaders) {
		if (this._mimeHeaders.hasOwnProperty(name)) {
			header = this._mimeHeaders[name];

			raw += name + ': ' + header.value + '\r\n';
		}
	}

	// Blank line.

	raw += '\r\n';

	// Body.

	raw += this._body;

	return raw;
};


Message.prototype.isValid = function () {
	if (!this.contentType()) {
		debugerror('isValid() | no MIME Content-Type header');
		return false;
	}

	return true;
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
