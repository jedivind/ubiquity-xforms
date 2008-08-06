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

/**
 * Implementation of YAHOO.widget.DataSource using XForms data model that return
 * query results.
 *  
 * @class DS_XFormsModel
 * @extends YAHOO.widget.DataSource
 * @requires 
 * @constructor
 * @param 
 * @param 
 * @param 
 */

YAHOO.widget.DS_XFormsModel = function(oArgs, oConfigs) {
    YAHOO.log("DS_XFormsModel", "info", "example");
    // Set any config params passed in to override defaults
    if(oConfigs && (oConfigs.constructor == Object)) {
        for(var sConfig in oConfigs) {
            this[sConfig] = oConfigs[sConfig];
        }
    }

    // Initialization sequence
    if (oArgs && (oArgs.constructor == Object)) {
      YAHOO.log(oArgs.id, "info", "example");
      if (!YAHOO.lang.isString(oArgs.id) ||
          !YAHOO.lang.isString(oArgs.submissionId)) {
          YAHOO.log("inavlid modelId", "error", "example");
          return;
          
      }
      this.modelId = oArgs.id;
      this.submissionId = oArgs.submissionId;
      this.onSubmitDone = oArgs.submitDone;
      this.onSubmitError = oArgs.submitError;
      this.itemAttrs = oArgs.itemXPathAttrs;      
    }
    
    this._model = YAHOO.util.Dom.get(this.modelId);
    this._submission = YAHOO.util.Dom.get(this.submissionId);
    YAHOO.log("DS_XFormsModel.init", "info", "example");
    this._init();
};

YAHOO.widget.DS_XFormsModel.prototype = new YAHOO.widget.DataSource();


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
YAHOO.widget.DS_XFormsModel.TYPE_JSON = 0;

/**
 * XML data type.
 *
 * @property TYPE_XML
 * @type Number
 * @static
 * @final
 */
YAHOO.widget.DS_XFormsModel.TYPE_XML = 1;

/**
 * Flat-file data type.
 *
 * @property TYPE_FLAT
 * @type Number
 * @static
 * @final
 */
YAHOO.widget.DS_XFormsModel.TYPE_FLAT = 2;

/**
 * Error message for XHR failure.
 *
 * @property ERROR_DATAXHR
 * @type String
 * @static
 * @final
 */
YAHOO.widget.DS_XFormsModel.ERROR_DATAXHR = "XHR response failed";

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
YAHOO.widget.DS_XFormsModel.prototype.onSubmitDone = null;

/**
 * 
 *
 * @property onSubmitError
 * @type Function
 * @default null
 */
YAHOO.widget.DS_XFormsModel.prototype.onSubmitError = null;

/**
 * 
 *
 * @property itemAttrs
 * @type Object
 * @default null
 */
YAHOO.widget.DS_XFormsModel.prototype.itemAttrs = null;


/**
 * 
 *
 * @property queryParam
 * @type String
 * @default null
 */
YAHOO.widget.DS_XFormsModel.prototype.queryParam = null;

/**
 * 
 *
 * @property resutItemset
 * @type String
 * @default ""
 */
YAHOO.widget.DS_XFormsModel.prototype.resutItemset = "";


/**
 * String after which to strip results. If the results from the XHR are sent
 * back as HTML, the gzip HTML comment appears at the end of the data and should
 * be ignored.
 *
 * @property responseStripAfter
 * @type String
 * @default "\n&#60;!-"
 */
YAHOO.widget.DS_XFormsModel.prototype.responseStripAfter = "\n<!-";

/////////////////////////////////////////////////////////////////////////////
//
// Public methods
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
YAHOO.widget.DS_XFormsModel.prototype.doQuery = function(oCallbackFn, sQuery, oParent) {
    YAHOO.log("query = " + sQuery, 'info', 'example');
    
    if (YAHOO.lang.isString(this.queryParam)) {
        var item = this.getModelItem(this.queryParam);
        this.setValue(item, "nodeValue", sQuery);
    }


    var oSelf = this;
    this.doneListener = {
        handleEvent: function(evt) { 
           
            YAHOO.log("=== Submit success, retrieve results " + oSelf.resutItemset, 'info', 'DS_XFormsModel');    
            var aResultItems = oSelf._getItemsArray(oSelf.resutItemset, 0, 10);
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
            oSelf._modelChanged = false;
            oSelf._fetching = false;
            
            // oSelf._processPending();
            oCallbackFn(sQuery, aResultItems, oParent);
        }
    };
   
    this.errorListener = {
        handleEvent: function(evt) {
            errorHandler(null, request);
            oSelf._fetching = false;
            // console.log("fetch done====================");
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
};

            

YAHOO.widget.DS_XFormsModel.prototype.setValue = function(/* item */ item,
                                                          /* attribute || string */ attribute,
                                                          /* almost anything */ value) {
    // this._assertIsItem(item);
    // this._assertIsAttribute(attribute);
    this._modelChanged = true;
    var element = item.element;
    var doc     = element.ownerDocument;
    var tagValueNode = doc.createTextNode(value);
    if (element.firstChild)
        element.replaceChild(tagValueNode, element.firstChild);
    else 
        element.appendChild(tagValueNode);
    // console.log(xmlText(element));
};

YAHOO.widget.DS_XFormsModel.prototype.getValue = function(/* item */ item, 
        /* attribute-name-string */ attribute,
        /* value? */ defaultValue){ 
    // this._assertIsItem(item);
    // this._assertIsAttribute(attribute);

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
};

YAHOO.widget.DS_XFormsModel.prototype.getModelItem = function(expression) {
    var nodes = this._model.EvaluateXPath(expression, this._model.node).nodeSetValue();

    if (nodes.length > 0) {
        return this._getItem(nodes[0]);
    }
    return null;    
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
* @type boolean
* @private
*/
YAHOO.widget.DS_XFormsModel.prototype._callbackAdded = false;

/**
* .
*
* @property _
* @type boolean
* @private
*/
YAHOO.widget.DS_XFormsModel.prototype._modelChanged = false;

/**
* .
*
* @property _
* @type boolean
* @private
*/
YAHOO.widget.DS_XFormsModel.prototype._fetching = false;

/**
* .
*
* @property _
* @type Array
* @private
*/
YAHOO.widget.DS_XFormsModel.prototype._newItems = [];

/**
* .
*
* @property _
* @type Array
* @private
*/
YAHOO.widget.DS_XFormsModel.prototype._deletedItems = [];

/**
* .
*
* @property _
* @type Array
* @private
*/
YAHOO.widget.DS_XFormsModel.prototype._modifiedItems = [];

/**
* .
*
* @property _
* @type Array
* @private
*/
YAHOO.widget.DS_XFormsModel.prototype._pendingQueue = [];

/////////////////////////////////////////////////////////////////////////////
//
//Private methods
//
/////////////////////////////////////////////////////////////////////////////

YAHOO.widget.DS_XFormsModel.prototype._submit = function() {
    YAHOO.log('submit', 'info', 'DS_XFormsModel');
    this._fetching = true;
    var aEvent = document.createEvent("Events");
    aEvent.initEvent("xforms-submit", true, false);     
    FormsProcessor.dispatchEvent(this._submission, aEvent);
};


YAHOO.widget.DS_XFormsModel.prototype._getItemsArray = function(expression, start, count) {
    var item = [];
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
        var item =[];
        item.unshift(this._getItem(node));
        item.unshift("");
        items.push(item);               
    }
    return items;
};


YAHOO.widget.DS_XFormsModel.prototype._getItem = function(element) {
    return new YAHOO.widget.DS_XFormsModelItem(element, this); //object
};

YAHOO.widget.DS_XFormsModel.prototype._processPending = function() {
    var pItem = this._pendingQueue.pop();
    //  console.log(pItem);
    while (pItem) {
        // this._fetchItems(pItem.req, pItem.fHander,  pItem.eHander);
        pItem = this._pendingQueue.pop();
    }
};

YAHOO.widget.DS_XFormsModel.prototype._evaluateNodeset = function(doc, nodeset) {
    var ctx = new ExprContext(doc);
    var expression = xpathParse(nodeset);
    var e = expression.evaluate(ctx);
    return e.nodeSetValue();
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

YAHOO.widget.DS_XFormsModelItem = function(element, store) {
    this.element = element;
    this.store = store;
};

YAHOO.widget.DS_XFormsModelItem.prototype.getValue = function(attribute) {
    var value = this.element.getAttribute(attribute);
    if (!value) {           
        var expression = this.store.itemAttrs[attribute];
        if (expression) {
            value = this.store._model
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
