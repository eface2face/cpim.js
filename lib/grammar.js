
/**
 * Constants.
 */
var
	REGEXP_CONTENT_TYPE = /^([^\t \/]+)\/([^\t ;]+)(.*)$/,
	REGEXP_PARAM = /^[ \t]*([^\t =]+)[ \t]*=[ \t]*([^\t =]+)[ \t]*$/,


	grammar = module.exports = {},
	// Headers that can only appear once.
	singleHeaders = {
		From: true,
		DateTime: true
	};


grammar.rules = {
	From: {
		reg: /^(.*[^ ])?[ ]*<(.*)>$/,
		names: ['name', 'uri'],
		format: function (data) {
			return data.name ? '%s <%s>' : '<%s>';
		}
	},

	To: {
		reg: /^(.*[^ ])?[ ]*<(.*)>$/,
		names: ['name', 'uri'],
		format: function (data) {
			return data.name ? '%s <%s>' : '<%s>';
		}
	},

	cc: {
		reg: /^(.*[^ ])?[ ]*<(.*)>$/,
		names: ['name', 'uri'],
		format: function (data) {
			return data.name ? '%s <%s>' : '<%s>';
		}
	},

	DateTime: {
		reg: function (value) {
			var seconds = Date.parse(value);

			if (seconds) {
				return {
					date: new Date(seconds)
				};
			} else {
				return undefined;
			}
		},
		format: function (data) {
			return data.date.toISOString();
		}
	},

	Subject: {
		names: ['subject']
	},

	NS: {
		reg: /^([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)?[ ]*<(.*)>$/,
		names: ['prefix', 'uri'],
		format: function (data) {
			return data.prefix ? '%s <%s>' : '<%s>';
		}
	}
};


grammar.unknownRule = {
	reg: /(.*)/,
	names: ['value'],
	format: '%s'
};


grammar.isSingleHeader = function (name) {
	return !!singleHeaders[name];
};


grammar.MIMErules = {
	'content-type': {
		// reg: /^([^\t \/]+)\/([^\t ;]+).*$/,
		reg: function (value) {
			var match = value.match(REGEXP_CONTENT_TYPE),
				params = {};

			if (!match) {
				return undefined;
			}

			if (match[3]) {
				params = parseParams(match[3]);
				if (!params) {
					return undefined;
				}
			}

			return {
				type: match[1],
				subtype: match[2],
				params: params
			};
		},
		// names: ['type', 'subtype'],
		format: function () {
			return '%s/%s';
		}
	}
};


grammar.unknownMIMERule = {
	reg: /(.*)/,
	names: ['value'],
	format: '%s'
};


// Set sensible defaults to avoid polluting the grammar with boring details.

Object.keys(grammar.rules).forEach(function (name) {
	var rule = grammar.rules[name];

	if (!rule.reg) {
		rule.reg = /(.*)/;
	}
	if (!rule.format) {
		rule.format = '%s';
	}
});

Object.keys(grammar.MIMErules).forEach(function (name) {
	var rule = grammar.MIMErules[name];

	if (!rule.reg) {
		rule.reg = /(.*)/;
	}
	if (!rule.format) {
		rule.format = '%s';
	}
});


/**
 * Private API.
 */


function parseParams(rawParams) {
	var
		splittedParams,
		i, len,
		paramMatch,
		params = {};

	if (rawParams === '' || rawParams === undefined || rawParams === null) {
		return params;
	}

	splittedParams = rawParams.split(';');
	if (splittedParams.length === 0) {
		return undefined;
	}

	for (i = 1, len = splittedParams.length; i < len; i++) {
		paramMatch = splittedParams[i].match(REGEXP_PARAM);
		if (!paramMatch) {
			return undefined;
		}

		params[paramMatch[1].toLowerCase()] = paramMatch[2];
	}

	return params;
}
