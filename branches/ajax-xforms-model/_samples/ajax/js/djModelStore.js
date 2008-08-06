/*
 * Copyright (C) 2008 Backplane Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

dojo.provide("dojoXForms.data.ModelStore");
dojo.provide("dojoXForms.data.ModelItem");

dojo.require("dojo.data.util.simpleFetch");
dojo.declare("dojoXForms.data.ModelStore", null, {
	
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
			this.submissionId = args.submissionId;
			this.onSubmitDone =  args.submitDone;
			this.onSubmitError = args.submitError;
			this.itemAttrs = args.itemXPathAttrs;
		}
		this._model = dojo.byId(this.modelId);
		this._submission = dojo.byId(this.submissionId);		
		this.doneListener = null;
		this.errorListener = null;
		this._callbackAdded = false;
		this._modelChanged = false;
		this._fetching = false;
		this._newItems = [];
		this._deletedItems = [];
		this._modifiedItems = [];
		this._pendingQueue = [];
	    this._features = {'dojo.data.api.Read':true,
	    		          'dojo.data.api.Write':true,
	    		          'dojo.data.api.Notification': true};
	},

	_assertIsItem: function(/* item */ item){
		//	summary:
		//      This function tests whether the item passed in is indeed an item in the store.
		//	item: 
		//		The item to test for being contained by the store.
		if(!this.isItem(item)){ 
			throw new Error("dojoXForms.data.ModelStore: a function was passed an item argument that was not an item");
		}
	},

	_assertIsAttribute: function(/* attribute-name-string */ attribute){
		//	summary:
		//		This function tests whether the item passed in is indeed a valid 'attribute' like type for the store.
		//	attribute: 
		//		The attribute to test for being contained by the store.
		if(typeof attribute !== "string"){ 
			throw new Error("dojoXForms.data.ModelStore: a function was passed an attribute argument that was not an attribute name string");
		}
	},
	
	getValue: function(	/* item */ item, 
			/* attribute-name-string */ attribute, 
			/* value? */ defaultValue){	
		this._assertIsItem(item);
		this._assertIsAttribute(attribute);

		var element = item.element;
	    var value = element.getAttribute(attribute);
	    if (!value) {	    	
	    	var expression = this.itemAttrs[attribute];
	    	if (expression) {
	    		value = this._model.EvaluateXPath(expression, element).stringValue();
	    	}	    	
	    }
	    
	    if (!value) {	   
	    	if (typeof(defaultValue) != "undefined" && defaultValue != null )
	    		value = defaultValue;
	    	else 
	    		value = undefined;
	    }
	    console.log(attribute + " = " + value);
	    return value;	    	
	},
	
	getValues: function(/* item */ item,
			/* attribute-name-string */ attribute){
		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
	},
	
	getAttributes: function(/* item */ item){
		this._assertIsItem(item);		
		return item.element.attributes;
	},
	
	hasAttribute: function(	/* item */ item,
			/* attribute-name-string */ attribute){
		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
		return (item.element.getAttribute(attribute) !== undefined);
	},
	
	containsValue: function(/* item */ item,
			/* attribute-name-string */ attribute, 
			/* anything */ value){
		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
	}, 
	
	isItem: function(/* anything */ something){
		//		summary:
		//		Check whether the object is an item (XML element)
		//	item:
		//		An object to check
		// 	returns:
		//		True if the object is an Model Item element, otherwise false
		if(something && something.element && something.store && something.store === this){
			return true; //boolean
		}
		return false; //boolean
	},
	
	isItemLoaded: function(/* anything */ something) {
		//	summary:
		//		Check whether the object is an item (XML element) and loaded
		//	item:
		//		An object to check
		//	returns:
		//		True if the object is an XML element, otherwise false
		return this.isItem(something); //boolean
	},
	
	loadItem: function(/* object */ keywordArgs){
		//	summary:
		//		Load an model item (XML element)
		//	keywordArgs:
		//		object containing the args for loadItem.  See dojo.data.api.Read.loadItem()	
	},
	
	_fetchItems: function(request, fetchHandler, errorHandler) {
		console.log('fetch');
		console.log('start=' + request.start + ', total=' + request.count)
		
		if (this._fetching) {
			console.log("fetching.....add to pending request.");
			var pItem = { req: request,
					      fHander: fetchHandler,
					      eHandler : errorHandler};
			this._pendingQueue.push(pItem);
			return;
		}
		
		if (!this._modelChanged) {
			console.log('local ===============');
            var localItems = this._getItems(request);
            if (localItems && localItems.length > 0) { 
            	fetchHandler(localItems, request);
		} else {
			    console.log([].length);
            	fetchHandler([], request);
            }
			return;
		}
        
		console.log('remote ============');
	        
		if (this.doneListener) {
			this._submission.removeEventListener("xforms-submit-done", 
			        this.doneListener, false);
		}
		
		if (this.errorListener) {
			this._submission.removeEventListener("xforms-submit-error", 
			        this.errorListener, false);
		}

		var self = this;
		this.doneListener = {
		    handleEvent: function(evt) { 
	            var items = self._getItems(request);
	            if (items && items.length > 0) {
	            	fetchHandler(items, request);
	            } else {
	            	fetchHandler([], request);
	            }
	            self._modelChanged = false;
	            self._fetching = false;
	            console.log("fetch done====================");
	            self._processPending();
	        }
		};
       
		this.errorListener = {
			handleEvent: function(evt) {
				errorHandler(null, request);
	            self._fetching = false;
	            console.log("fetch done====================");
            }
		};
		this._submission.addEventListener("xforms-submit-done",
		 		this.doneListener, false);
		this._submission.addEventListener("xforms-submit-error",
		 		this.errorListener, false);
		
		if (!this._callbackAdded) {
		    if(this.onSubmitDone) {
		        this._submission.addEventListener("xforms-submit-done",  
		                this.onSubmitDone, false);
		    }
		    if(this.onSubmitError) {
		        this._submission.addEventListener("xforms-submit-error", 
		                this.onSubmitError, false);
		    }
		    this._callbackAdded = true;
		}

		this._submit();
    },
	
	getFeatures: function(){
		//	summary: 
		//		See dojo.data.api.Read.getFeatures()
		return this._features; //Object
	},
	
	close: function(/*dojo.data.api.Request || keywordArgs || null */ request){
		//	summary: 
		//		See dojo.data.api.Read.close()
	},
	
	getLabel: function(/* item */ item){
		this._assertIsItem(item);

	},
		
	getLabelAttributes: function(/* item */ item){
		this._assertIsItem(item);		
	},

	
	/* 
	 * dojo.data.api.Write 
	 */
	newItem: function(/* object? */ keywordArgs){
		console.log("ModelStore.newItem()");
		this.onNew(null, null);
	},
	
	
	deleteItem: function(/* item */ item){
		this._assertIsItem(item);
		this.onDelete(item);
	},
	
	setValue: function(/* item */ item, /* attribute || string */ attribute, /* almost anything */ value){
		console.log("ModelStore.setValue()");
		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
        this._modelChanged = true;
		var element = item.element;
		var doc     = element.ownerDocument;
		var tagValueNode = doc.createTextNode(value);
		if (element.firstChild)
			element.replaceChild(tagValueNode, element.firstChild);
		else 
			element.appendChild(tagValueNode);
		console.log(xmlText(element));
		
		this.onSet(item, attribute, null, value);
	},
	
	setValues: function(/* item */ item, /* attribute || string */ attribute, /* array */ values){
		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
		
		this.onSet(item, attribute, null, values);
	},
	
	unsetAttribute: function(/* item */ item, /* attribute || string */ attribute){
		this._assertIsItem(item);
		this._assertIsAttribute(attribute);
		var element = item.element;		
	},

	save: function(/* object */ keywordArgs){
	},
	
	revert: function(){
	},
	
	isDirty: function(/* item */ item) {
	},
	
	getModelItem : function(expression) {
		var nodes = this._model.EvaluateXPath(expression, this._model.node).nodeSetValue();
		console.log(nodes.length);
		if (nodes.length > 0) {
		    return this._getItem(nodes[0]);
		}
		return null;	
	},

	getModelItems : function(expression) {
		return this._getItemsArray(expression);
	},

	/* 
	 * dojo.data.api.Notification 
	 */
	
	onSet: function(/* item */ item, 
			/*attribute-name-string*/ attribute, 
			/*object | array*/ oldValue,
			/*object | array*/ newValue){
		// summary: See dojo.data.api.Notification.onSet()		
		// No need to do anything. This method is here just so that the 
		// client code can connect observers to it.
	},
	
	onNew: function(/* item */ newItem, /*object?*/ parentInfo){
		// summary: See dojo.data.api.Notification.onNew()
		// No need to do anything. This method is here just so that the 
		// client code can connect observers to it. 
	},
	
	onDelete: function(/* item */ deletedItem){
		// summary: See dojo.data.api.Notification.onDelete()
		
		// No need to do anything. This method is here just so that the 
		// client code can connect observers to it. 
	},
	
	/*
	 *  Public interface for modelStore
	 */
	setSubmissionId: function(/* string */ id) {		
	    this._submission = dojo.byId(id);
	    this._modelChanged = true;
	},
	
	setCustomAttributes: function(/* Object */ attributes ) {
		this.itemAttrs = attributes;
	},
	
	_submit: function() {
		console.log('submit');
		this._fetching = true;
		var aEvent = document.createEvent("Events");
		aEvent.initEvent("xforms-submit", true, false);		
		// sub.dispatchEvent(...) doesn't work	
		FormsProcessor.dispatchEvent(this._submission, aEvent);
	},
	
	_getItems : function(request) {
		console.log(request.query.nodeset);
		
		var query = null;
		if(request){
			query = request.query;
		}
		return this._getItemsArray(query.nodeset, request.start, request.count);
	},
	
	_getItemsArray: function(expression, start, count) {
		var items = [];
		var nodes = 
			this._model.EvaluateXPath(expression, this._model.node).nodeSetValue();
		var i =0;
		var len = nodes.length;
		
		if(typeof(start) != "undefined" && start != null) {
			if (start > nodes.length)
				return items;				
			i = start;	
		}
						
		if(typeof(count) != "undefined" && count != null) {			
			if  (i + count < len) {
				len = i + count;
			}
		} 
		
		for(i = 0; i < len; i++){
			var node = nodes[i];
				
			if(node.nodeType != 1 /*ELEMENT_NODE*/){
				continue;
			}
	        var item = this._getItem(node);
	        items.push(item);	            
		}
		return items;
	},

	_getItem: function(element){
		return new dojoXForms.data.ModelItem(element, this); //object
	},	
	
	_processPending : function() {
		console.log("processPending")
		var pItem = this._pendingQueue.pop();
		console.log(pItem);
		while (pItem) {
			this._fetchItems(pItem.req, pItem.fHander,  pItem.eHander);
			pItem = this._pendingQueue.pop();
		}
	},
	
	_evaluateNodeset : function(doc, nodeset) {
		var ctx = new ExprContext(doc);
		var expression = xpathParse(nodeset);
		var e = expression.evaluate(ctx);
		return e.nodeSetValue();
	}
	
});

dojo.declare("dojoXForms.data.ModelItem", null, {
	constructor: function(element, store) {
		//	summary:
		//		Initialize with an XML element
		//	element:
		//		An XML element
		//	store:
		//		The containing store, if any.
		this.element = element;
		this.store = store;
	}, 
	//	summary:
	//		A data item of 'XmlStore'
	//	description:
	//		This class represents an item of 'XmlStore' holding an XML element.
	//		'element'
	//	element:
	//		An XML element

	toString: function() {
		//	summary:
		//		Return a value of the first text child of the element
		// 	returns:
		//		a value of the first text child of the element
		var str = "";
		if (this.element) {
			str = xmlText(this.element);
		}
		return str;	//String
	}

});

dojo.extend(dojoXForms.data.ModelStore,dojo.data.util.simpleFetch);