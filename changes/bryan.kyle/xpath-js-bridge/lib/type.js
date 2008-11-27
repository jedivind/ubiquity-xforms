var Type = {
	
	of: function(o) {
		
		if (o && (o instanceof Array || Type.isArrayLike(o)))
			return 'array';
		else
			return typeof(o);
		
	},
	
	isArrayLike: function(o) {
		return (typeof(o.push) === 'function' && typeof(o.shift) === 'function' && typeof(o.length) === 'number');
	}
	
};