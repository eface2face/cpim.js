var
	/**
	 * Exported object.
	 */
	grammar = module.exports = {},

	/**
	 * Constants.
	 */
	SINGLE_HEADERS = {
		From: true,
		DateTime: true
	};


grammar.headerRules = {
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


grammar.unknownHeaderRule = {
	reg: /(.*)/,
	names: ['value']
};


grammar.isSingleHeader = function (name) {
	return !!SINGLE_HEADERS[name];
};


grammar.NS_PREFIX_CORE = 'urn:ietf:params:cpim-headers:';


grammar.headerize = function (string) {
	var
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

	return hname;
};


// Set sensible defaults to avoid polluting the grammar with boring details.

Object.keys(grammar.headerRules).forEach(function (name) {
	var rule = grammar.headerRules[name];

	if (!rule.reg) {
		rule.reg = /(.*)/;
	}
});
