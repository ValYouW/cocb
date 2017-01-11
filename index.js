var COCB = require('./cocb.js');

module.exports = function(that, genFn) {
	if (typeof genFn === 'undefined') {
		genFn = that;
		that = null;
	}

	return new COCB(genFn, that);
};
