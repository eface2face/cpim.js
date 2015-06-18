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
	REGEXP_VALID_LINE = /^(([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)\.)?([a-zA-Z0-9!#$%&'+,\-\^_`|~]+):[^ ]* (.+)$/;


debugerror.log = console.warn.bind(console);


function parse(raw) {
	debug('parse()');

	var
		lines,
		i, len,
		line,
		message;

	if (typeof raw !== 'string') {
		throw new Error('given data must be a string');
	}

	lines = raw.split(/\r\n/);
	message = new Message();

	lines.forEach(function (kk) {
		debug('--- line: %s', kk);
	});

	// Parse lines.
	for (i = 0, len = lines.length; i < len; i++) {
		line = lines[i];

		// TODO
		if (!line) {
			continue;
		}

		if (!processLine(line)) {
			return false;
		}
	}

	return message;

	function processLine(line) {
		var splitted = splitLine(line),
			name,
			rule,
			parsedValue,
			i, len,
			data = {};

		if (!splitted) {
			debugerror('wrong header "%s"', line);
			return false;
		}

		name = splitted.name;

		if (message.headers[name] && grammar.isSingleHeader(name)) {
			debugerror('"%s" header can only appear once', name);
			return false;
		}

		rule = grammar.rules[name] || grammar.unknowRule;

		parsedValue = splitted.value.match(rule.reg);
		if (!parsedValue) {
			debugerror('wrong header: "%s"', line);
			return false;
		}

		debug('parsedValue: %o', parsedValue);

		for (i = 0, len = rule.names.length; i < len; i++) {
			if (parsedValue[i + 1] !== undefined) {
				data[rule.names[i]] = parsedValue[i + 1];
			}
		}

		(message.headers[name] = message.headers[name] || []).push(data);

		return true;
	}
}


/**
 * Private API.
 */


function splitLine(line) {
	var match = line.match(REGEXP_VALID_LINE);

	// debug('splitLine() [line:"%s" , length:%s, match:%o]', line, line.length, match);

	if (!match) {
		return false;
	}

	// debug('splitLine() | [prefix:"%s", name:"%s", value:"%s"]', match[2], match[3], match[4]);

	return {
		prefix: match[2],
		name: match[3],
		value: match[4]
	};
}
