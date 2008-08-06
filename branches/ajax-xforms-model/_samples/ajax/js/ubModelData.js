// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity XForms module adds XForms 1.1 support to the Ubiquity
// library.
//
// Copyright (C) 2008 Backplane Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

if (typeof UBXFx === "undefined" || !UBXFx) {
    /**
     * The YAHOO global namespace object.  If YAHOO is already defined, the
     * existing YAHOO object will not be overwritten so that defined
     * namespaces are preserved.
     * @class YAHOO
     * @static
     */
    var UBXFx = { data:{ ModelData:{} } };
}

UBXFx.data.ModelData = function(oArgs, oConfigs) {
    //  summary:
    //      Constructor for the ModelData.  
    //  keywordParameters:
    //      An anonymous object to initialize properties.  It expects the following values:
    //      ...
    if(oArgs){
        this.modelId = oArgs.id;
        this.submissionId = oArgs.submissionId;
        this.onSubmitDone =  oArgs.submitDone;
        this.onSubmitError = oArgs.submitError;
        this.itemAttrs = oArgs.itemXPathAttrs;
        this.requestAttrs = oArgs.request;
    }
    
    // YUI specifics:
    // Set any config params passed in to override defaults
    if(oConfigs && (oConfigs.constructor == Object)) {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }
        
    this._elModel = YAHOO.util.Dom.get(this.modelId);
    this._elSubmission = YAHOO.util.Dom.get(this.submissionId);       
    
    if (UBXFx.data.ModelData.yuiEnabled) {
        this._init();
        this._setYuiCallbacks();
    }
    
    if (UBXFx.data.ModelData.dojoEnabled) {
        this._setDojoCallbacks();
        this._aFeatures = {'dojo.data.api.Read':true,
                'dojo.data.api.Write':true,
                'dojo.data.api.Notification': true};
    }
};

if (typeof YAHOO.widget.DataSource !== "undefined") {
    UBXFx.data.ModelData.yuiEnabled = true;
    UBXFx.data.ModelData.prototype = new YAHOO.widget.DataSource(); 
}

if (typeof dojo !== "undefined") {
    UBXFx.data.ModelData.dojoEnabled = true;
    dojo.require("dojo.data.util.simpleFetch");    
    dojo.extend(UBXFx.data.ModelData, dojo.data.util.simpleFetch);    
}

/////////////////////////////////////////////////////////////////////////////
//
// Public constants
//
/////////////////////////////////////////////////////////////////////////////

/**
 * JSON data type.
 *
 * @property TYPE_JSON
 * @type Number
 * @static
 * @final
 */
UBXFx.data.ModelData.TYPE_JSON = 0;

/**
 * XML data type.
 *
 * @property TYPE_XML
 * @type Number
 * @static
 * @final
 */
UBXFx.data.ModelData.TYPE_XML = 1;

/**
 * Flat-file data type.
 *
 * @property TYPE_FLAT
 * @type Number
 * @static
 * @final
 */
UBXFx.data.ModelData.TYPE_FLAT = 2;

/**
 * Error message for XHR failure.
 *
 * @property ERROR_DATAXHR
 * @type String
 * @static
 * @final
 */
UBXFx.data.ModelData.ERROR_DATAXHR = "XHR response failed";


/////////////////////////////////////////////////////////////////////////////
//
// Public member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
 * 
 *
 * @property onSubmitDone
 * @type Function
 * @default null
 */
UBXFx.data.ModelData.prototype.onSubmitDone = null;

/**
 * 
 *
 * @property onSubmitError
 * @type Function
 * @default null
 */
UBXFx.data.ModelData.prototype.onSubmitError = null;

/**
 * 
 *
 * @property itemAttrs
 * @type Object
 * @default null
 */
UBXFx.data.ModelData.prototype.itemAttrs = null;

/**
 * 
 *
 * @property resultRequest
 * @type Object
 * @default null
 */
UBXFx.data.ModelData.prototype.requestAttrs = null;


/////////////////////////////////////////////////////////////////////////////
//
//Public methods
//
/////////////////////////////////////////////////////////////////////////////

/**
* Queries the live data source defined by scriptURI for results. Results are
* passed back to a callback function.
*  
* @method doQuery
* @param oCallbackFn {HTMLFunction} Callback function defined by oParent object to which to return results.
* @param sQuery {String} Query string.
* @param oParent {Object} The object instance that has requested data.
*/
UBXFx.data.ModelData.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    YAHOO.log("query = " + sQuery, 'info', 'example');
     
    var queryParam = this.requestAttrs.query.param;
    if (YAHOO.lang.isString(queryParam)) {
        var item = this.getModelItem(queryParam);
        this.setValue(item, "nodeValue", sQuery);
    }

    this._oYuiCallback.oCallbackFn = oCallbackFn;
    this._oYuiCallback.sQuery = sQuery;
    this._oYuiCallback.oParent = oParent;

    var oDoneFn = this._oYuiCallback.oDoneListener; 
    var oErrorFn = this._oYuiCallback.oErrorListener  
    this._elSubmission.addEventListener("xforms-submit-done", oDoneFn, false);
    this._elSubmission.addEventListener("xforms-submit-error", oErrorFn, false);    
    this._submit();
};

UBXFx.data.ModelData.prototype.getModelItem = function(sExpression) {
    var elModel = this._elModel;
    var oNodes = elModel.EvaluateXPath(sExpression, elModel.node).nodeSetValue();

    if (oNodes.length > 0) {
        return this._getItem(oNodes[0]);
    }

    return null;    
};

/* 
 * dojo.data.api.Read 
 */

UBXFx.data.ModelData.prototype.getValue = function( /* item */ item, 
        /* attribute-name-string */ attribute, 
        /* value? */ defaultValue){
    this._assertIsItem(item);
    this._assertIsAttribute(attribute);    
    return item.getValue(attribute, defaultValue);
};

UBXFx.data.ModelData.prototype.getValues = function(/* item */ item,
        /* attribute-name-string */ attribute){
    this._assertIsItem(item);
    this._assertIsAttribute(attribute);
    throw new Error('Unimplemented API: UBXFx.data.ModelData.getValues');
};

UBXFx.data.ModelData.prototype.getAttributes = function(/* item */ item){
    this._assertIsItem(item);       
    return item.element.attributes;
};

UBXFx.data.ModelData.prototype.hasAttribute = function( /* item */ item,
        /* attribute-name-string */ attribute){
    this._assertIsItem(item);
    this._assertIsAttribute(attribute);
    return (this.itemXPathAttrs[attribute] !== undefined ||
            item.element.getAttribute(attribute) !== undefined);
};

UBXFx.data.ModelData.prototype.containsValue = function(/* item */ item,
        /* attribute-name-string */ attribute, 
        /* anything */ value){
    this._assertIsItem(item);
    this._assertIsAttribute(attribute);
    throw new Error('Unimplemented API: UBXFx.data.ModelData.containsValue');
};

UBXFx.data.ModelData.prototype.isItem = function(/* anything */ something){
    //      summary:
    //      Check whether the object is an item (XML element)
    //  item:
    //      An object to check
    //  returns:
    //      True if the object is an Model Item element, otherwise false
    if(something && something.element && something.store && something.store === this){
        return true; //boolean
    }
    return false; //boolean
};

UBXFx.data.ModelData.prototype.isItemLoaded = function(/* anything */ something){
    //  summary:
    //      Check whether the object is an item (XML element) and loaded
    //  item:
    //      An object to check
    //  returns:
    //      True if the object is an XML element, otherwise false
    return this.isItem(something); //boolean
};

UBXFx.data.ModelData.prototype.loadItem = function(/* object */ keywordArgs){
    //  summary:
    //      Load an model item (XML element)
    //  keywordArgs:
    //      object containing the args for loadItem.  See dojo.data.api.Read.loadItem() 
    if (!this.isItemLoaded(keywordArgs.item)) {
        throw new Error('Unimplemented API: UBXFx.data.ModelData.loadItem');
    }
};

UBXFx.data.ModelData.prototype.getFeatures = function(){
    //  summary: 
    //      See dojo.data.api.Read.getFeatures()
    return this._aFeatures; //Object
};

UBXFx.data.ModelData.prototype.close = function(/*dojo.data.api.Request || keywordArgs || null */ request){
    //  summary: 
    //      See dojo.data.api.Read.close()
    throw new Error('Unimplemented API: UBXFx.data.ModelData.close');
};

UBXFx.data.ModelData.prototype.getLabel = function(/* item */ item){
    //  summary: 
    //      See dojo.data.api.Read.getLabel()    
    throw new Error('Unimplemented API: UBXFx.data.ModelData.getLabel');
    return undefined;
};

UBXFx.data.ModelData.prototype.getLabelAttributes = function(/* item */ item){
    //  summary: 
    //      See dojo.data.api.Read.getLabelAttributes()    
    throw new Error('Unimplemented API: UBXFx.data.ModelData.getLabelAttributes');
    return undefined;
};

/* 
 * dojo.data.api.Write 
 */

UBXFx.data.ModelData.prototype.newItem = function(/* Object? */ keywordArgs, /*Object?*/ parentInfo){
    console.log("ModelStore.newItem()");
    this.onNew(null, null);    
};

UBXFx.data.ModelData.prototype.deleteItem = function(/* item */ item){
    this._assertIsItem(item);
    this.onDelete(item);
};

UBXFx.data.ModelData.prototype.setValue = function(/* item */ item,
        /* attribute || string */ attribute,
        /* almost anything */ value) {
    this._assertIsItem(item);
    this._assertIsAttribute(attribute);
    this._bModelChanged = true;
    var element = item.element;
    var doc = element.ownerDocument;
    var tagValueNode = doc.createTextNode(value);
    
    if (element.firstChild)
        element.replaceChild(tagValueNode, element.firstChild);
    else 
        element.appendChild(tagValueNode);
    // console.log(xmlText(element));

    this.onSet(item, attribute, null, value);
};

UBXFx.data.ModelData.prototype.setValues = function(/* item */ item,
        /* string */ attribute, 
        /* array */ values){
    this._assertIsItem(item);
    this._assertIsAttribute(attribute);
    
    this.onSet(item, attribute, null, values);
};

UBXFx.data.ModelData.prototype.unsetAttribute = function(   /* item */ item, 
        /* string */ attribute){
    this._assertIsItem(item);
    this._assertIsAttribute(attribute);
    var element = item.element;
    return false; // boolean
};

UBXFx.data.ModelData.prototype.save = function(/* object */ keywordArgs){
    //  summary: 
    //      See dojo.data.api.Write.save()    
    throw new Error('Unimplemented API: UBXFx.data.ModelData.save');
};

UBXFx.data.ModelData.prototype.revert = function(){
    //  summary: 
    //      See dojo.data.api.Write.revert()    
    throw new Error('Unimplemented API: UBXFx.data.ModelData.revert');
    return false; // boolean
};


UBXFx.data.ModelData.prototype.isDirty = function(/* item? */ item){
    //  summary: 
    //      See dojo.data.api.Write.isDirty()    
    throw new Error('Unimplemented API: UBXFx.data.ModelData.isDirty');
    return false; // boolean
};

/* 
 * dojo.data.api.Notification 
 */        
UBXFx.data.ModelData.prototype.onSet = function(/* item */ item, 
    /*attribute-name-string*/ attribute, 
    /*object | array*/ oldValue,
    /*object | array*/ newValue){
    // summary: See dojo.data.api.Notification.onSet()      
    // No need to do anything. This method is here just so that the 
     // client code can connect observers to it.
};

UBXFx.data.ModelData.prototype.onNew = function(/* item */ newItem, 
        /*object?*/ parentInfo){
    // summary: See dojo.data.api.Notification.onNew()
    // No need to do anything. This method is here just so that the 
    // client code can connect observers to it. 
};

UBXFx.data.ModelData.prototype.onDelete = function(/* item */ deletedItem){
    // summary: See dojo.data.api.Notification.onDelete()    
    // No need to do anything. This method is here just so that the 
    // client code can connect observers to it. 
};


/////////////////////////////////////////////////////////////////////////////
//
//Private member variables
//
/////////////////////////////////////////////////////////////////////////////

/**
* .
*
* @property _
* @type element
* @private
*/
UBXFx.data.ModelData.prototype._elModel = null;

/**
* .
*
* @property _
* @type element
* @private
*/
UBXFx.data.ModelData.prototype._elSubmission = null;

/**
* .
*
* @property _
* @type Object
* @private
*/
UBXFx.data.ModelData.prototype._oYuiCallback = null;

/**
* .
*
* @property _
* @type Object
* @private
*/
UBXFx.data.ModelData.prototype._oDojoCallback = null;

/**
* .
*
* @property _
* @type boolean
* @private
*/
UBXFx.data.ModelData.prototype._bCallbackAdded = false;

/**
* .
*
* @property _
* @type boolean
* @private
*/
UBXFx.data.ModelData.prototype._bModelChanged = false;

/**
* .
*
* @property _
* @type boolean
* @private
*/
UBXFx.data.ModelData.prototype._bFetching = false;

/**
* .
*
* @property _
* @type Array
* @private
*/
UBXFx.data.ModelData.prototype._aNewItems = [];

/**
* .
*
* @property _
* @type Array
* @private
*/
UBXFx.data.ModelData.prototype._aDeletedItems = [];

/**
* .
*
* @property _
* @type Array
* @private
*/
UBXFx.data.ModelData.prototype._aModifiedItems = [];

/**
* .
*
* @property _
* @type Array
* @private
*/
UBXFx.data.ModelData.prototype._aPendingQueue = [];

/**
* .
*
* @property _
* @type Array
* @private
*/
UBXFx.data.ModelData.prototype._aFeatures = []; 


/////////////////////////////////////////////////////////////////////////////
//
//Private methods
//
/////////////////////////////////////////////////////////////////////////////

UBXFx.data.ModelData.prototype._assertIsItem = function(/* item */ item){
    //  summary:
    //      This function tests whether the item passed in is indeed an item in the store.
    //  item: 
    //      The item to test for being contained by the store.
    if(!this.isItem(item)){ 
        throw new Error("UBXFx.data.ModelData: a function was passed an item argument that was not an item");
    }
};

UBXFx.data.ModelData.prototype._assertIsAttribute = function(/* attribute-name-string */ attribute){
    //  summary:
    //      This function tests whether the item passed in is indeed a valid 'attribute' like type for the store.
    //  attribute: 
    //      The attribute to test for being contained by the store.
    if(typeof attribute !== "string"){
        throw new Error("UBXFx.data.ModelData: a function was passed an attribute argument that was not an attribute name string");
    }
};

UBXFx.data.ModelData.prototype._fetchItems = function(request, fetchHandler, errorHandler) {
    console.log('fetch');
    console.log('start=' + request.start + ', total=' + request.count);


    if (this._bFetching) {
        var pItem = { req: request,
                      fHander: fetchHandler,
                      eHandler : errorHandler };
        console.log("fetching.....add to pending request.");
        this._aPendingQueue.push(pItem);
        return;
    }
    
    if (!this._bModelChanged) {
        console.log('local ===============');
        var localItems = this._getItems(request);
        if (localItems && localItems.length > 0) {
            console.log(localItems.length);
            fetchHandler(localItems, request);
        } else {
            console.log([].length);
            fetchHandler([], request);
        }
        return;
    }
    
    this._oDojoCallback.oRequest = request;
    this._oDojoCallback.oFetchFn = fetchHandler;
    this._oDojoCallback.oErrorFn = errorHandler;  
    console.log('remote ============');    
    this._submit();
};

UBXFx.data.ModelData.prototype._setYuiCallbacks = function() {
    var oSelf = this;
    
    var oCallback = {
            oDoneListener: {
                handleEvent: function(evt) {
                    // No callback function
                    if (!oSelf._oYuiCallback.oCallbackFn)
                        return;
                    
                    var sQuery = oSelf._oYuiCallback.sQuery;
                    var oParent = oSelf._oYuiCallback.oParent;
                    var oCallbackFn = oSelf._oYuiCallback.oCallbackFn;
                    var oRequest = oSelf.requestAttrs;
                                                
                    YAHOO.log("=== Submit success, retrieve results " + oRequest.query.result, 'info', 'DS_XFormsModel');    
                    var aResultItems = oSelf._getItemsArray(
                            oRequest.query.result, 
                            oRequest.start, 
                            oRequest.page, 
                            true);
                    YAHOO.log('Returned ' + aResultItems.length, 'info', 'DS_XFormsModel');
                    var resultObj = {};                    
                    resultObj.query = sQuery;
                    resultObj.results = aResultItems;
                    
                    if (aResultItems && aResultItems.length > 0) {
                        oSelf.getResultsEvent.fire(oSelf, oParent, sQuery, aResultItems);                
                        oSelf._addCacheElem(resultObj);                
                    } else {
                        YAHOO.log('Result empty', 'info', 'example');                
                    }
                    oSelf._bModelChanged = false;
                    oSelf._bFetching = false;
                    
                    //  oSelf._processPending();
                    oCallbackFn(sQuery, aResultItems, oParent);
                    console.log("processDone");
                }                
            },
            oErrorListener: {
                handleEvent: function(evt) {
                    errorHandler(null, request);
                    oSelf._bFetching = false;
                }
            },
            oCallbackFn : null,
            sQuery: null,
            oParent: null
        };
    this._oYuiCallback = oCallback;
};

UBXFx.data.ModelData.prototype._setDojoCallbacks = function() {
    var oSelf = this;
    
    var oCallback = {
        oDoneListener: {
            handleEvent: function(evt) {
                console.log('dojo CB');
                var oRequest  = oSelf._oDojoCallback.oRequest;
                var oFetchFn  = oSelf._oDojoCallback.oFetchFn;
                
                var aItems = oSelf._getItems(oRequest);
                
                if (aItems && aItems.length > 0) {
                    oFetchFn(aItems, oRequest);
                } else {
                    oFetchFn([], oRequest);
                }
                oSelf._bModelChanged = false;
                oSelf._bFetching = false;
                console.log("fetch done====================");
                oSelf._processPending();
            }
        },
        oErrorListener: {
            handleEvent: function(evt) {
                var oRequest = oSelf._oDojoCallback.oRequest;
                var oErrorFn  = oSelf._oDojoCallback.oErrorFn;
                oErrorFn(null, oRequest);
                oSelf._bFetching = false;
                console.log("fetch done====================");
            }
        },
        oRequest: null, 
        oFetchFn: null,
        oErrorFn: null            
    };
    this._oDojoCallback = oCallback;    
};


UBXFx.data.ModelData.prototype._submit = function() {
    YAHOO.log('submit', 'info', 'DS_XFormsModel');

    var elSubmission = this._elSubmission;
    
    if (!elSubmission) {        
        return; //Error
    }
        
    if (!this._bCallbackAdded) {
        var oYuiCB = this._oYuiCallback;    
        if (oYuiCB && oYuiCB.oCallbackFn) {        
            elSubmission.addEventListener("xforms-submit-done",  
                    oYuiCB.oDoneListener, false);
            elSubmission.addEventListener("xforms-submit-error",  
                    oYuiCB.oErrorListener, false);        
        }
        
        var oDojoCB = this._oDojoCallback;    
        if (oDojoCB && oDojoCB.oFetchFn) {        
            elSubmission.addEventListener("xforms-submit-done",  
                    oDojoCB.oDoneListener, false);
            elSubmission.addEventListener("xforms-submit-error",  
                    oDojoCB.oErrorListener, false);        
        }

        if(this.onSubmitDone) {
            elSubmission.addEventListener("xforms-submit-done",  
                this.onSubmitDone, false);
        }
        if(this.onSubmitError) {
            elSubmission.addEventListener("xforms-submit-error", 
                this.onSubmitError, false);
        }
        this._bCallbackAdded = true;
    }
    
    this._bFetching = true;
    var oEvent = document.createEvent("Events");
    oEvent.initEvent("xforms-submit", true, false);     
    FormsProcessor.dispatchEvent(elSubmission, oEvent);
};

UBXFx.data.ModelData.prototype._getItems = function(request) {
    console.log(request.query.result);
    
    var query = null;
    if(request){
        query = request.query;
    }
    return this._getItemsArray(query.result, request.start, request.count);
};


UBXFx.data.ModelData.prototype._getItemsArray = function(expression, start, count, bYUI) {
    var item = [];
    var items = [];
    var elModel = this._elModel;
    var nodes = elModel.EvaluateXPath(expression, elModel.node).nodeSetValue();
    var i = 0;
    var total = nodes.length;
    var len   = total;
    
    if(typeof(start) !== "undefined" && start !== null) {
        if (start >= total) { return items; }        
        i = start;
    }

    if(typeof(count) !== "undefined" && count !== null) {
        if ((i + count - 1) < total) {
            len = i + count;
        }
    }    

    console.log("i =" + i + " count="+ len + " total="+ total);
    for(j = i; j < len; j++){
        var node = nodes[j];

        if(node.nodeType != 1 /*ELEMENT_NODE*/){
            continue;
        }

        if (bYUI) {
            var item =[];
            item.unshift(this._getItem(node));
            item.unshift("");
            items.push(item);
        } else {
            var item = this._getItem(node);
            items.push(item);               
        }
    }
    return items;
};


UBXFx.data.ModelData.prototype._getItem = function(elNode) {
    return new UBXFx.data.ModelDataItem(elNode, this); //object
};

UBXFx.data.ModelData.prototype._processPending = function() {
    console.log("processPending");
    var pItem = this._aPendingQueue.pop();
    console.log(pItem);
    while (pItem) {
        this._fetchItems(pItem.req, pItem.fHander,  pItem.eHander);
        pItem = this._aPendingQueue.pop();
    }
};

UBXFx.data.ModelData.prototype._evaluateNodeset = function(elDoc, sNodeset) {
    var oCtx = new ExprContext(elDoc);
    var oExpression = xpathParse(sNodeset);
    var oRes = oEexpression.evaluate(ctx);
    return oRes.nodeSetValue();
}; 


/**
* 
*  
* @class DS_XFormsModelItem
* @extends 
* @requires 
* @constructor
* @param 
* @param 
* @param 
*/

UBXFx.data.ModelDataItem = function(element, store) {
    this.element = element;
    this.store = store;
};

UBXFx.data.ModelDataItem.prototype.getValue = function(attribute, defaultValue) {
    var value = this.element.getAttribute(attribute);
    if (!value) {           
        var expression = this.store.itemAttrs[attribute];
        if (expression) {
            value = this.store._elModel
                .EvaluateXPath(expression, this.element).stringValue();
        }
    }
    
    if (!value) {      
        if (typeof(defaultValue) != "undefined" && defaultValue != null )
            value = defaultValue;
        else 
            value = undefined;
    }
    return value;
};
