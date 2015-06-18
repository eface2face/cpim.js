var
	grammar = module.exports = {},
	// Headers that can only appear once.
	singleHeaders = {
		From: true
	};


grammar.rules = {
	From: {
		reg: /^(.*[^ ])?[ ]*<(.*)>$/,
		names: ['name', 'uri'],
		format: function (data) {
			return data.name ? '%s <%s>' : '<%s>';
		}
	}
};


grammar.unknowRule = {
	reg: /(.*)/,
	names: ['value'],
	format: '%s'
};


grammar.isSingleHeader = function (name) {
	return !!singleHeaders[name];
};


// Set sensible defaults to avoid polluting the grammar with boring details.
Object.keys(grammar.rules).forEach(function (name) {
	var rule = grammar.rules[name];

	if (!rule.reg) {
		rule.reg = /(.*)/;
	}
	if (!rule.names) {
		rule.names = [];
	}
	if (!rule.format) {
		rule.format = '%s';
	}
});
