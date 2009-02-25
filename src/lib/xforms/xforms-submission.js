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
};

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

submission.prototype.setHeader = function(header, value) {
    throw "submission::setHeader() has not been implemented";
};

submission.prototype.init = function() {
    throw "submission::init() has not been implemented";
};

submission.prototype.processResult = function(oResult, isFailure, 
                                              oObserver, oContext) {

    var sData, sReplace, sInstance, oInstance, oEvt, oNewDom, contentType = "", sTarget, oTargetContext, oTarget; 
    
    if (oObserver) {
        var oEvt = oObserver.ownerDocument.createEvent("Events");

        // Set context info properties common to both success and failure results.
        oEvt.context = {
            "resource-uri" : oResult.resourceURI,
            "response-status-code" : oResult.status,
            "response-reason-phrase" : oResult.statusText,
            "response-headers" : this.processResponseHeaders(oResult.responseHeaders)
        };

        if (isFailure) {
            // When the error response specifies an XML media type as defined by [RFC 3023],
            // the response body is parsed into an XML document and the root element of the
            // document is returned. If the parse fails, or if the error response specifies
            // a text media type (starting with text/), then the response body is returned
            // as a string. Otherwise, an empty string is returned. 
            oEvt.context["error-type"] = "resource-error";
            if (oResult.responseHeaders) {
                contentType = oResult.responseHeaders["Content-Type"];
            }
            if (contentType && !contentType.indexOf("text/")) {
                oEvt.context["response-body"] =  oResult.responseText;
            } else {
                try {
                    oEvt.context["response-body"] =  xmlParse(oResult.responseText);
                } catch (e) {
                    oEvt.context["response-body"] =  oResult.responseText;
                }
            }
			oEvt.initEvent("xforms-submit-error", true, false);
			FormsProcessor.dispatchEvent(oObserver, oEvt);
        } else {
            sData = oResult.responseText;

            // If the server returned a response body, process it according to the value of the
            // 'replace' attribute. If there is no response body, we still need to dispatch
            // xforms-submit-done with whatever context info we do have.

            if (sData) {
                // We now need to store the returned data. First find out what the
                // @replace value was set to.

                sReplace = oObserver.getAttribute("replace") || "all";

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

                    if (oResult.responseHeaders) {
                        contentType = oResult.responseHeaders["Content-Type"];
                    }
                    if (contentType && !contentType.indexOf("text/")) {
                        oEvt.context["error-type"] =  "resource-error";
                        oEvt.initEvent("xforms-submit-error", true, false);
                        FormsProcessor.dispatchEvent(oObserver, oEvt);
                        return;
                    } else {
                        try {
                            oNewDom = xmlParse(sData);
                        } catch (e) {
                            oEvt.context["error-type"] =  "parse-error";
                            oEvt.initEvent("xforms-submit-error", true, false);
                            FormsProcessor.dispatchEvent(oObserver, oEvt);
                            return;
                        }
                    }

                    // @replace="instance" causes the returned data to overwrite an
                    // instance. If no instance is specified then the instance to
                    // overwrite is the one submitted.
                    //
                    // The replacement target node may be specified by @target. The evaluation context
                    // for @target is the in-scope evaluation context for the submission element, except
                    // the context node is modified to be the document element of the instance identified by
                    // the instance attribute if it is specified.
                    sTarget = oObserver.getAttribute("target");
                    if (sTarget) {
                        oTarget = this.processTargetAttribute(sTarget, sInstance, oContext, oObserver, oEvt);
                        if (!oTarget) {
                            return;
                        } else {
                            oInstance = sInstance ? oContext.model.getInstanceDocument(sInstance).documentElement : null;
                            if (oTarget === oInstance) {
                                // Replacing entire instance.
                                oContext.model.replaceInstanceDocument(sInstance, oNewDom);
                            } else {
                                // Replacing a node in the instance.
                                oTarget.parentNode.replaceChild(oNewDom.documentElement, oTarget);
                            }
                        }
                    } else {
                        if (sInstance) {
                            oContext.model.replaceInstanceDocument(sInstance, oNewDom);
                        } else if (oObserver.srcInstance) {
                            __replaceInstanceDocument(oContext.model, oObserver.srcInstance, oNewDom);
                        } else {
                            debugger;
                            // don't know where to put it - first instance of first
                            // model?
                        }
                    }
                    break;

                case "text":
                    oObserver.ownerDocument.logger.log(
                            "@replace = 'text'", "submission");

                    // When @replace="text", the response data is encoded as text and replaces the
                    // content of the replacement target node. The default replacement target node is
                    // the document element node of the instance identified by the instance attribute,
                    // which is equal to the default instance of the model if not specified.
                    // 
                    // The replacement target node may be specified by @target. The evaluation context
                    // for @target is the in-scope evaluation context for the submission element, except
                    // the context node is modified to be the document element of the instance identified by
                    // the instance attribute if it is specified.
 
                    sInstance = oObserver.getAttribute("instance");
                    sTarget = oObserver.getAttribute("target");

                    if (sTarget) {
                        oTarget = this.processTargetAttribute(sTarget, sInstance, oContext, oObserver, oEvt);
                        if (!oTarget) {
                            return;
                        }
                    } else {
                        oTarget = oContext.node;
                    }

                    if (!oTarget || UX.isNodeReadonly(oTarget.parentNode)) {
                        oEvt.context["error-type"] =  "target-error";
                        oEvt.initEvent("xforms-submit-error", true, false);
                        FormsProcessor.dispatchEvent(oObserver, oEvt);
                        return;
                    } else {
                        oTarget.firstChild.nodeValue = sData;
                        oContext.model.flagRebuild();
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
            }
            oEvt.initEvent("xforms-submit-done", true, false);
            FormsProcessor.dispatchEvent(oObserver, oEvt);
        }
    }
};

submission.prototype.processResponseHeaders = function(oHeaders) {
  var xmlDoc, headerElt, nameElt, valueElt, name, value, responseHeaders = [ ];

  // Create a <header><name/><value/></header> node for each
  // response header from the server.
  for (name in oHeaders) {
      value = oHeaders[name];

      xmlDoc = new XDocument();
      headerElt = xmlDoc.createElement("header");
      nameElt = xmlDoc.createElement("name");
      nameElt.appendChild(xmlDoc.createTextNode(name));
      headerElt.appendChild(nameElt);
      valueElt = xmlDoc.createElement("value");
      valueElt.appendChild(xmlDoc.createTextNode(value));
      headerElt.appendChild(valueElt);

      responseHeaders.push(headerElt);
  }

  return responseHeaders;
}

submission.prototype.processTargetAttribute = function(sTarget, sInstance, oContext, oObserver, oEvt) {
    var oTarget = null, oTargetContext, oEvt;

    if (sTarget) {
        oTargetContext = sInstance ? oContext.model.getInstanceDocument(sInstance).documentElement : oContext;
        oTarget = oContext.model.EvaluateXPath(sTarget, oTargetContext).nodeSetValue()[0];
        if (!oTarget || oTarget.nodeType !== DOM_ELEMENT_NODE || UX.isNodeReadonly(oTarget.parentNode)) {
            oEvt.context["error-type"] = "target-error";
            oEvt.initEvent("xforms-submit-error", true, false);
            FormsProcessor.dispatchEvent(oObserver, oEvt);
        }
    }
    return oTarget;
}

/*
 * We give the submit function an object that contains all of the parameters.
 * This is also the object to which we want all of our events targetted.
 */
submission.prototype.submit = function(oSubmission) {
	var sResource = null;
    var oEvt = null;
    var ns = null;
    var instanceId = oSubmission.getAttribute("instance");
    var instance;
    var sMethod = null;
    var sMediatype = oSubmission.getAttribute("mediatype");
    var sEncoding = oSubmission.getAttribute("encoding");
    var sSerialisation = oSubmission.getAttribute("serialization");
    var oBody;
    var oContext;
    var bHasHeaders = false;
	var sReplace = null;
    var xmlDoc = new XDocument();
    var oSubmissionBody = xmlDoc.createTextNode("");
    var relevancePruning = Boolean(oSubmission.getAttribute("relevant") || (sSerialisation !== "none"));
    var validation = Boolean(oSubmission.getAttribute("validate") || (sSerialisation !== "none"));
    var submitDataList = [ ];
 
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

    var nTimeout = oSubmission.getAttribute("timeout");
    if (nTimeout === null) {
        nTimeout = 5000;
    }
    
    // Obtain the indication of the data to submit
    //
    oContext = oSubmission.getBoundNode();
    if (!oContext.model) {
        oContext = oSubmission.getEvaluationContext();
    }
 
    // xforms-submit step 2 test for empty submission data
    //
	if (!oContext.node) {
		oEvt = oSubmission.ownerDocument.createEvent("Events");
		oEvt.initEvent("xforms-submit-error", true, false);
		oEvt.context = {
			"error-type" : "no-data"
		};
		FormsProcessor.dispatchEvent(oSubmission, oEvt);
		return;
	}
    
	// Construct the list proxy nodes for the submit data.
	// Prune non-relevant nodes if submission relevant is true,
	// and issue error if resulting submit data list is empty (step 3)
	//
	submitDataList = this.constructSubmitDataList(oContext, relevancePruning);
	if (relevancePruning && submitDataList.length === 0) {
		oEvt = oSubmission.ownerDocument.createEvent("Events");
		oEvt.initEvent("xforms-submit-error", true, false);
		oEvt.context = {
			"error-type" : "no-data"
		};
		FormsProcessor.dispatchEvent(oSubmission, oEvt);
		return;
	}
    
	// Test validity of the submit data in proxy node list
	//
	if (validation && !this.validateSubmitDataList(submitDataList)) {
		oEvt = oSubmission.ownerDocument.createEvent("Events");
		oEvt.initEvent("xforms-submit-error", true, false);
		oEvt.context = {
			"error-type" : "validation-error"
		};
		FormsProcessor.dispatchEvent(oSubmission, oEvt);
		return;
	}
    
    // Evaluate @action, @resource and ./resource for submission URL
	//
	ns = NamespaceManager.getElementsByTagNameNS(oSubmission, "http://www.w3.org/2002/xforms", "resource");
    
	sResource = (ns && ns.length > 0) ? getElementValueOrContent(oContext, ns[0]) : null;
    
    sResource = sResource || oSubmission.getAttribute("resource") || oSubmission.getAttribute("action"); 
    
    // xforms-submit step 6 test for no resource specified
    //
    if (!sResource) {
		oEvt = oSubmission.ownerDocument.createEvent("Events");
		oEvt.initEvent("xforms-submit-error", true, false);
	    oEvt.context = {
	        "error-type" : "resource-error"
	    };
		FormsProcessor.dispatchEvent(oSubmission, oEvt);
		return;
	}

    // Process the instance attribute or use the default for instance replacement
    //	
    if (instanceId) {
        instance = oSubmission.ownerDocument.getElementById(instanceId);
        if (!instance || !NamespaceManager.compareFullName(instance, "instance", "http://www.w3.org/2002/xforms")) {
            UX.dispatchEvent(oSubmission, "xforms-binding-exception",  true, false, false);
            return;
        }
    } else if (oContext.node) {
        oSubmission.srcInstance = oContext.node.ownerDocument.XFormsInstance;
    }
        
    //
    // Evaluate method element
    // Method element takes precedence over method attribute
    //
    ns = NamespaceManager.getElementsByTagNameNS(oSubmission, "http://www.w3.org/2002/xforms", "method");  
      
    sMethod = (ns && ns.length > 0) ? getElementValueOrContent(oContext, ns[0]) : oSubmission.getAttribute("method") || "get";  
     
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
        
        //
        // build SOAP Header information
        //
        if (sMediatype) {
            this.setSOAPHeaders(oContext.node, sMediatype, sEncoding); 
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

    // Dispatch xforms-submit-serialize.
    // If the event context submission-body property string is empty, then no
    // operation is performed so that the submission will use the normal
    // serialization data. Otherwise, if the event context submission-body
    // property string is non-empty, then the serialization data for the
    // submission is set to be the content of the submission-body string.
    try {
        oEvt = oSubmission.ownerDocument.createEvent("Events"); 
        oEvt.initEvent("xforms-submit-serialize", true, false);
        oEvt.context = { "submission-body" : [oSubmissionBody] };
        FormsProcessor.dispatchEvent(oSubmission, oEvt);
        oBody = oSubmission.submissionBody[0].nodeValue || oBody;
    } catch (e) {
        oSubmission.ownerDocument.logger.log(
                "Error: " + e.description, "error");
    }

	bHasHeaders = (NamespaceManager.getElementsByTagNameNS(oSubmission, "http://www.w3.org/2002/xforms", "header").length > 0);
	sReplace = oSubmission.getAttribute("replace");

	if ((sMethod === "GET") && (!sReplace || sReplace === 'all') && !bHasHeaders && sSerialisation === "application/x-www-form-urlencoded") {
		var oForm = this.buildFormFromObject(oBody);
		oForm.action = sResource;
		oForm.method = sMethod.toLowerCase();
		document.body.appendChild(oForm);
		
		try {
			oForm.submit();
		} catch (e) {
			oEvt = oSubmission.ownerDocument.createEvent("Events");
			oEvt.initEvent("xforms-submit-error", true, false);
            oEvt.context = {
                "error-type" : "resource-error",
                "resource-uri" : sResource
            };
			FormsProcessor.dispatchEvent(oSubmission, oEvt);
		} finally {
			oForm.parentNode.removeChild(oForm);
		}
	} else {
		// Callback for asynchronous submission
		// [ISSUE] synchronous submissions need to do the request here without a
		// callback

		var oCallback = new callback(this, oSubmission, oContext);
		this.setHeaders(oContext.model, oSubmission);

		try {

			if ((sMethod === "GET" || sMethod === "DELETE") && (oBody || oBody !== "") && sSerialisation === "application/x-www-form-urlencoded") {
				sResource = sResource + "?" + oBody.toString();
				oBody = null;
			}
			
			return this.request(sMethod, sResource, oBody, nTimeout, oCallback);
		} catch (e) {
			oEvt = oSubmission.ownerDocument.createEvent("Events");
			oEvt.initEvent("xforms-submit-error", true, false);
            oEvt.context = {
                "error-type" : "resource-error",
                "resource-uri" : sResource
            };
			FormsProcessor.dispatchEvent(oSubmission, oEvt);
		}
	}
};

submission.prototype.constructSubmitDataList = function(oContext, relevancePruning) {
    // TBD - construct an array of ProxyNodes for all data nodes, or all that 
    // are relevant if relevancePruning is true
    //
    var rootProxyNode = getProxyNode(oContext.node);  
    return rootProxyNode.enabled.value ? [ rootProxyNode ] : [ ];
}

submission.prototype.validateSubmitDataList = function(submitDataList) {
    // TBD - test validity of each ProxyNode in the submitDataList
    // return false if any are invalid, or true if all are valid
    //
    return true;
}

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

submission.prototype.setHeaders = function(oModel, oSubmission) {
	var headers = {};
	var i, j;
	var elements;
	var nodelist;
	var name;
	var values;
	var value;
	
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
		this.setHeader(name, headers[name].join(' '));
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


submission.prototype.setSOAPHeaders = function(oContextNode, sMediatype, sEncoding) {
    var result;
    // match on content for "action=" in mediatype
    var matchAction = /action=([^\s\t\r\n\v\f;]+);?/;
    // match content for "charset=" in mediatype
    var matchCharset = /charset=([\w-]+);?/;
    var contentType = sMediatype;
    if (sMediatype) {
        if (oContextNode && NamespaceManager.getNamespaceURI(oContextNode) === "http://schemas.xmlsoap.org/soap/envelope/") {
	        //
	        // Determine if it is SOAP 1.1 or SOAP 1.2,
	        //  SOAP 1.1 creates a SOAPAction header,
	        //           adds "text/xml" to the content-type and
	        //           sets the charset depending on the charset value in the mediatype attribute or the encoding attribute	        
	        //
	        //  SOAP 1.2 takes the mediatype and puts it into the content-type
	        contentType = "text/xml";
	        
	        // 
	        // look for the SOAP action in the mediatype attribute
	        //
	        result = matchAction.exec(sMediatype);
	                        
	        if (result && result[1]) {
	            // SOAPAction found in mediatype
	            this.setHeader("SOAPAction", result[1]); 
	        }  
	                        
	        //
	        // look for the charset in the mediatype attribute
	        //                
	        result = matchCharset.exec(sMediatype); 
	        
	        if (result && result[1]) {
	            // charset found in mediatype
	            contentType += "; charset=" + result[1] + ";";
	        } else if (sEncoding) {
	            // if the charset is not found in the mediatype attribute, use the encoding attribute
	            contentType += "; charset=" + sEncoding + ";";
	        } else {
	            // charset default is UTF-8
	            contentType += "; charset=" + "UTF-8;";
	        }	        
        }
        
        this.setHeader("content-type", contentType);                       
    }
};

