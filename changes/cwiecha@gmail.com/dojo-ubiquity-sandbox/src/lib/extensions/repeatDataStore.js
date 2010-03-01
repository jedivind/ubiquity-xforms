dojo.provide("mvc.data.RepeatStore");
dojo.require("dojo.data.api.Read");
dojo.require("dojo.data.api.Write");
dojo.require("dojo.data.api.Notification");
dojo.require("dojo.data.util.simpleFetch");

dojo.declare("mvc.data.RepeatStore", [dojo.data.api.Read, dojo.data.api.Write, dojo.data.api.Notification], {
	//	summary:
	//		This is an abstract API that data provider implementations conform to.  
	//		This file defines methods signatures and intentionally leaves all the
	//		methods unimplemented.  For more information on the dojo.data APIs, 
	//		please visit: http://www.dojotoolkit.org/node/98
	
	liveItemsArray : [],
	
	modelId : "none",
	_model : null,
	
	constructor: function(/* Object */ args) {
		//	summary:
		//		Constructor for the Model store.  
		//	keywordParameters:
		//		An anonymous object to initialize properties.  It expects the following values:
		//		url:		The url to a service or an XML document that represents the store
		//		rootItem:	A tag name for root items
		//		keyAttribute:	An attribute name for a key or an indentify
		// 		attributeMap:   An anonymous object contains properties for attribute mapping,
		//						{"tag_name.item_attribute_name": "@xml_attribute_name", ...}
		//		sendQuery:		A boolean indicate to add a query string to the service URL 
		console.log("ModelStore()");
		if(args){
			this.repeatObj = args;
		}
	},	
	
	getFeatures: function(){
		return {"dojo.data.api.Read": true, "dojo.data.api.Identity": true, "dojo.data.api.Write": true,
		      "dojo.data.api.Notification": true};
	},
	
	getIdentity: function(/* item */ item){
		//	summary:
		//		Returns a unique identifier for an item.  The return value will be
		//		either a string or something that has a toString() method (such as,
		//		for example, a dojox.uuid.Uuid object).
		//	item:
		//		The item from the store from which to obtain its identifier.
		//	exceptions:
		//		Conforming implementations may throw an exception or return null if
		//		item is not an item.
		//	example:
		//	|	var itemId = store.getIdentity(kermit);
		//	|	assert(kermit === store.findByIdentity(store.getIdentity(kermit)));
		
		var itemIdentityString = item.identity.toString();
		return itemIdentityString; // string
	},
	
	getIdentityAttributes: function(/* item */ item){
		//	summary:
		//		Returns an array of attribute names that are used to generate the identity. 
		//		For most stores, this is a single attribute, but for some complex stores
		//		such as RDB backed stores that use compound (multi-attribute) identifiers
		//		it can be more than one.  If the identity is not composed of attributes
		//		on the item, it will return null.  This function is intended to identify
		//		the attributes that comprise the identity so that so that during a render
		//		of all attributes, the UI can hide the the identity information if it 
		//		chooses.
		//	item:
		//		The item from the store from which to obtain the array of public attributes that 
		//		compose the identifier, if any.
		//	example:
		//	|	var itemId = store.getIdentity(kermit);
		//	|	var identifiers = store.getIdentityAttributes(itemId);
		//	|	assert(typeof identifiers === "array" || identifiers === null);
		throw new Error('Unimplemented API: dojo.data.api.Identity.getIdentityAttributes');
		return null; // string
	},
	
    getLabelAttributes: function(/* item */ item){
		//	summary:
		//		Method to inspect the item and return an array of what attributes of the item were used 
		//		to generate its label, if any.
		//
		//	description:
		//		Method to inspect the item and return an array of what attributes of the item were used 
		//		to generate its label, if any.  This function is to assist UI developers in knowing what
		//		attributes can be ignored out of the attributes an item has when displaying it, in cases
		//		where the UI is using the label as an overall identifer should they wish to hide 
		//		redundant information.
		//
		//	item:
		//		The item to return the list of label attributes for.
		//
		//	returns: 
		//		An array of attribute names that were used to generate the label, or null if public attributes 
		//		were not used to generate the label.
		// throw new Error('Unimplemented API: dojo.data.api.Read.getLabelAttributes');
		return null;
	},
	
	fetchItemByIdentity: function(/* object */ keywordArgs){
		//	summary:
		//		Given the identity of an item, this method returns the item that has 
		//		that identity through the onItem callback.  Conforming implementations 
		//		should return null if there is no item with the given identity.  
		//		Implementations of fetchItemByIdentity() may sometimes return an item 
		//		from a local cache and may sometimes fetch an item from a remote server, 
		//
		// 	keywordArgs:
		//		An anonymous object that defines the item to locate and callbacks to invoke when the 
		//		item has been located and load has completed.  The format of the object is as follows:
		//		{
		//			identity: string|object,
		//			onItem: Function,
		//			onError: Function,
		//			scope: object
		//		}
		//	The *identity* parameter.
		//		The identity parameter is the identity of the item you wish to locate and load
		//		This attribute is required.  It should be a string or an object that toString() 
		//		can be called on.
		//		
		//	The *onItem* parameter.
		//		Function(item)
		//		The onItem parameter is the callback to invoke when the item has been loaded.  It takes only one
		//		parameter, the item located, or null if none found.
		//
		//	The *onError* parameter.
		//		Function(error)
		//		The onError parameter is the callback to invoke when the item load encountered an error.  It takes only one
		//		parameter, the error object
		//
		//	The *scope* parameter.
		//		If a scope object is provided, all of the callback functions (onItem, 
		//		onError, etc) will be invoked in the context of the scope object.
		//		In the body of the callback function, the value of the "this"
		//		keyword will be the scope object.   If no scope object is provided,
		//		the callback functions will be called in the context of dojo.global.
		//		For example, onItem.call(scope, item, request) vs. 
		//		onItem.call(dojo.global, item, request)
        var identity = parseInt( keywordArgs.identity );
        if ( identity < this.liveItemsArray.length )
            return this.liveItemsArray[identity];
        else return null;
	},
	
	_bindToModel : function () {
    	this._model = dojo.byId(this.modelId);
		
		// set ourselves up as a control bound to the model so we can get refreshed
		
		this.element = this;  // be sure we have an element property so the model is happy to call us back
		if ( this._model != null ) {
		  this._model.addControl( this );
		}
	},
	
	refresh : function () {
	   // trigger the Dojo change notification
	   this.onSet( this.item, null, null, null );  // just flag the change, no value transmitted
	},
	
	rewire : function () {
	   // no-op
	},
	
	unwire : function () {
	},
	
	onSet: function(/* item */ item, 
		/* attribute-name-string */ attribute, 
		/* object | array */ oldValue,
		/* object | array */ newValue){
					
	},

	//		Actually. just implements the subset of dojo.data.Read/Notification
	//		needed for ComboBox to work.
	//
	//		Note that an item is just a pointer to the XForms instance DomNode.
	
	hasElementChildren : function( node ) {
	   var nextChild = node.firstChild;
	   var foundElementChild = false;
  	   while ( (foundElementChild == false ) && ( nextChild != null ) ) {
  	     if ( nextChild.nodeType == 1 ) foundElementChild = true;
  	        else nextChild = nextChild.nextSibling;
  	   };
  	   return foundElementChild;
	},

	getValues: function(/* item */ item,
						/* attribute-name-string */ attribute){
		//	summary:
		// 		This getValues() method works just like the getValue() method, but getValues()
		//		always returns an array rather than a single attribute value.  The array
		//		may be empty, may contain a single attribute value, or may contain
		//		many attribute values.
		//		If the item does not have a value for the given attribute, then getValues()
		//		will return an empty array: [].  (So, if store.hasAttribute(item, attribute)
		//		has a return of false, then store.getValues(item, attribute) will return [].)
		//
		//	item:
		//		The item to access values on.
		//	attribute:
		//		The attribute to access represented as a string.
		//
		//	exceptions:
		//		Throws an exception if *item* is not an item, or *attribute* is not a string
		//	example:
		//	|	var friendsOfLuke = store.getValues(lukeSkywalker, "friends");

		// throw new Error('Unimplemented API: dojo.data.api.Read.getValues');
				    
      	var newValue = new Object;
		     
		var nextItemChild = item.firstChild;
        while ( nextItemChild != null ) {
            newValue[nextItemChild.nodeName] = nextItemChild.getValue();	              
	        nextItemChild = nextItemChild.nextSibling;
	    };	
		return newValue; 
	},


	getValue: function(	/* item */ item,
						/* attribute-name-string */ attribute,
						/* value? */ defaultValue){
	   var valueStr = null;
	   valueStr = item.getValue();  // get control value
       return valueStr;
	},
	
	
	setValue: function(	/* item */ item, 
						/* string */ attribute,
						/* almost anything */ value){
		//	summary:
		//		Sets the value of an attribute on an item.
		//		Replaces any previous value or values.
		//
		//	item:
		//		The item to modify.
		//	attribute:
		//		The attribute of the item to change represented as a string name.
		//	value:
		//		The value to assign to the item.
		//
		//	exceptions:
		//		Throws an exception if *item* is not an item, or if *attribute*
		//		is neither an attribute object or a string.
		//		Throws an exception if *value* is undefined.
		//	example:
		//	|	var success = store.set(kermit, "color", "green");
		item.setValue( value );  // set control value
		return true; // boolean
	},	

	isItemLoaded: function(/* anything */ something){
		return true;
	},
	
	_getItemsArray: function(expression) {
		var items = [];
		var nodes = null;
		
		var i =0;
		var nextRepeatGroup = repeatObj.firstChild;
		while ( nextRepeatGroup != null {			
			var nextItem = new mvc.data.RepeatItem( expression, nextRepeatGroup, this );
	        items.push(nextItem);	            	        
		}
		return items;
	},	

	_fetchItems: function(	/* Object */ args,
							/* Function */ findCallback,
							/* Function */ errorCallback){
		// summary:
		//		See dojo.data.util.simpleFetch.fetch()
			  
		var items = this._getItemsArray(args.query.name);
		findCallback(items, args);
	},

	close: function(/*dojo.data.api.Request || args || null */ request){
		return;
	},

	getLabel: function(/* item */ item){
		return this.getValue( item, "value", null ).y;
	}
});

dojo.declare("mvc.data.RepeatItem", null, {
	constructor: function(path, node, store) {

		this.path = path;
		this.node = node;
		this.store = store;
		this.identity = 0;
	}
});

//Mix in the simple fetch implementation to this class.
dojo.extend(mvc.data.RepeatStore,dojo.data.util.simpleFetch);
