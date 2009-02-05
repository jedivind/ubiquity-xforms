/*
 * Copyright © 2008-2009 Backplane Ltd.
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

/*
 * This class must be extended to suit the comms library
 * being used.
 */
function callback(oMediator, oObserver, oContext) {
    this.m_mediator = oMediator;
    this.m_observer = oObserver;
    this.m_context = oContext;
}

callback.prototype.processResult = function(data, isFailure) {
    this.m_mediator.processResult(data, isFailure, this.m_observer,
            this.m_context);
};

callback.prototype.success = function(o) {
    throw "callback::success() has not been implemented";
};

callback.prototype.failure = function(o) {
    throw "callback::failure() has not been implemented";
};

/*
 * [TODO] Use some kind of addFeature thing.
 */

function submission() {
}

document.submission = new submission();

/*
 * The comms library being used must override this.
 */

submission.prototype.request = function(sMethod, sAction, 
                                        sBody, nTimeout, oCallback) {
    throw "submission::request() has not been implemented";
};

submission.prototype.getConnection = function() {
    throw "submission::getConnection() has not been implemented";
};

submission.prototype.processResult = function(sData, isFailure, 
                                              oObserver, oContext) {
    
    if (oObserver) {
        var oEvt = oObserver.ownerDocument.createEvent("Events");
        var oNewDom = xmlParse(sData);

        if (isFailure) {
            alert("Transaction failed.  The error is: " + sData);
            oEvt.initEvent("xforms-submit-error", true, false);
            FormsProcessor.dispatchEvent(oObserver, oEvt);
        } else {
            // We now need to store the returned data. First find out what the
            // @replace value was set to.

            var sReplace = oObserver.getAttribute("replace");
            var sInstance = null;
            sReplace = (sReplace) ? sReplace : "all";

            switch (sReplace) {
            case "all":
                oObserver.ownerDocument.logger.log(
                        "@replace = 'all'", "submission");

                if (UX.isIE) {
                    document.write(sData);
                } else {
                    if (UX.isFF) {
                        // on FF, <?xml version="1.0"?> needs to be factored out
                        if (sData.indexOf("<?", 0) === 0) {
                            sData = sData.substr(sData.indexOf("?>") + 2);
                        }
                    }
                    document.documentElement.innerHTML = sData;
                }
                break;

            case "instance":
                oObserver.ownerDocument.logger.log(
                        "@replace = 'instance'", "submission");
                sInstance = oObserver.getAttribute("instance");

                // @replace="instance" causes the returned data to overwrite an
                // instance. If no instance is specified then the instance to
                // overwrite is the one submitted.
                if (sInstance) {
                    if (!oContext.model.replaceInstanceDocument(
                            sInstance, oNewDom)) {
                        throw "Instance '" + sInstance + "' not found.";
                    }
                } else if (oObserver.srcInstance) {
                    if (!__replaceInstanceDocument(oContext.model, 
                            oObserver.srcInstance, oNewDom)) {
                        throw "Failed to replace source instance";
                    }
                } else {
                    debugger;
                    // don't know where to put it - first instance of first
                    // model?
                }
                break;

            case "none":
                oObserver.ownerDocument.logger.log(
                        "@replace = 'none'", "submission");
                break;

            default:
                oObserver.ownerDocument.logger.log(
                        "Invalid replace value.", "submission");
                break;
            }

            oEvt.initEvent("xforms-submit-done", true, false);
            FormsProcessor.dispatchEvent(oObserver, oEvt);
        }
    }
};

/*
 * We give the submit function an object that contains all of the parameters.
 * This is also the object to which we want all of our events targetted.
 */
submission.prototype.submit = function(oSubmission) {
	var sResource = null;
    var oEvt = null;
    var ns = oSubmission.getElementsByTagName("extension");
    var oExtDom = null;
    var instanceId = oSubmission.getAttribute("instance");
    var instance;

    if (ns && ns.length > 0) {
        var oExt = ns[0];
        oExtDom = oExt.getDocument();
    }

    /*
     * XForms 1.0
     * 
     * var sVersion = this.element["version"]; var sIndent =
     * this.element["indent"]; var sMediaType = this.element["mediatype"]; var
     * sEncoding = this.element["encoding"]; var sOmitXmlDeclaration =
     * this.element["omit-xml-declaration"]; var sCdataSectionElements =
     * this.element["cdata-section-elements"]; var sReplace =
     * this.element["replace"]; var sInstance = this.element["instance"]; var
     * sSeparator = this.element["separator"]; var sIncludeNamespacePrefixes =
     * this.element["includenamespaceprefixes"];
     * 
     */

    /*
     * XForms 1.1
     * 
     * var sValidate = this.element["validate"); var sRelevant =
     * this.element["relevant");
     * 
     */

    var nTimeout = oSubmission.getAttribute("timeout");
    if (nTimeout === null) {
        nTimeout = 5000;
    }

    var sAction = oSubmission.getAttribute("action");
    var sMethod = oSubmission.getAttribute("method");
    var sSerialisation;
	var oBody;
    var oContext = oSubmission.getBoundNode();
	var bHasHeaders = false;
	var sReplace = null;
    
    if (instanceId) {
        instance = oSubmission.ownerDocument.getElementById(instanceId);
        if (!instance || !NamespaceManager.compareFullName(instance, "instance", "http://www.w3.org/2002/xforms")) {
            UX.dispatchEvent(oSubmission, "xforms-binding-exception",  true, false, false);
            return;
        }
    } else if (oContext.node) {
        oSubmission.srcInstance = oContext.node.ownerDocument.XFormsInstance;
    }
    
    if (!oContext.model) {
        oContext = oSubmission.getEvaluationContext();
    }
    // evaluate @action, @resource and ./resource for submission URL
	
	ns = NamespaceManager.getElementsByTagNameNS(oSubmission, "http://www.w3.org/2002/xforms", "resource");
    
	sResource = (ns && ns.length > 0) ? getElementValueOrContent(oContext, ns[0]) : null;
    
    sResource = sResource || oSubmission.getAttribute("resource"); 
    sAction = sResource || sAction;   
     
    if (oExtDom) {
        // See if there are any nodes for an action.
        var oRes = oContext.model.EvaluateXPath("/sub/action/part", {
            node :oExtDom,
            model :oContext.model,
            resolverElement :oExt
        });

        if (oRes && oRes.type == "node-set") {
            ns = oRes.nodeSetValue();

            // Loop through them, creating the action URL.
            // 
            // [ISSUE] We ignore any action placed on the submission element,
            // but why not concatenate? This is how fP behaves, so only change
            // this when fP is also changed.
            sAction = "";

            if (ns) {
                for ( var i = 0; i < ns.length; i++) {
                    sAction += getElementValueOrContent(oContext, ns[i]);
                }
                oSubmission.ownerDocument.logger.log(
                        "@action = '" + sAction + "'", "submission");
            }
        }
    }

    if (!sMethod) {
        throw "A submission method is required.";
    }    
    
    // ===== M E T H O D =========
    // The XForms method is mapped to the right method for the protocol.
    //
	// Note: @method as it is considered a token not a string.  As such it should be compared in a case-sensitive way.
    switch (sMethod) {
    case "get":
        sMethod = "GET";
        sSerialisation = "application/x-www-form-urlencoded";
        oBody = this.serialiseForAction(oContext);
        break;

    case "post":
        sMethod = "POST";
        sSerialisation = "application/xml";
        if (oContext.node) {
            oBody = xmlText(oContext.node);
        }
        break;

    case "put":
        sMethod = "PUT";
        sSerialisation = "application/xml";
        if (oContext.node) {
            oBody = xmlText(oContext.node);
        }
        break;
		
	case "delete":
		sMethod = "DELETE";
		sSerialisation = "application/x-www-form-urlencoded";
		oBody = this.serialiseForAction(oContext);
		break;

    default:
        /* the submission method being used needs to be implemented */
        debugger;
        oSubmission.ownerDocument.logger.log("Submission method '" +
                oSubmission.method + "' is not defined.", "error");
        break;
    }

    // Notify any listeners that we are about to begin the submission.
    try {
        oEvt = oSubmission.ownerDocument.createEvent("Events");
        oEvt.initEvent("needs-clarifying-xforms-submit-starting", 
                false, false, sMethod, sAction);
        FormsProcessor.dispatchEvent(oSubmission, oEvt);
    } catch (e) {
        oSubmission.ownerDocument.logger.log(
                "Error: " + e.description, "error");
    }

	bHasHeaders = (NamespaceManager.getElementsByTagNameNS(oSubmission, "http://www.w3.org/2002/xforms", "header").length > 0);
	sReplace = oSubmission.getAttribute("replace");

	if ((sMethod === "GET") && (!sReplace || sReplace === 'all') && !bHasHeaders && sSerialisation === "application/x-www-form-urlencoded") {
		var oForm = this.buildFormFromObject(oBody);
		oForm.action = sAction;
		oForm.method = sMethod.toLowerCase();
		document.body.appendChild(oForm);
		
		try {
			oForm.submit();
		} catch (e) {
			oEvt = oSubmission.ownerDocument.createEvent("Events");
			oEvt.initEvent("xforms-submit-error", true, false);
			FormsProcessor.dispatchEvent(oSubmission, oEvt);
		} finally {
			oForm.parentNode.removeChild(oForm);
		}
	} else {
		// Callback for asynchronous submission
		// [ISSUE] synchronous submissions need to do the request here without a
		// callback

		var oCallback = new callback(this, oSubmission, oContext);
		this.setHeaders(oContext.model, this.getConnection(), oExtDom, oSubmission);

		try {

			if ((sMethod === "GET" || sMethod === "DELETE") && (oBody || oBody !== "") && sSerialisation === "application/x-www-form-urlencoded") {
				sAction = sAction + "?" + oBody.toString();
				oBody = null;
			}
			
			return this.request(sMethod, sAction, oBody, nTimeout, oCallback);
		} catch (e) {
			oEvt = oSubmission.ownerDocument.createEvent("Events");
			oEvt.initEvent("xforms-submit-error", true, false);
			FormsProcessor.dispatchEvent(oSubmission, oEvt);
		}
	}
};

/*
 * [TODO] Change the name, and remove the separator stuff, since this is a
 * general function that turns a nodelist into a sequence of name/value pairs.
 */

submission.prototype.serialiseForAction = function(oContext) {
	var values = {};
	
	var nodeset;
	var i;
	var node;
	
    if (oContext.node) {
        // [ISSUE] This returns every text node.
        nodeset = oContext.model.EvaluateXPath(".|.//*", oContext);

		for ( i = 0; i < nodeset.value.length; ++i ) {
			node = nodeset.value[i];

            if (node && node.nodeType == DOM_ELEMENT_NODE) {
                if (node.firstChild && (node.childNodes.length == 1) &&
					(node.firstChild.nodeType == DOM_TEXT_NODE) && 
					node.firstChild.nodeValue) {
					
					values[String(node.nodeName).replace(/underscore/g, "_")] = node.firstChild.nodeValue;
                }
			}
		}
	}

	// Add a toString method to the dictionary so that the result can be concatenated with another string.
	values.toString = function() {
		var pairs = [];
		var key, value;
		
		for ( key in this ) {
			if (this.hasOwnProperty(key) && typeof(this[key]) !== "function") {
				pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(this[key]));
			}
		}
		
		return pairs.join("&");
	};

	return values;
};

/**
 * Builds an HTML form element from an object.
 */
submission.prototype.buildFormFromObject = function(object) {
	var form = document.createElement("form");
	var field = null;
	var key, value;
	
	for ( key in object ) {
		if ( object.hasOwnProperty(key) && typeof(object[key]) !== "function") {
			field = document.createElement("input");
			field.type = "hidden";
			field.name = key;
			field.value = object[key];
			
			form.appendChild(field);
		}
	}
	
	return form;
};

submission.prototype.setHeaders = function(oModel, connection, oExtdom, oSubmission) {
	var headers = {};
	
	var i, j;
	var nodelist;
	var elements;
	var path;
	var header;
	var name;
	var value;
	var values;
	
    if (oExtdom) {
		nodelist = oModel.EvaluateXPath("//headers/header", oExtdom);
		
		for ( i = 0; i < headers.value.length; ++i ) {
			path = nodelist.value[i].getAttribute("value");
			
			if (path) {
				header = oModel.EvaluateXPath(path, null);
				
				if (header) {
					value = "";
					switch (typeof (header.value)) {
					case "string":
						value = header.value;
						break;
					case "object":
						value = header.value[0].nodeValue;
						break;
					}
					name = nodelist.value[i].getAttribute("name");
					
					if (headers[name]) {
						headers[name].push(value);
					} else {
						headers[name] = [value];
					}
				}
			}
		}
	}
	
	elements = NamespaceManager.getElementsByTagNameNS(oSubmission, "http://www.w3.org/2002/xforms", "header");
	for ( i = 0; i < elements.length; ++i) {
		nodelist = NamespaceManager.getElementsByTagNameNS(elements[i], "http://www.w3.org/2002/xforms", "name");
		
		if (nodelist.length === 0) {
			document.logger.log("INFO: Ignoring xf:header without an xf:name element");
			continue;
		} else {
			name = nodelist[0].getValue();

			// Ignore headers that don't have a name
			if (!name || name.trim() === '') {
				document.logger.log("INFO: Ignoring xf:header whose xf:name is empty");
				continue;
			}
		}
		
		values = [];
		nodelist = NamespaceManager.getElementsByTagNameNS(elements[i], "http://www.w3.org/2002/xforms", "value");
		for ( j = 0; j < nodelist.length; ++j) {
			value = nodelist[j].getValue();
			if (value) {
				values.push(value);
			}
		}
		

		if (headers[name]) {
			headers[name].concat(values);
		} else {
			headers[name] = values;
		}
	}
	
	for ( name in headers ) {
		connection.initHeader(name, headers[name].join(' '));
	}
};

submission.prototype.buildGetUrl = function(action, params) {
    var url = action;

    if (params) {
        var sep = "?"; //should test that action doesn't already have this anywhere already.

        for ( var key in params) {
            if (params[key] === null) {
                continue;
            }
            url += sep + encodeURIComponent(key) + "=" +
                   encodeURIComponent(params[key]);
            sep = "&";
        }
    }//if ( there are parameters to add to the action )
    return url;
};//buildurl
