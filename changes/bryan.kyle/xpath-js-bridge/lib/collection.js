var Collection = {
	
	map: function(a, fn) {
		var result = [];
		for (var i=0; i<a.length; i++) {
			result.push(fn.call(null, a[i]));
		}
		return result;
	}
	
};