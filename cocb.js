class COCB {
	constructor(genFn, that) {
		if (typeof genFn !== 'function' || genFn.constructor.name !== 'GeneratorFunction') {
			throw new Error('cocb must be called with a generator function');
		}

		this.genFn = genFn;
		this.useAsThis = that || this;
		this.iterator = null;
		this.cbs = 0;
		this.values = null;
		this.lastYieldResult = null;
		this.errorHandler = nop;

		// Start on the next tick to let the user a change to call the "catch" method
		setTimeout(this.start.bind(this), 0);
	}

	catch(handler) {
		if (typeof handler !== 'function') {
			throw new Error('catch must accept a function');
		}

		this.errorHandler = handler;
	}

	/**
	 * Starts the whole process
	 */
	start() {
		// Call the generator function
		try {
			this.iterator = this.genFn.call(this.useAsThis, (err, data) => {
				this.cb(err, data);
			});
			this.next();
		} catch (e) {
			this.errorHandler(e);
		}
	}

	/**
	 * Calls the iterator next function
	 * @param {*} arg - Argument to the iterator's next function
	 */
	next(arg) {
		this.cbs = 0;
		this.values = [];

		try {
			// Important to reset lastYieldResult because if the user is going to call to a SYNC function with our cb
			// then "checkResult" will get called with the old previous "lastYieldResult" which is not good...
			this.lastYieldResult = null;
			this.lastYieldResult = this.iterator.next(arg);
		} catch (e) {
			this.handleError(e);
			return;
		}

		this.checkResult();
	}

	checkResult() {
		// In order to continue we must have both a lastYieldResult and a value (if the user called our "cb" before he called
		// yield we could have a value but no lastYieldResult.
		if (!this.lastYieldResult || this.values.length < 1) {
			return;
		}

		this.next(this.values[0]);
	}

	handleError(err) {
		this.errorHandler(err);
		this.iterator.return(); // Terminate the generator
	}

	/**
	 * A callback function to be passes as the "cb" when the user calls to his async functions
	 */
	cb(err, data) {
		if (err) {
			this.handleError(err);
			return;
		}

		this.values.push(data);
		this.checkResult();
	}
}

function nop() {}

module.exports = COCB;
