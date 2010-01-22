dojo.provide("mvc.form.NumberTextBox");
dojo.require("dijit.form.NumberTextBox");

dojo.declare(
	"mvc.form.NumberTextBox",
	dijit.form.NumberTextBox,
	{
		// summary:
		//		A MappedTextBox with single-node data binding to a data model

        store : null,           // datastore target of the single-node binding
        
        query : { name : "name" },             // query expression structure
        
        bindExpr : "name",      // default databinding expression
        
        item : null,            // currently bound item

		postCreate : function () {
		  if ( this.store != null ) {
		      var pThis = this;
		      // setup callback notification handler
		      dojo.connect(this.store, "onSet", function () {
		          pThis.attr( "value", parseInt( pThis.store.getValue( pThis.item ) ) );
		      });
		      var fetch = {
					query: this.query,
					queryOptions: {
						ignoreCase: this.ignoreCase,
						deep: true
					},
					onComplete: function(result, dataObject){
						pThis.attr( "value", parseInt( pThis.store.getValue(result[0])));
						pThis.item = result[0];
						pThis._fetchHandle = null;
					},
					onError: function(errText){
						console.error('mvc.form.TextBox: ' + errText);
						pThis._fetchHandle = null;
					}
				};
				dojo.mixin(fetch, this.fetchProperties);
				fetch.query.name = this.bindExpr;
				this._fetchHandle = this.store.fetch(fetch);
		  }
	   },
	   
	   _onBlur : function () {
	       if ( this.store != null ) {
	           var pThis = this;
	           var tempValue = pThis.attr( "value" );
	           if ( pThis.item != null ) {
	               pThis.store.setValue( pThis.item, null, tempValue.toString() );
	           }
	       }
	   }
	}
);

