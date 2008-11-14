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

function Instance(elmnt) {
	this.element = elmnt;
	this.m_oDOM = null;
	this.element["elementState"] = 1;
	
	UX.addStyle(this.element, "display", "none"); 
}

Instance.prototype.finishLoad = function () {
    var ret = false;
    if (this.m_oDOM && this.m_oDOM.documentElement) {
        ret = true;
        if (this.element.parentNode.flagRebuild && typeof this.element.parentNode.flagRebuild === "function")
            this.element.parentNode.flagRebuild();
        this.m_oDOM.XFormsInstance = this;
        this.m_oOriginalDOM = this.m_oDOM.cloneNode(true);
    } else if (!this.element["elementState"]) {
        // if we do not have a valid instance from @src, inline or @resource
        // and the elementState has been set to 0, then 
        // let's throw an xforms-link-exception;   
        //
        this.dispatchException("xforms-binding-exception");       
    }
    
    return ret;
}

Instance.prototype.dispatchException = function (sEx) {
    // indicate a problem with the instance state and
    // throw an exception;   
    //
    this.element["elementState"] = -1;
    UX.dispatchEvent(this.element, sEx, false, true, true);  
}


Instance.prototype.xlinkEmbed = function (s) {
	this.m_oDOM = xmlParse(s);
    this.element["elementState"] = 0;
    this.finishLoad();
	return true;
}

Instance.prototype.load = function ( domURL ) {
     
     if ( domURL ) {
         //
         // We map our @src to an XLink.
         //    
        this.element.setAttribute("xlink:actuate", "onRequest");
        this.element.setAttribute("xlink:show", "embed");
        this.element.setAttribute("xlink:href", domURL);
        
        //Prevent XLink resolving the base URL.
        //
        this.element.setAttribute("base", " ");
        this.element.attachSingleBehaviour(XLinkElement);
        
        //
        // When the document has been loaded by our XLink handler
        // we parse it and then fire a 'document load' event.
        //    
        this.element.addEventListener(
        "xlink-traversed", {
            context: this,
            handleEvent: function (evtParam) {
                //this.context.parseInstance();
                var evt = this.context.element.ownerDocument.createEvent("Events");
                evt.initEvent("instance-load", true, false);
                var oTarget = this.context.element;
                spawn(function () {
                    FormsProcessor.dispatchEvent(oTarget, evt);
                });
            }
        },
        false);
        
        /*
        * [ISSUE] Need to decide how to actuate, since
        * onLoad is too late.
        */
        
        this.element.Actuate();
    }
}

Instance.prototype.initialisedom = function () {
    if (!this.m_oDOM) {       
        // @src takes precedence over inline data and @resource;
        // inline data takes precedence over @resource
        //
        if (this.getAttribute("src")) { 
            this.load(this.getAttribute("src"));
        } else {
            // is there inline data?
            //
            this.parseInstance();
            
            if (!this.finishLoad()) {
                // if there wasn't a src attribute, nor an inline instance
                // then let's try a resource attribute
                //
                if (this.getAttribute("resource")) {
                    this.load(this.getAttribute("resource"));
                } else {
                    // the success of loading a @src or a @resource can not be determined at this point
                    // since they are asynchronous in behavior
                    // if we do not have a valid instance from @src, inline or @resource
                    // then let's throw an xforms-link-exception;   
                    //
                    this.dispatchException("xforms-binding-exception"); 
                }            
            }   
        }      
    }
};

Instance.prototype.parseInstance = function () {
	var sXML = "";
	if (UX.isXHTML) {
		var o = new XMLSerializer();
		var n = this.element.firstChild;
		while (n) {
			sXML += o.serializeToString(n);
			n = n.nextSibling;
		}
	}
	else {
		sXML = this.element.innerHTML;
	}
	
	if (sXML !== "") {
		this.m_oDOM = xmlParse(sXML);
        if (this.m_oDOM && this.m_oDOM.documentElement) {
            this.element["elementState"] = 0;        
        }
	}
	else {
		this.element["elementState"] = -1;
		this.setAttribute("elementStateDescription", "Cannot have an empty instance.");
	}
	return;
};

Instance.prototype.getDocument = function () {
    if (this.m_oDOM) { // guard
	    this.m_oDOM.XFormsInstance = this;
    }
	return this.m_oDOM;
};

Instance.prototype.replaceDocument = function (oDom) {
	this.m_oDOM = null;
	this.m_oDOM = oDom;
	//in the case that this is being manually initialised, so that the DOM has not been
	//  initialised through "initialiseDOM", there will be no originalDOM
	if (!this.m_oOriginalDOM) {
		this.m_oOriginalDOM = this.m_oDOM.cloneNode(true);
	}
	return;
};

Instance.prototype.reset = function () {
	this.replaceDocument(this.m_oOriginalDOM.cloneNode(true));
};

Instance.prototype.onContentReady = Instance.prototype.initialisedom;

// Delete nodes takes a nodelist and deletes the node at a specified
// position in that list. If no position is specified then the entire
// list is deleted.
//
Instance.prototype.deleteNodes = function (contextNode, nodesetExpr, atExpr) {
    var ns = this.evalXPath(nodesetExpr, contextNode).nodeSetValue(),
		at = (atExpr) ? Math.round(this.evalXPath(atExpr, contextNode).numberValue()) : undefined,
		i, node, nsDeleted = [ ], evt;

	// If no nodes are found then there is nothing to do.
	//
	if (ns.length) {
		// If we have some nodes, and an 'at' value, then delete the
		// specific node:
		//
		if (at !== undefined) {
		    // If the 'at' value is too small, then it is 1.
		    // If it is in range, it is used.  Otherwise, if it 
		    // is too big or isNaN, then it is set to the nodeset size
		    //
            at = at < 1 ? 1 : (at <= ns.length ? at : ns.length);
            
			if (ns[at - 1]) {
				node = ns[at - 1];
				nsDeleted.push(node);

				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}
		} else {
			// If there is no 'at' value, then delete all the nodes in
			// the list:
			//
			for (i = 0; i < ns.length; i++) {
				node = ns[ i ];
				nsDeleted.push(node);
				
				if (node.parentNode) {
					node.parentNode.removeChild(node);
				}
			}// for each node
		}// if there is an at value ... else ...
	} // if no nodes were found
	
	// If we have deleted any nodes then dispatch an event.
	//
	if (nsDeleted.length) {
		evt = document.createEvent("Events");
		evt.initEvent("xforms-delete", true, false);
		
		evt.context = {
			"deleted-nodes" : nsDeleted,
			"delete-location" : at
		};
		FormsProcessor.dispatchEvent(this, evt);
		return true;
	} else {
		return false;
	}
};// deleteNodes()

Instance.prototype.insertNodes = function (contextNode, contextExpr, nodesetExpr, atExpr, position, originExpr) {
    var ns = (nodesetExpr) ? this.evalXPath(nodesetExpr, contextNode).nodeSetValue() : null;
    var nsOrigin = (originExpr) ? this.evalXPath(originExpr, contextNode).nodeSetValue() 
                                : ((ns) ? new Array(ns[ns.length-1]) : null);
    var at, after, i, node, insertLocationNode, insertBeforeNode, cloneNode, nsLocationNode = [ ], nsInserted = [ ], evt;    
    
    // If there's no context node, then insertion is not possible, so
    // we'll just no-op in that case.
    //
    if (contextNode) {        
        // If, in addition to a context, there is a nodeset, then the insertion will occur within the nodeset
        //
        if (ns && ns.length > 0) {
            // If the 'at' value is not given, then it defaults to the nodeset size.
            // If the expression is given, then we round its result.  
            // If the result is too small, then it is 1.
            // If it is in range, it is used.  Otherwise, if it 
            // is too big or isNaN, then it is set to the nodeset size
            //
            at = (atExpr) ? Math.round(this.evalXPath(atExpr, contextNode).numberValue()) : ns.length; 
            at = at < 1 ? 1 : (at <= ns.length ? at : ns.length);
                    
            insertLocationNode = ns[at-1];
            nsLocationNode.push(insertLocationNode);

            after = (position) ? (position !== 'before') : true;
            
            if (after) {
                insertBeforeNode = insertLocationNode.nextSibling ? insertLocationNode.nextSibling : null;
            } else {
                insertBeforeNode = insertLocationNode;
            }
            
            // Each inserted node is added to the nsInserted list
            // The nodes are inserted before a particular child node, or 
            // if insertBeforeNode is null, then insertBefore() apppends the nodes
            //
            for (i=0; i < nsOrigin.length; i++) {
                cloneNode = nsOrigin[i].cloneNode(true);
                insertLocationNode.parentNode.insertBefore(cloneNode, insertBeforeNode);
                nsInserted.push(cloneNode);
            }        
        } // end if (non-empty nodeset) 
        
        // If there is no nodeset but there is a context attribute that indicates a node into 
        // which an insertion can occur, and if there are one or more origin nodes, then 
        // we can proceed with insertion
        //
        else if (contextExpr && nsOrigin && nsOrigin.length > 0) {
            insertLocationNode = contextNode;
            nsLocationNode.push(insertLocationNode);
            insertBeforeNode = (insertLocationNode.firstChild) ? insertLocationNode.firstChild : null;
            for (i=0; i < nsOrigin.length; i++) {
                cloneNode = nsOrigin[i].cloneNode(true);
                insertLocationNode.insertBefore(cloneNode, insertBeforeNode);
                nsInserted.push(cloneNode);
            }                
        }
    } // end if (contextNode)
     
    // If we have inserted any nodes then dispatch an event and return true; otherwise just return false
    //
    if (nsInserted.length) {
        evt = document.createEvent("Events");
        evt.initEvent("xforms-insert", true, false);

        evt.context = {
            "inserted-nodes" : nsInserted,
            "origin-nodes" : nsOrigin,
            "insert-location-node" : nsLocationNode,
            "position" : (after ? "after" : "before")
        };
        FormsProcessor.dispatchEvent(this, evt);
        return true;
    } else {
        return false;
    }

    return false;    
};// insertNodes()

// Evaluate an XPath expression against this instance.
// If no context is given, the default is the document element of the instance 
//
Instance.prototype.evalXPath = function (expr, contextNode) {
    // If the containing element has an XPath evaluator, then use it
    if (this.element.parentNode && this.element.parentNode.EvaluateXPath && typeof this.element.parentNode.EvaluateXPath === "function")
        return this.element.parentNode.EvaluateXPath(expr, contextNode);     

    // Otherwise, invoke the basic evaluator
	return xpathDomEval(expr, contextNode || this.m_oDOM.documentElement);
};