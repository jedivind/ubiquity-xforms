dojo.provide("mvc.data.ModelStore");
dojo.require("dojo.data.api.Read");
dojo.require("dojo.data.api.Write");
dojo.require("dojo.data.api.Notification");
dojo.require("dojo.data.util.simpleFetch");

dojo.declare("mvc.data.ModelStore", [dojo.data.api.Read, dojo.data.api.Write, dojo.data.api.Notification], {
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
			this.modelId = args.id;
		};
		this._bindToModel();
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


	getValue: function(	/* item */ item,
						/* attribute-name-string */ attribute,
						/* value? */ defaultValue){
	   var valueStr = null;
	   if (item.node.nodeType == 1 ) /* ELEMENT */ {
           valueStr = item.node.innerText || item.node.firstChild.nodeValue || '';
       }
       else if ( item.node.nodeType == 2 ) {
        valueStr = item.node.nodeValue;
       };
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
		this._model.setValue( this._model.getEvaluationContext(), item.path, "'" + value + "'" );
		return true; // boolean
	},	

	isItemLoaded: function(/* anything */ something){
		return true;
	},
	
	_getItemsArray: function(expression) {
		var items = [];
		var nodes = null;
		var ns = this._model.EvaluateXPath(expression, null);
		if (ns != null ) nodes = ns.nodeSetValue();
		  else return null;
		var i =0;
		var len = nodes.length;
		var globalLen = this.liveItemsArray.length;
		
		for(i = 0; i < len; i++){
			var node = nodes[i];
				
			if((node.nodeType != 1 /*ELEMENT_NODE*/) && (node.nodeType != 2 /* Attribute node */)){
				continue;
			}
			var nextItem = new mvc.data.ModelItem( expression, node, this );
			nextItem.identity = globalLen++;
			
	        items.push(nextItem);	            
	        
	        // handle special case for single-node-binding (move to separate class or mixin???)
	        
	        if ( i == 0 ) {
	           this.item = nextItem;
	        }
		}
		return items;
	},	

	_fetchItems: function(	/* Object */ args,
							/* Function */ findCallback,
							/* Function */ errorCallback){
		// summary:
		//		See dojo.data.util.simpleFetch.fetch()
		
		if ( this._model == null ) {
		  this._bindToModel();
		}
		if ( this._model == null )
		  return;
		  
		var items = this._getItemsArray(args.query.name);
		findCallback(items, args);
	},

	close: function(/*dojo.data.api.Request || args || null */ request){
		return;
	},

	getLabel: function(/* item */ item){
		return this.getValue( item, "value", null );
	}
});

dojo.declare("mvc.data.ModelItem", null, {
	constructor: function(path, node, store) {

		this.path = path;
		this.node = node;
		this.store = store;
		this.identity = 0;
	}
});

//Mix in the simple fetch implementation to this class.
dojo.extend(mvc.data.ModelStore,dojo.data.util.simpleFetch);
