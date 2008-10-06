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
	this.m_oDOM.XFormsInstance = this;
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
Instance.prototype.deleteNodes = function (nodesetExpr, atExpr) {
	var ns = this.evalXPath(nodesetExpr, this.m_oDOM).nodeSetValue(),
		at = (atExpr) ? this.evalXPath(atExpr, this.m_oDOM).numberValue() : undefined,
		i, node, nsDeleted = [ ], evt;

	// If no nodes are found then there is nothing to do.
	//
	if (ns.length) {
		// If we have some nodes, and an 'at' value, then delete the
		// specific node:
		//
		if (at !== undefined) {
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


// Evaluate an XPath expression against this instance.
//
Instance.prototype.evalXPath = function (expr) {
	return xpathDomEval(expr, this.m_oDOM);
};