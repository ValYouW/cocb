var COCB = require('./cocb.js');

module.exports = function(genFn) {
	return new COCB(genFn);
};
