/**
 * Expose the parse function and some util funtions within it.
 */
module.exports = parse;
parse.parseMimeHeaderValue = parseMimeHeaderValue;
parse.parseCpimHeaderValue = parseCpimHeaderValue;

var
	/**
	 * Dependencies.
	 */
	debug = require('debug')('cpim:parse'),
	debugerror = require('debug')('cpim:ERROR:parse'),
	grammar = require('./grammar'),
	Message = require('./Message'),

	/**
 	 * Constants.
 	 */
	REGEXP_VALID_HEADER = /^(([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)\.)?([a-zA-Z0-9!#$%&'+,\-\^_`|~]+):[^ ]* (.+)$/,
	REGEXP_VALID_MIME_HEADER = /^([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)[ \t]*:[ \t]*(.+)$/;  // TODO: RFC 2045

debugerror.log = console.warn.bind(console);


function parse(raw) {
	debug('parse()');

	var
		headersEnd,
		mimeHeadersEnd,
		rawHeaders,
		rawMimeHeaders,
		rawBody,
		message;

	if (typeof raw !== 'string') {
		throw new Error('given data must be a string');
	}

	headersEnd = raw.indexOf('\r\n\r\n');
	if (headersEnd === -1) {
		debugerror('wrong headers');
		return false;
	}
	rawHeaders = raw.slice(0, headersEnd);

	mimeHeadersEnd = raw.indexOf('\r\n\r\n', headersEnd + 1);
	rawMimeHeaders = raw.slice(headersEnd + 4, mimeHeadersEnd);

	if (mimeHeadersEnd !== -1) {
		rawBody = raw.slice(mimeHeadersEnd + 4);
	}

	// Init the Message instance.
	message = new Message();

	// Parse CPIM headers.
	if (!parseCpimHeaders(rawHeaders)) {
		return false;
	}

	// Parse MIME headers.
	if (!parseMimeHeaders(rawMimeHeaders)) {
		return false;
	}

	// Get body.
	if (rawBody) {
		message._body = rawBody;
	}

	return message;


	function parseCpimHeaders(rawHeaders) {
		var
			lines = rawHeaders.split('\r\n'),
			i, len,
			currentDefaultNSUri,
			ns = {};  // key: prefix, value: uri.

		for (i = 0, len = lines.length; i < len; i++) {
			if (!parseCpimHeader(lines[i])) {
				debugerror('discarding message due to invalid header: "%s"', lines[i]);
				return false;
			}
		}

		return true;


		function parseCpimHeader(line) {
			var
				match = line.match(REGEXP_VALID_HEADER),
				prefix, name, value, nsUri, rule, data;

			if (!match) {
				debugerror('invalid header "%s"', line);
				return false;
			}

			prefix = match[2];
			name = match[3];
			value = match[4];

			if (prefix) {
				nsUri = ns[prefix];

				if (!ns[prefix]) {
					debugerror('non declared prefix in line "%s"', line);
					return false;
				}
			// Don't apply defualt prefix if header is a NS.
			} else if (currentDefaultNSUri && name !== 'NS') {
				nsUri = currentDefaultNSUri;
			}

			// Ignore prefixes to the CORE NS URI ('urn:ietf:params:cpim-headers:').
			if (nsUri === grammar.NS_PREFIX_CORE) {
				nsUri = undefined;
			}

			// Complete the header name with its prefix URI.
			if (nsUri) {
				name = nsUri + '@' + name;
			}

			if (message._cpimHeaders[name] && grammar.isSingleCpimHeader(name)) {
				debugerror('"%s" header can only appear once', name);
				return false;
			}

			rule = grammar.cpimHeaderRules[name] || grammar.unknownCpimHeaderRule;

			try {
				data = parseMimeHeaderValue(rule, value);
			}	catch (error) {
				debugerror('wrong header: "%s"', line);
				return false;
			}

			// Special treatment for NS headers.
			if (name === 'NS') {
				if (data.prefix) {
					ns[data.prefix] = data.uri.toLowerCase();
				} else {
					currentDefaultNSUri = data.uri.toLowerCase();
				}

				message.addNS(data.uri.toLowerCase());
			}

			(message._cpimHeaders[name] = message._cpimHeaders[name] || []).push(data);
			return true;
		}
	}

	function parseMimeHeaders(rawMimeHeaders) {
		var
			lines = rawMimeHeaders.split('\r\n'),
			i, len;

		for (i = 0, len = lines.length; i < len; i++) {
			if (!parseMimeHeader(lines[i])) {
				debugerror('discarding message due to invalid MIME header: "%s"', lines[i]);
				return false;
			}
		}

		return true;


		function parseMimeHeader(line) {
			var
				match = line.match(REGEXP_VALID_MIME_HEADER),
				name, value, rule, data;

			if (!match) {
				debugerror('invalid MIME header "%s"', line);
				return false;
			}

			name = grammar.headerize(match[1]);
			value = match[2];

			rule = grammar.mimeHeaderRules[name] || grammar.unknownMimeHeaderRule;

			try {
				data = parseMimeHeaderValue(rule, value);
			}	catch (error) {
				debugerror('wrong MIME header: "%s"', line);
				return false;
			}

			message._mimeHeaders[name] = data;
			return true;
		}
	}
}


function parseMimeHeaderValue(rule, value) {
	var
		parsedValue,
		i, len,
		data = {};

	if (typeof rule.reg !== 'function') {
		parsedValue = value.match(rule.reg);
		if (!parsedValue) {
			throw new Error('parseMimeHeader() failed for ' + value);
		}

		for (i = 0, len = rule.names.length; i < len; i++) {
			if (parsedValue[i + 1] !== undefined) {
				data[rule.names[i]] = parsedValue[i + 1];
			}
		}
	} else {
		data = rule.reg(value);
		if (!data) {
			throw new Error('parseMimeHeader() failed for ' + value);
		}
	}

	data.value = value;

	return data;
}


function parseCpimHeaderValue(rule, value) {
	var
		parsedValue,
		i, len,
		data = {};

	if (typeof rule.reg !== 'function') {
		parsedValue = value.match(rule.reg);
		if (!parsedValue) {
			throw new Error('parseCpimHeader() failed for ' + value);
		}

		for (i = 0, len = rule.names.length; i < len; i++) {
			if (parsedValue[i + 1] !== undefined) {
				data[rule.names[i]] = parsedValue[i + 1];
			}
		}
	} else {
		data = rule.reg(value);
		if (!data) {
			throw new Error('parseCpimHeader() failed for ' + value);
		}
	}

	data.value = value;

	return data;
}
