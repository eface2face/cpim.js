/**
 * Expose the parse function and some util funtions within it.
 */
module.exports = parse;
parse.parseHeaderValue = parseHeaderValue;

var
	/**
	 * Dependencies.
	 */
	debug = require('debug')('cpim:parse'),
	debugerror = require('debug')('cpim:ERROR:parse'),
	mimemessage = require('mimemessage'),
	grammar = require('./grammar'),
	Message = require('./Message'),

	/**
 	 * Constants.
 	 */
	REGEXP_VALID_HEADER = /^(([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)\.)?([a-zA-Z0-9!#$%&'+,\-\^_`|~]+):[^ ]* (.+)$/;

debugerror.log = console.warn.bind(console);


function parse(raw) {
	debug('parse()');

	var
		headersEnd,
		rawHeaders,
		rawMime,
		mime,
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
	rawMime = raw.slice(headersEnd + 4);

	// Init the Message instance.
	message = new Message();

	// Parse CPIM headers.
	if (!parseHeaders(rawHeaders)) {
		return false;
	}

	// Parse MIME message.
	mime = mimemessage.parse(rawMime);
	if (!mime) {
		debugerror('wrong MIME message');
		return false;
	}

	message._mime = mime;

	return message;


	function parseHeaders(rawHeaders) {
		var
			lines = rawHeaders.split('\r\n'),
			i, len,
			currentDefaultNSUri,
			ns = {};  // key: prefix, value: uri.

		for (i = 0, len = lines.length; i < len; i++) {
			if (!parseHeader(lines[i])) {
				debugerror('discarding message due to invalid header: "%s"', lines[i]);
				return false;
			}
		}

		return true;


		function parseHeader(line) {
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

			if (message._headers[name] && grammar.isSingleHeader(name)) {
				debugerror('"%s" header can only appear once', name);
				return false;
			}

			rule = grammar.headerRules[name] || grammar.unknownHeaderRule;

			try {
				data = parseHeaderValue(rule, value);
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

			(message._headers[name] = message._headers[name] || []).push(data);
			return true;
		}
	}
}


function parseHeaderValue(rule, value) {
	var
		parsedValue,
		i, len,
		data = {};

	if (typeof rule.reg !== 'function') {
		parsedValue = value.match(rule.reg);
		if (!parsedValue) {
			throw new Error('parseHeaderValue() failed for ' + value);
		}

		for (i = 0, len = rule.names.length; i < len; i++) {
			if (parsedValue[i + 1] !== undefined) {
				data[rule.names[i]] = parsedValue[i + 1];
			}
		}
	} else {
		data = rule.reg(value);
		if (!data) {
			throw new Error('parseHeaderValue() failed for ' + value);
		}
	}

	if (!data.value) {
		data.value = value;
	}

	return data;
}
