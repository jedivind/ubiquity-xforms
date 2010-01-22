dojo.provide("mvc.form.FilteringSelect");
dojo.require("dijit.form.FilteringSelect");

dojo.declare(
	"mvc.form.FilteringSelect",
	dijit.form.FilteringSelect,
	{
		// summary:
		//		A dijit.form.FilteringSelect with single-node data binding to a data model
        
        bindExpr : "name",      // default databinding expression for single-node-binding
        
        SNBitem : null,         // currently bound item for single-node-binding

		postCreate : function () {
		  if ( this.store != null ) {
		      var pThis = this;
		      // setup callback notification handler
		      dojo.connect(this.store, "onSet", function () {
		          pThis.attr( "value", pThis.store.getValue( pThis.SNBitem ) );
		      });
		      var fetch = {
					query: {},
					queryOptions: {
						ignoreCase: this.ignoreCase,
						deep: true
					},
					onComplete: function(result, dataObject){
					    var val = pThis.store.getIdentity( result[0] );
						pThis.attr( "value", val );
						pThis.SNBitem = result[0];
					},
					onError: function(errText){
						console.error('mvc.form.FilteringSelect: ' + errText);
					}
				};
				dojo.mixin(fetch, this.fetchProperties);
				fetch.query.name = this.bindExpr;
				this._fetchHandle = this.store.fetch(fetch);
		  }
	   },
	   
	   _setItemAttr: function(/*item*/ item, /*Boolean?*/ priorityChange, /*String?*/ displayedValue){
			// summary:
			//		Set the displayed valued in the input box, and the hidden value
			//		that gets submitted, based on a dojo.data store item.
			// description:
			//		Users shouldn't call this function; they should be calling
			//		attr('item', value)
			// tags:
			//		private
			
			
			this.inherited(arguments);
			
			this.store.setValue( this.SNBitem, null, displayedValue );
			
		}
	}
);

