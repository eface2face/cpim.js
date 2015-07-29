var
	/**
	 * Exported object.
	 */
	grammar = module.exports = {},

	/**
	 * Constants.
	 */
	REGEXP_CONTENT_TYPE = /^([^\t \/]+)\/([^\t ;]+)(.*)$/,
	REGEXP_PARAM = /^[ \t]*([^\t =]+)[ \t]*=[ \t]*([^\t =]+)[ \t]*$/,
	// CPIM headers that can only appear once.
	SINGLE_CPIM_HEADERS = {
		From: true,
		DateTime: true
	};


grammar.cpimHeaderRules = {
	From: {
		reg: /^(.*[^ ])?[ ]*<(.*)>$/,
		names: ['name', 'uri']
	},

	To: {
		reg: /^(.*[^ ])?[ ]*<(.*)>$/,
		names: ['name', 'uri']
	},

	cc: {
		reg: /^(.*[^ ])?[ ]*<(.*)>$/,
		names: ['name', 'uri']
	},

	DateTime: {
		reg: function (value) {
			var date;

			if (typeof value === 'object') {
				return {
					date: value,
					value: value.toISOString()
				};
			} else {
				date = new Date(value);

				if (date) {
					return {
						date: date,
						value: date.toISOString()
					};
				} else {
					return undefined;
				}
			}
		}
	},

	NS: {
		reg: /^([a-zA-Z0-9!#$%&'+,\-\^_`|~]+)?[ ]*<(.*)>$/,
		names: ['prefix', 'uri']
	}
};


grammar.unknownCpimHeaderRule = {
	reg: /(.*)/,
	names: ['value']
};


grammar.isSingleCpimHeader = function (name) {
	return !!SINGLE_CPIM_HEADERS[name];
};


grammar.NS_PREFIX_CORE = 'urn:ietf:params:cpim-headers:';


grammar.mimeHeaderRules = {
	'Content-Type': {
		// reg: /^([^\t \/]+)\/([^\t ;]+).*$/,
		reg: function (value) {
			var
				match = value.match(REGEXP_CONTENT_TYPE),
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
				fulltype: match[1].toLowerCase() + '/' + match[2].toLowerCase(),
				type: match[1].toLowerCase(),
				subtype: match[2].toLowerCase(),
				params: params
			};
		}
	}
};


grammar.unknownMimeHeaderRule = {
	reg: /(.*)/,
	names: ['value']
};


grammar.headerize = function (string) {
	var
		exceptions = {
			'Content-Id': 'Content-ID'
		},
		name = string.toLowerCase().replace(/_/g, '-').split('-'),
		hname = '',
		parts = name.length,
		part;

	for (part = 0; part < parts; part++) {
		if (part !== 0) {
			hname += '-';
		}
		hname += name[part].charAt(0).toUpperCase() + name[part].substring(1);
	}

	if (exceptions[hname]) {
		hname = exceptions[hname];
	}

	return hname;
};


// Set sensible defaults to avoid polluting the grammar with boring details.

Object.keys(grammar.cpimHeaderRules).forEach(function (name) {
	var rule = grammar.cpimHeaderRules[name];

	if (!rule.reg) {
		rule.reg = /(.*)/;
	}
});

Object.keys(grammar.mimeHeaderRules).forEach(function (name) {
	var rule = grammar.mimeHeaderRules[name];

	if (!rule.reg) {
		rule.reg = /(.*)/;
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
