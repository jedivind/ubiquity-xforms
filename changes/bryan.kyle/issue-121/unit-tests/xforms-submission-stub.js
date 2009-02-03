/**
 * Stub implementation of xforms-submission callback and submission methods for unit tesing.
 */
submission.prototype.request = function(sMethod, sAction, sBody, nTimeout, oCallback) {
	if (nTimeout) {
		oCallback.timeout = nTimeout;
	}

	this.method = sMethod;
	this.action = sAction;
	this.body = sBody;
	this.timeout = nTimeout;
	this.callback = oCallback;
	
	return null;
};

submission.prototype.getConnection = function() {
	
	return {
		headers: {},
		
		initHeader: function(name, value) {
			this.headers[name] = value;
		}
	};
};
