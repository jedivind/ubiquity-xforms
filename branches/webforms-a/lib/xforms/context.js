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

function Context(elmnt) {
    this.element = elmnt;
    this.m_context = null;
    this.m_arrNodes = null;
    this.m_model = null;
    this.m_proxy = null;
}


Context.prototype.unwire = function() {
    this.m_context = null;
    this.m_arrNodes = null;
};


// TODO: rewrite these functions to have more objectiness,
// Originally written to remove an amount of stuff from the .htc
// so just calls equivalent friend function with pThis.
// This is no longer needed or desired, with the advent of the decorator stuff.

/*
 * Return the evaluation context of the element.
 */
Context.prototype.getEvaluationContext = function(nOrdinal) {
    return _getEvaluationContext(this, nOrdinal);
};


/*
 * If an element doesn't have an evaluation context then we use the parent's.
 */
Context.prototype.getParentEvaluationContext = function(nOrdinal) {
    return _getParentEvaluationContext(this, nOrdinal);
};


/*
 * Get the node that this element is bound to.
 */
Context.prototype.getBoundNode = function(nOrdinal) {
    return _getBoundNode(this, nOrdinal);
};


// Friend functions:
function _getEvaluationContext(pThis, nOrdinal) {    

    var oRet = {
            model :null,
            node :null
        };

    if (!nOrdinal || isNaN(nOrdinal)) {
        nOrdinal = 1;
    }

    if (pThis.m_context && nOrdinal === 1) {
        return { 
            model : pThis.m_context.model,
            node  : pThis.m_context.node 
        };
    } 
    
    if (pThis.m_arrNodes) {
        return { 
            model : pThis.m_model,                 
            node  : pThis.m_arrNodes[nOrdinal - 1] 
        };
    }

    var oElement = pThis.element;
    var oDocument = oElement.ownerDocument;

    // If we have a bind attribute then use it to find the model 
    // and evaluation context.
    var sBindID = oElement.getAttribute("bind");
    var oBind = oDocument.getElementById(sBindID);

    if (sBindID) {
        if (oBind && oBind.ownerModel && oBind.boundNodeSet) {
            oRet.model = oBind.ownerModel;
            oRet.node  = oBind.boundNodeSet;
        } else {
            // Dispatch xforms-binding-exception if bind is not resolved 
            UX.dispatchEvent(oElement, "xforms-binding-exception", 
                    false, true, true);
        }
        return oRet;
    }
        
    // If there is a model attribute, or the element *is* a model
    // then subject to further checks, the evaluation context
    // may be retrieved from the model itself.
    var sModelId = oElement.getAttribute("model");
        
    if (sModelId) {
        var oModel = oDocument.getElementById(sModelId);
        
        if (oModel && oModel.getInstanceDocument) {
            // Having fetched a model node which corresponds to the given @model IDREF
            // Find the model to which the parent element is bound.
            var oContextModel = getModelFor(oElement.parentNode);
            
            if (oContextModel === oModel) {
                // In the case that the parent's model and the model fetched from the @model IDREF
                // are identical, the evaluation context for pThis node is the context gleaned
                // from its position within the document, to wit, the same context as though it 
                // had no model attribute at all.
                oRet = _getParentEvaluationContext(pThis);
            } else {
                // Where the above clause is false, i.e. a disparity exists between the model to which 
                // the parent node is bound, and the model to which pThis node is bound, then pThis node is
                // not evaluated in the context of the parent node, but is evaluated in the default context for
                // the model whose id matches the IDREF given in pThis element's model attribute.
                oRet = oModel.getEvaluationContext();
            }        
        } else {
            // Dispatch xforms-binding-exception if model is not resolved
            UX.dispatchEvent(oElement, "xforms-binding-exception",
                    false, true, true);
        }
    } else {
        //Otherwise use the parent's evaluation context.
        oRet = _getParentEvaluationContext(pThis);
    }
    
    pThis.m_context = {
        model :oRet.model,
        node : oRet.node
    };
    return oRet;
}


function _getParentEvaluationContext(pThis, nOrdinal) {
    var oRet = {
        model :null,
        node :null
    };
    var oElement = pThis.element
    var oParent  = oElement.parentNode;
    var oRoot    = oElement.ownerDocument.documentElement;
    
    if (!nOrdinal || isNaN(nOrdinal)) {
        var nOrdinal = Number(oElement.getAttribute("ordinal"));
        if (!nOrdinal || isNaN(nOrdinal)) {
            nOrdinal = 1;
        }
    }
    
    while (oParent && oParent !== oRoot) {
        if (oParent.getBoundNode) {            
            oRet = oParent.getBoundNode(nOrdinal);
            if (oRet && (oRet.model || oRet.node)) {
             // Now that a real context has been found, leave the loop
                break;
            }
        }
        // Although recursion would be the more beauteous solution here, 
        // invoking it at this point leads inexorably to a stack overflow
        // therefore, the less elegant solution of stepping round to the 
        // next iteration of the loop is employed. 
        oParent = oParent.parentNode;
    }

    // If we don't get a context then we must be the
    // highest element, so we use the evaluation context
    // of the first model.     
    if (!oParent || oRoot === oParent ) {
        if (!document.defaultModel) {
            var models = NamespaceManager.getElementsByTagNameNS(oRoot, 
                            "http://www.w3.org/2002/xforms", "model");
            if (models && models.length > 0) {
                document.defaultModel = models[0];
            } else {
                // TODO: Streamlined syntax - No model in document, generate a default model
                oRet.model = null;
                oRer.node  = null;
                return oRet;
            }
        }
        oRet = document.defaultModel.getEvaluationContext();
    }  
    return oRet;
}


function _getBoundNode(pThis, nOrdinal) {
    var oProxy = pThis.m_proxy;
    var oElement = pThis.element;
    var sBindId  = oElement.getAttribute("bind");
    var oRet = {
            model : null,
            node  : null
        };
    var i = 0;
    var oRefNode = null;
    var oInstDoc = null;
    
    if (!nOrdinal || isNaN(nOrdinal)) {
        nOrdinal = 1;
    }
    
    /*
     * If we have a proxy node (and not a proxy expression) then use that.
     */
    if (oProxy && !oProxy.m_xpath) {
        
        if (!pThis.m_model) {
            pThis.m_model = _getEvaluationContext(pThis).m_model;
        }
        return { model : pThis.m_model, 
                 node  : oProxy };
    }
    
    if (NamespaceManager.getLowerCaseLocalName(pThis) === "model") {
        return pThis.getEvaluationContext();
    }

    // Bind has the highest priority - see:
    // http://www.w3.org/TR/2006/REC-xforms-20060314/slice3.html#structure-attrs-single-node
    // http://www.w3.org/TR/2006/REC-xforms-20060314/slice3.html#structure-attrs-nodeset
    
    if (sBindId) {
        if (!pThis.m_arrNodes) { 
            var oBind = oElement.ownerDocument.getElementById(sBindId);
            
            if (!oBind) {
                // Dispatch xforms-binding-exception if bind is not resolved 
                UX.dispatchEvent(oElement, 
                        "xforms-binding-exception", false, true, true);
                return oRet;
            }            
            pThis.m_model    = oBind["ownerModel"];
            pThis.m_arrNodes = oBind["boundNodeSet"];
        }
        oRet.model = pThis.m_model;        
        
        i = nOrdinal - 1;
        if (pThis.m_arrNodes && 
            pThis.m_arrNodes.length > i) {
            oRet.node = pThis.m_arrNodes[i]
        }        
        return oRet;
    }

    var sRef = oElement.getAttribute("ref");
    var sNodeset = oElement.getAttribute("nodeset");
    var sName = WebFormsAProcessor.getAttribute(oElement, "name");

    if (!sRef && !sNodeset && !sName) {
        // Return if no ref | nodeset | name to evaluate
        return oRet;
    }

    // Get the evaluation context, and save the model value.
    oRet = _getEvaluationContext(pThis);
    
    // if no model found - this is possible if user reference to a non-existing model
    // not possible after we added the code to create a lazy model by default
    // but we will check for it anyway.
    if (!oRet.model) {
        return oRet;
    }
    
    pThis.m_model = oRet.model;
    
    if (sRef && nOrdinal == 1) {        
        var oRefNode = 
            getFirstNode(pThis.m_model.EvaluateXPath(sRef, oRet.node));

        if (!oRefNode) {
            // Lazy authoring, 
            // get the default instance
            oInstDoc = _getDefaultInstanceDocument(pThis.m_model);
            
            if (oInstDoc) {
                // Actually we need to check for the QName is valid  but
                // it seems that createElement will accept any QName (valid or not)                
                oRefNode = oInstDoc.createElement(sRef);
                
                if (oRefNode) {
                    oInstDoc.documentElement.appendChild(oRefNode);
                } 
                // If we created the node from lazy authoring, we need to verify 
                // that it it is actually created properly
                oRefNode = 
                    getFirstNode(pThis.m_model.EvaluateXPath(sRef, oRet.node));
                
                // Form controls are considered to be non-relevant if any of the 
                // following apply:
                // the Single Node Binding is expressed and resolves to empty nodeset
                // so oRefNode is null if EvaluateXPath is unresolved.
            }
        }
        oRet.node = oRefNode;
    } else if (sNodeset) {
        
        if (!pThis.m_arrNodes) {            
            pThis.m_arrNodes = 
                pThis.m_model.EvaluateXPath(sNodeset, oRet.node).value;
        }
        oRet.node = pThis.m_arrNodes[nOrdinal - 1];
    } else if (sName) {
        // WebForms-A
        oRet.node = WebFormsAProcessor.processElement(
                pThis.m_model, oRet.node, oElement, sName);
    }
    return oRet;
}


function _getDefaultInstanceDocument(oModel) {
    var oInstDoc = null;
    var instanceNode = null;
    
    try {
        // try to get the default instance document,
        // if no default document an exception is throw.
        oInstDoc = oModel.getInstanceDocument();
        return oInstDoc;
    } catch (e) { }
    
    var namespaceURI = "http://www.w3.org/2002/xforms";
    // Create a default instance 
    if (UX.isXHTML) {
        var instanceRoot = document.createElementNS("instanceData", "");
        instanceNode = document.createElementNS("instance", namespaceURI);
        instanceNode.appendChild(instanceRoot);
     } else {
        var sPrefix = NamespaceManager.getOutputPrefixesFromURI(namespaceURI)[0];
        instanceNode = document.createElement(sPrefix + ":" + "instance");
        instanceNode.innerHTML = "<instanceData xmlns='' ></instanceData>";
     }

    oModel.appendChild(instanceNode);
    return oModel.getInstanceDocument();
}


/*
 *  WebFormsAProcessor
 */

WebFormsAProcessor = {    
    /**
     @description namespacceURI for WebForms-A
     @type String
     */
    nsURI : "http://www.w3.org/TR/webforms-a",
    
    /**
    @description default prefix for WebForms-A
    @type String
    */
    defaultPrefix : "wfa:",
        
    /**
    Get the attribute value for an WebForms-A's attribute.
    Since WebForms-A can be part of a HTML document without any namespace declaration,
    We need to try to get the attribute with the "wfa:" prefix if failed to retrieve the
    attribute vale via getAttributeNS     
    @param {Object} Element to get attribute from   
    @param {String} Attribute name
    @returns String, Attribute Value 
    @throws 
    */    
    getAttribute : function(oElement, sAttributeName) { 
        // First try to get the name with WebForms-A namespaceURI
        var sAttrValue = 
            NamespaceManager.getAttributeNS(oElement, sAttributeName, this.nsURI);
        
        if (!sAttrValue) {
            // if no namespaceURI.. in HTML just use prefix wfa: + attributeName         
            sAttrValue = oElement.getAttribute(this.defaultPrefix + sAttributeName);
        }    
       
        return sAttrValue;
    },

    /**
    Process WebForms-A element, create reference node and node value in an instance
    and create bind for the control.
    @param {Object} Model node of the evaluation context
    @param {Object} Context node of the evaluation context
    @param {Object} Control's DOM Node 
    @param {String} Name atrribute of the control
    @returns Object Reference node of the binded control   
    @throws n/a
    */    
    processElement : function(oModel, oContextNode, oElement, sName) {
        var sValue, oValueNode, oParent;
        var oRefNode = null;
        
        var oEvalResult = oModel.EvaluateXPath(sName, oContextNode);
        if (oEvalResult) {
            oRefNode = getFirstNode(oEvalResult);
        }
        var oInstDoc = _getDefaultInstanceDocument(oModel);        

        if (!oRefNode && oInstDoc) {
            oRefNode = oInstDoc.createElement(sName);
            sValue = this.getAttribute(oElement, "value");
                
            if (sValue && sValue.length !== 0) {
                oValueNode = oInstDoc.createTextNode(sValue);
                if (oValueNode) {
                    oRefNode.appendChild(oValueNode);
                }
            } 
            oParent = oContextNode ? oContextNode : oInstDoc.documentElement;
            oParent.appendChild(oRefNode);
        }
        
        if (oElement["bindCreated"] === undefined) {
            this._createBind(oModel, oElement, oRefNode);
            oElement["bindCreated"] = true;
        }
        
        return oRefNode;
    },
    
    /**
    Create corresponding bind from WebForms-A control's constraint attributes
    (datatype, calculate, constraint, relevant, readonly, required)    
    @param {Object} Model node of the evaluation context
    @param {Object} Context node of the evaluation context
    @param {Object} Control's DOM Node 
    @returns n/a 
    @throws n/a
    */    
    _createBind : function(oModel, oElement, oRefNode) {
        var sDatatype, sCalculate, sConstraint;        
        var sRelevant, sReadonly, sRequired, sNodeset;
        var oBind = null;
        var oContextBind = null;
        
        if (!oModel || !oElement || !oRefNode) {       
            return;
        }
        
        sDatatype   = this.getAttribute(oElement, "datatype");         
        sCalculate  = this.getAttribute(oElement, "calculate");
        sConstraint = this.getAttribute(oElement, "constraint");
        sRelevant   = this.getAttribute(oElement, "relevant");
        sReadonly   = this.getAttribute(oElement, "readonly");
        sRequired   = this.getAttribute(oElement, "required");
        
        if (!sDatatype && !sCalculate && !sConstraint && 
            !sRelevant && !sReadonly && !sRequired) {
            return;
        }
        
        oBind = UX.createElementNS(oElement,
                "bind", "http://www.w3.org/2002/xforms");        

        sNodeset = this._getNodeset(oRefNode, 
                oRefNode.ownerDocument.documentElement);

        if (!oBind || !sNodeset) {
            return;
        }        
        oBind.setAttribute("nodeset", sNodeset);
        
        oContextBind = UX.createElementNS(oElement,
                "bind", "http://www.w3.org/2002/xforms");
        oContextBind.setAttribute("context", "..");
        oBind.appendChild(oContextBind);
        
        if (sDatatype &&  !oElement["yuiDate"]) {
            // TODO: check for vaild data type
            // Need to recreate? special control such as date.
            var sType = "xsd:" +  sDatatype;
            oBind.setAttribute("type", sType);
            
            if (sType === "xsd:date") {
                var oClonedNode = oElement.cloneNode(true);
                oClonedNode.setAttribute("datatype", "xf:date");
                oElement.parentNode.replaceChild(oClonedNode, oElement);
                oElement = oClonedNode;
                oElement["yuiDate"] = true;
            }
        }

        if (sCalculate) {
            oContextBind.setAttribute("calculate", sCalculate);
        }

        if (sConstraint) {
            // TODO: resolve context
            oBind.setAttribute("constraint", sConstraint);
        }

        if (sRelevant) {
            // TODO: resolve context
            oContextBind.setAttribute("relevant", sRelevant);
        }

        if (sReadonly) {
            oContextBind.setAttribute("readonly", 
                    ((sReadonly != "false") ? "true" : "false"));
        }

        if (sRequired) {
            oContextBind.setAttribute("required", 
                    ((sRequired != "false") ? "true()" : "false()"));
        }
        oModel.appendChild(oBind);
     },

    /**
    Determine the XPath expression of the nodeset by traversing the instance,
    this method is called recusively. 
    @param {Object} prefix The prefix used to select the given URI
    @param {Object} uri  The URI to which the prefix is to be bound
    @returns String, XPath expression of current refernce 
    @throws 
    */
    _getNodeset : function(oElem, oDocRoot) {       
        
        if (!oElem || oElem === oDocRoot) {
            return null;
        } else {
            var sParentRef = this._getNodeset(oElem.parentNode, oDocRoot);
            if (sParentRef) {
                sParentRef += "/";          
            } else {
                sParentRef = "";
            }                   
            return  sParentRef + oElem.nodeName;
        }
    }
};
