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
	this.elementState = 1;
	
	UX.addStyle(this.element, "display", "none");
}

Instance.prototype.xlinkEmbed = function (s) {
	this.m_oDOM = xmlParse(s);
	this.elementState = 0;
	this.parentNode.flagRebuild();
	return true;
};

Instance.prototype.initialisedom = function () {
	if (!this.m_oDOM) {
		if (!this.getAttribute("src")) {
			this.parseInstance();
		}
		else {

			/*
			 * We map our @src to an XLink.
			 */
			
			this.element.setAttribute("xlink:actuate", "onRequest");
			this.element.setAttribute("xlink:show", "embed");
			this.element.setAttribute("xlink:href", this.element.getAttribute("src"));

			//Prevent XLink resolving the base URL.
			//
			this.element.setAttribute("base", " ");
			this.element.attachSingleBehaviour("XLinkElement");
			/*
			* When the document has been loaded by our XLink handler
			* we parse it and then fire a 'document load' event.
			*/
			
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
		
		if (this.m_oDOM) {
			this.m_oDOM.XFormsInstance = this;
			this.m_oOriginalDOM = this.m_oDOM.cloneNode(true);
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
		this.elementState = 0;
		if (this.parentNode.flagRebuild) {
			this.parentNode.flagRebuild();
		}
	}
	else {
		this.elementState = - 1;
		this.setAttribute("elementStateDescription", "Cannot have an empty instance.");
	}
	return;
};

Instance.prototype.getDocument = function () {
    if (this.m_oDOM) {
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
Instance.prototype.deleteNodes = function (inscopeContext, contextExpr, nodesetExpr, atExpr) {
    var contextNode = (contextExpr) ?  this.evalXPath(contextExpr, inscopeContext).nodeSetValue()[0] : inscopeContext,
	    ns = this.evalXPath(nodesetExpr, contextNode).nodeSetValue(),
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

Instance.prototype.insertNodes = function (inscopeContext, contextExpr, nodesetExpr, atExpr, position, originExpr) {
    var contextNode = (contextExpr) ?  this.evalXPath(contextExpr, inscopeContext).nodeSetValue()[0] : inscopeContext,
        ns = (nodesetExpr) ? this.evalXPath(nodesetExpr, contextNode).nodeSetValue() : null,
        nsOrigin = (originExpr) ? this.evalXPath(originExpr, contextNode).nodeSetValue() 
                                : ((ns) ? ns[ns.length-1] : null),
        at, after, i, node, insertLocationNode, insertBeforeNode, nsInserted = [ ], evt;
        
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
                nsInserted.push(
                    insertLocationNode.parentNode.insertBefore(
                        nsOrigin[i].cloneNode(true), 
                        insertBeforeNode
                    )
                );
            }        
        } // end if (non-empty nodeset) 
        
        // If there is no nodeset but there is a context node into which an insertion can occur, 
        // and if there are one or more origin nodes, then we can proceed with insertion
        //
        else if (nsOrigin && nsOrigin.length > 0) {
            insertLocationNode = contextNode;
            insertBeforeNode = (insertLocationNode.firstChild) ? insertLocationNode.firstChild : null;
            for (i=0; i < nsOrigin.length; i++) {
                nsInserted.push(
                    insertLocationNode.insertBefore(
                        nsOrigin[i].cloneNode(true), 
                        insertBeforeNode
                    )
                );
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
            "insert-location-node" : insertLocationNode,
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
	return xpathDomEval(expr, contextNode || this.m_oDOM.documentElement);
};