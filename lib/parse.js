/**
 * Expose the parse function.
 */
module.exports = parse;


/**
 * Dependencies.
 */
var
	debug = require('debug')('cpim:parse'),
	debugerror = require('debug')('cpim:ERROR:parse'),
	grammar = require('./grammar'),
	Message = require('./Message'),


/**
 * Constants.
 */
	IN_HEADERS = 1,
	IN_MIME = 2,
	IN_BODY = 3,
	REGEXP_VALID_HEADER = /^(([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)\.)?([a-zA-Z0-9!#$%&'+,\-\^_`|~]+):[^ ]* (.+)$/,
	REGEXP_VALID_MIME_HEADER = /^([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)[ \t]*:[ \t]*(.+)$/;  // TODO: RFC 2045


debugerror.log = console.warn.bind(console);


function parse(raw) {
	debug('parse()');

	var
		where = IN_HEADERS,
		lines,
		i, len,
		line,

		message;

	if (typeof raw !== 'string') {
		throw new Error('given data must be a string');
	}

	lines = raw.split(/\r\n/);
	message = new Message();

	for (i = 0, len = lines.length; i < len; i++) {
		line = lines[i];

		if (!line) {
			switch (where) {
				case IN_HEADERS:
					where = IN_MIME;
					break;

				case IN_MIME:
					where = IN_BODY;
					break;
			}

			continue;
		}

		switch (where) {
			case IN_HEADERS:
				if (!parseHeader(line)) {
					debugerror('discarding message due to invalid header: "%s"', line);
					return false;
				}
				break;

			case IN_MIME:
				if (!parseMIMEHeader(line)) {
					debugerror('discarding message due to invalid MIME header: "%s"', line);
					return false;
				}
				break;
		}
	}

	return message;

	function parseHeader(line) {
		var
			splitted = splitHeader(line),
			name,
			rule,
			parsedValue,
			i, len,
			data = {};

		if (!splitted) {
			debugerror('invalid header "%s"', line);
			return false;
		}

		name = splitted.name;

		if (message.headers[name] && grammar.isSingleHeader(name)) {
			debugerror('"%s" header can only appear once', name);
			return false;
		}

		rule = grammar.rules[name] || grammar.unknownRule;

		if (typeof rule.reg !== 'function') {
			parsedValue = splitted.value.match(rule.reg);

			if (!parsedValue) {
				debugerror('wrong header: "%s"', line);
				return false;
			}

			for (i = 0, len = rule.names.length; i < len; i++) {
				if (parsedValue[i + 1] !== undefined) {
					data[rule.names[i]] = parsedValue[i + 1];
				}
			}
		} else {
			data = rule.reg(splitted.value);

			if (!data) {
				debugerror('wrong header: "%s"', line);
				return false;
			}
		}

		(message.headers[name] = message.headers[name] || []).push(data);
		return true;
	}

	function parseMIMEHeader(line) {
		var
			splitted = splitMIMEHeader(line),
			name,
			rule,
			parsedValue,
			i, len,
			data = {};

		if (!splitted) {
			debugerror('invalid MIME header "%s"', line);
			return false;
		}

		name = splitted.name;

		rule = grammar.MIMErules[name] || grammar.unknownMIMERule;

		if (typeof rule.reg !== 'function') {
			parsedValue = splitted.value.match(rule.reg);

			if (!parsedValue) {
				debugerror('wrong MIME header: "%s"', line);
				return false;
			}

			for (i = 0, len = rule.names.length; i < len; i++) {
				if (parsedValue[i + 1] !== undefined) {
					data[rule.names[i]] = parsedValue[i + 1];
				}
			}
		} else {
			data = rule.reg(splitted.value);

			if (!data) {
				debugerror('wrong MIME header: "%s"', line);
				return false;
			}
		}

		(message.mimeHeaders[name] = message.mimeHeaders[name] || []).push(data);
		return true;
	}
}


/**
 * Private API.
 */


function splitHeader(line) {
	var match = line.match(REGEXP_VALID_HEADER);

	if (!match) {
		return false;
	}

	return {
		prefix: match[2],
		name: match[3],
		value: match[4]
	};
}


function splitMIMEHeader(line) {
	var match = line.match(REGEXP_VALID_MIME_HEADER);

	if (!match) {
		return false;
	}

	return {
		name: match[1],
		value: match[2]
	};
}
