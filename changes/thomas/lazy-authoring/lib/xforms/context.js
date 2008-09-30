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
};

Context.prototype.unwire = function() {
	this.m_context = null;
	this.m_arrNodes = null;
};

//TODO: rewrite these functions to have more objectiness,
//	Originally written to remove an amount of stuff from the .htc
//	so just calls equivalent friend function with pThis.
//	This is no longer needed or desired, with the advent of the decorator stuff.

Context.prototype.getEvaluationContext = function(nOrdinal) {
    if (!nOrdinal || isNaN(nOrdinal)) {
        nOrdinal = 1;
    }
    
    if (this.m_context) {
        return this.m_context;
    }
    
    var oContext = {
        model: null,
        node: null
    };
    
    if (this.m_arrNodes) {
        oContext.model = this.m_model;
        oContext.node  = this.m_arrNodes[nOrdinal - 1]; 
        return oContext;            
    }
    
    var oElement = this.element;
    var oDocument = oElement.ownerDocument;
    var sBindId = oElement.getAttribute("bind");
    
    if (sBindId) {
        var oBind = oDocument.getElementById(sBindId);
        
        if (oBind && oBind.ownerModel && oBind.boundNodeSet) {
            oContext.model = oBind.ownerModel;
            oContext.node  = oBind.boundNodeSet;
        } else {
            // Dispatch xforms-binding-exception if bind is not resolved 
            UX.dispatchEvent(this.element, "xforms-binding-exception", false, true, true);
        }
        return oContext;
    }
    
    var sModelId = oElement.getAttribute("model");
    
    if (sModelId) {
        var oModel = oDocument.getElementById(sModelId);
        if (oModel && oModel.getInstanceDocument) {
            // Having fetched a model node which corresponds to the given @model IDREF
            // Find the model to which the parent element is bound.
            var oContextModel = getModelFor(oElement.parentNode);
            
            if (oContextModel == oModel) {
                // In the case that the parent's model and the model fetched from the @model IDREF
                // are identical, the evaluation context for pThis node is the context gleaned
                // from its position within the document, to wit, the same context as though it 
                // had no model attribute at all.
                oContext = this.getParentEvaluationContext();
            } else {
                // Where the above clause is false, i.e. a disparity exists between the model to which 
                // the parent node is bound, and the model to which pThis node is bound, then pThis node is
                // not evaluated in the context of the parent node, but is evaluated in the default context for
                // the model whose id matches the IDREF given in pThis element's model attribute.
                oContext = oModel.getEvaluationContext();
            }        
        } else {
            // Dispatch xforms-binding-exception if model is not resolved
            UX.dispatchEvent(this.element, "xforms-binding-exception", false, true, true);
        }
    } else {
        //Otherwise  use the parent's evaluation context.
        oContext = this.getParentEvaluationContext();        
    }
    
     this.m_context = { model: oContext.model, node: oContext.node };
     return oContext;
};


/*
 *  If an element doesn't have an evaluation context then we
 * use the parent's.
 */

Context.prototype.getParentEvaluationContext = function(nOrdinal) {
    var oElement = this.element;
    
    if (!nOrdinal || isNaN(nOrdinal)) {
        var nOrdinal = Number(oElement.getAttribute("ordinal"));
        if (!nOrdinal || isNaN(nOrdinal)) {
            nOrdinal = 1;
        }
    }
    
    var oParent  = this.element.parentNode;
    var oRoot    = document.documentElement;
    var oContext = null;
    
    while (oParent && oParent !== oRoot) {
        if (oParent.getBoundNode) {            
            oContext = oParent.getBoundNode(nOrdinal);
            if (oContext && (oContext.model || oContext.node)) {
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
               // document.defaultModel = UX.utils.createXFormsModel();
               return { model: null, node: null }; 
            }
        }        
        oContext = document.defaultModel.getEvaluationContext();
    }    
    return oContext;
};


/*
 * Get the node that this element is bound to.
 */
Context.prototype.getBoundNode = function(nOrdinal) {
    if (!nOrdinal || isNaN(nOrdinal)) {
        nOrdinal = 1;
    }
    
    // If we have a proxy node (and not a proxy expression)
    // then use that.
    var oProxy = this.m_proxy;
    var oContext = { model: null,  node: null };
    
    if (oProxy && !oProxy.m_xpath) {        
        oContext.node = oProxy;
        
        if (!this.m_model) {
            this.m_model = this.getEvaluationContext().m_model;            
        }        
        oContext.model = this.m_model;
        return oContext;
    }

    if (NamespaceManager.getLowerCaseLocalName(this) === "model") {
        return this.getEvaluationContext();
    }
    
    // Bind has the highest priority - see:
    // http://www.w3.org/TR/2006/REC-xforms-20060314/slice3.html#structure-attrs-single-node
    // http://www.w3.org/TR/2006/REC-xforms-20060314/slice3.html#structure-attrs-nodeset
    
    var oElement = this.element;
    var sBindId  = oElement.getAttribute("bind");
    var oBindNodes = this.m_arrNodes;
       
    if (sBindId) {        
        if (!oBindNodes) { 
            var oBind = oElement.ownerDocument.getElementById(sBindId);
            
            if (!oBind) {
                // Dispatch xforms-binding-exception if bind is not resolved 
                UX.dispatchEvent(this.element, "xforms-binding-exception", false, true, true);
                return oContext;
            }
            
            this.m_arrNodes = oBind["boundNodeSet"];
            this.m_model = oBind["ownerModel"];
        } 
        oContext.model = this.m_model;
        oContext.node = oBindNodes[nOrdinal - 1];
        return oContext;
    }
    
    var sRef = oElement.getAttribute("ref");
    var sNodeset = oElement.getAttribute("nodeset");
    var sName = oElement.getAttribute("name");
   
    if (!sRef && !sNodeset && !sName) {
        // Return if no ref | nodeset | name to evaluate
        return oContext;
    }

    
    // Get the evaluation context, and save the model value.
    oContext = this.getEvaluationContext();
    
    // if no model found - this is possible if user reference to a non-existing model
    // not possible after we added the code to create a lazy model by default
    // but we will check for it anyway.
    if (!oContext.model) {
        return oContext;
    }
  
    this.m_model = oContext.model;        
    var oModel = this.m_model;
        
    // TODO: Streamlined syntax
    // if (sName) {
    //}
   

    if (sRef && nOrdinal == 1) {        
        var oRefNode = 
            getFirstNode(oModel.EvaluateXPath(sRef, oContext.node));

        if (!oRefNode) {
            // Lazy authoring, 
            // get the default instance
            var oInstDoc = this._getDefaultInstanceDocument(oModel);
            
            if (oInstDoc) {
                // Actually we need to check for the QName is valid  but
                // it seems that createElement will accept any QName (valid or not)
                
                oRefNode = oInstDoc.createElement(sRef);
                if (oRefNode) {
                    oInstDoc.documentElement.appendChild(oRefNode);
                } 
                // If we created the node from lazy authoring, we need to verify 
                // that it it is actually created properly
                oRefNode = getFirstNode(oModel.EvaluateXPath(sRef, oContext.node));
                
                if (!oRefNode) {
                    UX.dispatchEvent(this.element, 
                            "xforms-binding-exception", false, true, true);
                }
            } else {
                // console.log("no instance doc")
            }
        }
        oContext.node = oRefNode;
    }
    
    if (sNodeset) {
        if (!oBindNodes) {
            oBindNodes = oModel.EvaluateXPath(sNodeset, oContext.node).value;
            if (!oBindNodes) {
                // Dispatch xforms-binding-exception if bind is not resolved 
                UX.dispatchEvent(this.element, "xforms-binding-exception", false, true, true);
                return { model: null, node: null };
            }
            this.m_arrNodes = oBindNodes;                
        }
        oContext.node = this.m_arrNodes[nOrdinal - 1];
    }
    return oContext;    
};


Context.prototype._getDefaultInstanceDocument = function(oModel) {    
    var oInstDoc = null;
    
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