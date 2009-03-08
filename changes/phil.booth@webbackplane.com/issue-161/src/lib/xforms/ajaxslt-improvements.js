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
    @fileoverview
        The subset of the DOM implemented by Google's AJAXSLT is insufficent for the purpose of  implementing xforms through ajaxslt  
        This file contains the methods required by ajaxfp in order to work
*/

var g_bSaveDependencies = false;

/**
    The entry point for the library: match an expression against a DOM node.
    An expression and a full context object are received.  The context object
    contains "node", "model", "position" and "size" (when "node" comes from
    a nodeset a.k.a. nodelist), and "resolverElement" (the node containing
    the XPath expression).
    For backwards compatibility with the xpathDomEval in ajaxslt, the code
    tests if oContext.node exists, and if not it uses oContext as the node.   
    Returns then XPath expression result.
    
    @addon
*/
function xpathDomEval(expr, oContext) {
    var expr1 = xpathParse(expr);
    var ctx = new ExprContext(oContext.node ? oContext.node : oContext, oContext.position);
    ctx["size"] = oContext.size ? oContext.size : (ctx.node ? 1 : 0);
    ctx["currentModel"] = oContext.model;
    ctx["outermostContextNode"] = ctx.node;
    ctx["resolverElement"] = oContext.resolverElement;
    // If the browser doesn't preserve the case of node names,
    // tell the XPath evaluator to do node name tests in a
    // case-insensitive manner.
    ctx.setCaseInsensitive(!UX.isXHTML && (UX.isFF || UX.isChrome || UX.isSafari));
    var ret = expr1.evaluate(ctx);
    return ret;
}

FunctionCallExpr.prototype.xpathfunctions["last"] = function(ctx) {
    if (ctx.size && ctx.nodelist && ctx.nodelist.length === 1 && ctx.nodelist[0] === ctx.outermostContextNode) {
        return new NumberValue(ctx.size);
    }
    return new NumberValue(ctx.contextSize());
};

ExprContext.prototype.clone = function(opt_node, opt_position, opt_nodelist) {
  var oRet = new ExprContext(
      opt_node || this.node,
      typeof opt_position != 'undefined' ? opt_position : this.position,
      opt_nodelist || this.nodelist, this, this.caseInsensitive,
      this.ignoreAttributesWithoutValue);
  oRet.size = this.size;
  oRet.currentModel = this.currentModel;
  oRet.outermostContextNode = this.outermostContextNode;
  oRet.resolverElement = this.resolverElement;
  return oRet;
};

/** 
    The AJAXSLT XNode does not support cloneNode
    @addon
    @param {bool} bDeep Whether to run a deep (everything) or shallow (just the tag and attributes, no children) clone
*/

XNode.prototype.cloneNode = function(bDeep) {
	var newNode, i;
	
	if (bDeep) {		
		if (this.nodeType === DOM_DOCUMENT_NODE || this.nodeType === DOM_ELEMENT_NODE || this.nodeType === DOM_DOCUMENT_FRAGMENT_NODE) {
			newNode = this.cloneNode(false);
			
			for (i = 0; i < this.childNodes.length; i++) {
				newNode.appendChild(this.childNodes[i].cloneNode(true));
			}
		} else {
			bDeep = false;
		}
    }
    
	if (!bDeep) {
		if (this.nodeType === DOM_DOCUMENT_NODE) {
			newNode = new XDocument();
		} else if (this.nodeType === DOM_ELEMENT_NODE) {
			newNode = XNode.create(DOM_ELEMENT_NODE, this.nodeName, null, new XDocument());
			for (i = 0; i < this.attributes.length; i++) {
				newNode.setAttribute(this.attributes[i].nodeName, this.attributes[i].nodeValue);
			}
		} else {
			newNode = XNode.create(this.nodeType, this.nodeName, this.nodeValue, new XDocument());
		} 
	}
	
	return newNode;
};

/** A shallow clone of an element includes its tag and its attributes.
	If you need a "very" shallow clone of just the tag, then you can
	invoke cloneNode() and then call this function on the resulting node. 
	@addon
*/
XNode.prototype.removeAttributeList = function() {
	while (this.attributes.length > 0) {
		this.removeAttribute(this.attributes[0].nodeName);
	}
}

/**@addon
*/

FunctionCallExpr.prototype.xpathfunctions["local-name"] = function(ctx)
{
    assert(this.args.length === 1 || this.args.length === 0);
    var n, ix;
    var name = "";
    if (this.args.length === 0) {
      n = [ ctx.node ];
    } else {
      n = this.args[0].evaluate(ctx).nodeSetValue();
    }
    
    if (n.length === 0) {
    } else {
          name = n[0].nodeName;
    }
    
    ix = name.indexOf(":");
    if(ix > -1)
    {
        name = name.substr(ix+1);
    }
    return new StringValue(name);
};


/**@addon
*/  

FunctionCallExpr.prototype.xpathfunctions["namespace-uri"] = function(ctx)
{
    alert('not IMPLEMENTED yet: XPath function namespace-uri()');
};

/**@addon
*/  

FunctionCallExpr.prototype.evaluate = function(ctx) {
	var f = this.getFunction();
	var i, nodes, retval;
	
	if (f) {
		retval = f.call(this, ctx);
		if (g_bSaveDependencies && retval.type == 'node-set') {
			nodes = retval.nodeSetValue();
			for (i = 0; i < nodes.length; ++i) {
				g_arrSavedDependencies.push(nodes[i]);
			}
		}
	} else {
		xpathLog('XPath NO SUCH FUNCTION ' + this.name.value);
		retval = new BooleanValue(false);		
	}
	
	return retval;
};

FunctionCallExpr.prototype.getFunction = function() {

	var segments, prefix, localName;
	var prefixes;
	var i;
	var allowBridge = false;
	var retval;
	
	segments = this.name.value.split(':');
	if (segments.length == 1) {
		localName = segments[0];
	} else {
		prefix = segments[0];
		localName = segments[1];
	}

	if (!prefix) {
		retval = this.xpathfunctions[localName];
	} else {
		prefixes = NamespaceManager.getOutputPrefixesFromURI("http://www.w3.org/2002/xforms#inline");
		
		if (prefixes === undefined || prefixes === null)
			return null;
		
		for ( i = 0; i < prefixes.length; i++ ) {
			if (prefix === prefixes[i] && UX.global[localName] != null) {
				retval = function(ctx) {
					var f;
					var marshalledArgs = [];
					var i, c;
					var arg;
					var retval;

					f = UX.global[localName];
					if (!f) {
						return null;
					}
					
					c = this.args.length;
					for ( i = 0; i < c; i++ ) {
						arg = this.args[i];
						// Keep evaluating the XPath node until it yields a terminal.
						while (arg && typeof(arg.evaluate) === 'function')
							arg = arg.evaluate(ctx);

						if (arg.type === 'boolean') {
							marshalledArgs.push(arg.booleanValue());
						} else if (arg.type === 'string') {
							marshalledArgs.push(arg.stringValue());
						} else if (arg.type === 'number') {
							marshalledArgs.push(arg.numberValue());
						} else if (arg.type === 'node-set' && arg.nodeSetValue().length <= 1) {
							// Only single-valued nodesets are permitted.
							marshalledArgs.push(arg.stringValue());
						} else {
							// Currently extension functions only support booleans, strings, and numbers
							// this is for two reasons:  The XNode interface is not compliant with the DOM
							// spec so it extension functions would have to be aware of this, and mutations
							// of the DOM are not a particularly good idea.
							xpathLog('Non-primitive passed to bridged function "' + localName + '".');
							return new BooleanValue(false);
						}

					}
					
					// Note, we do not use the context node as an implicit argument in the event that no arguments
					// are given to prevent issues with backwards compatibility for later when passing nodesets are
					// considered.  If no support is ever planned for nodesets, taking the context node as a string 
					// might be a good default.
					
					retval = f.apply(null, marshalledArgs);

					if (retval == null)
						return new BooleanValue(false);
					
					switch (UX.type(retval)) {
					case 'boolean':
						return new BooleanValue(retval);
					case 'string':
						return new StringValue(retval);
					case 'number':
						return new NumberValue(retval);
					default:
						// To be consistent with pre-call setup, an exception is thrown if a function returns
						// anything other than a primitive.  A special case is made for null and undefined as
						// javascript treats these as false values in a boolean context.
						xpathLog('Bridged function "' + localName + '" returned non-primitive value.');
						return new BooleanValue(false);
					}
				};
				break;
			}
		}
	}
	
	return retval;
};
	
/**@addon
*/  

LocationExpr.prototype.evaluate = function(ctx) {
  var start, i, retval;
  var nodes = [];
  if (this.absolute) {
    start = ctx.root;

  } else {
    start = ctx.node;
  }

  xPathStep(nodes, this.steps, 0, start, ctx);
  retval = new NodeSetValue(nodes);
  if(g_bSaveDependencies)
  {
	for(i = 0; i < nodes.length; ++i)
	{
		g_arrSavedDependencies.push(nodes[i]);
	}
  }
  return retval;
};

XNode.prototype.setOwnerDocument = function(owner, bDeep) {
	var i;
	
	if (this.nodeType === DOM_DOCUMENT_NODE) {
		this.ownerDocument = null;
	} else {
		this.ownerDocument = owner;
	}
	
	if (bDeep) {
		for (i = 0; i < this.attributes.length; i++) {
			this.attributes[i].setOwnerDocument(owner);
		}
		for (i = 0; i < this.childNodes.length; i++) {
			this.childNodes[i].setOwnerDocument(owner, true);
		}
	}
}

// This version corrects the original by setting the ownerDocument of node
//
XNode.prototype.appendChild = function(node) {

  // ownerDocument
  if (node.ownerDocument !== this.ownerDocument) {
      node.setOwnerDocument(this.nodeType === DOM_DOCUMENT_NODE ? this : this.ownerDocument, true);
  }	
      
  // firstChild
  if (this.childNodes.length == 0) {
    this.firstChild = node;
  }

  // previousSibling
  node.previousSibling = this.lastChild;

  // nextSibling
  node.nextSibling = null;
  if (this.lastChild) {
    this.lastChild.nextSibling = node;
  }

  // parentNode
  node.parentNode = this;

  // lastChild
  this.lastChild = node;

  // childNodes
  this.childNodes.push(node);
}

// This version corrects the original by setting the ownerDocument of newNode
//
XNode.prototype.replaceChild = function(newNode, oldNode) {
  if (oldNode == newNode) {
    return;
  }

  for (var i = 0; i < this.childNodes.length; ++i) {
    if (this.childNodes[i] == oldNode) {
      if (newNode.ownerDocument !== oldNode.ownerDocument) {
          newNode.setOwnerDocument(oldNode.ownerDocument, true);
      }	
      
      this.childNodes[i] = newNode;

      var p = oldNode.parentNode;
      oldNode.parentNode = null;
      newNode.parentNode = p;

      p = oldNode.previousSibling;
      oldNode.previousSibling = null;
      newNode.previousSibling = p;
      if (newNode.previousSibling) {
        newNode.previousSibling.nextSibling = newNode;
      }

      p = oldNode.nextSibling;
      oldNode.nextSibling = null;
      newNode.nextSibling = p;
      if (newNode.nextSibling) {
        newNode.nextSibling.previousSibling = newNode;
      }

      if (this.firstChild == oldNode) {
        this.firstChild = newNode;
      }

      if (this.lastChild == oldNode) {
        this.lastChild = newNode;
      }

      break;
    }
  }
}

// This version fixes two behaviors.  
// 1. It does appendChild when !oldNode, per DOM spec
// 2. It sets the ownerDocument of newNode
//
XNode.prototype.insertBefore = function(newNode, oldNode) {
  var i, c, newChildren = [], oRet = newNode;

  if (!oldNode) {
      if (newNode.parentNode) {
        newNode.parentNode.removeChild(newNode);
      }
      this.appendChild(newNode);
      
  } else if ((oldNode !== newNode) && (oldNode.parentNode === this)) {
      if (newNode.parentNode) {
        newNode.parentNode.removeChild(newNode);
      }
      
      if (newNode.ownerDocument !== oldNode.ownerDocument) {
          newNode.setOwnerDocument(oldNode.ownerDocument, true);
      }	
       
      for (i = 0; i < this.childNodes.length; ++i) {
        c = this.childNodes[i];
        if (c === oldNode) {
          newChildren.push(newNode);

          newNode.parentNode = this;

          newNode.previousSibling = oldNode.previousSibling;
          oldNode.previousSibling = newNode;
          if (newNode.previousSibling) {
            newNode.previousSibling.nextSibling = newNode;
          }

          newNode.nextSibling = oldNode;

          if (this.firstChild === oldNode) {
            this.firstChild = newNode;
          }
        }
        newChildren.push(c);
      }
      this.childNodes = newChildren;
  }

  return oRet;
}

/** 
    The AJAXSLT XNode does not support @xml:id or @xsi:type="xsd:ID",
    so this function does support these attributes.
    
    This function was expanded from the original getElementById() xpath function in AJAXSLT.
    This function returns an array of nodes.
    @addon    
*/
XNode.prototype.getElementsById = function(id) {
    var ret = [];
    var oID = null;
    domTraverseElements(this, function(node) {
        //
        // is there an id attribute?
        //
        oID = node.getAttribute('id');
        if (!oID) {
            //
            // Is there an xml:id attribute?
            // 
            oID = node.getAttribute('xml:id');
             
            // 
            // finally, see if there is an xsi:type='xsd:ID' attribute
            // 
            if (!oID && node.getAttribute('xsi:type') === 'xsd:ID') {
                oID = node.firstChild.nodeValue.trim();
            }
        } 
    
        if (oID === id) {
            ret.push(node); 
        }
    }, null);
    return ret;
};

// Enhancements to support processing instructions.
//
XDocument.prototype.createProcessingInstruction = function(target, data) {
  return XNode.create(DOM_PROCESSING_INSTRUCTION_NODE, '#processing-instruction', target + " " + data.replace(/^\s\s*/, '').replace(/\s\s*$/, ''), this);
}

function xmlTextR(node, buf, cdata, wrapTextInCDATA) {
  var a, i, nodeName, elementContainsCDATA;
  if (node.nodeType == DOM_TEXT_NODE) {
    if (wrapTextInCDATA) {
      buf.push('<![CDATA[' + node.nodeValue + ']]>');
    } else {
      buf.push(xmlEscapeText(node.nodeValue));
    }

  } else if (node.nodeType == DOM_CDATA_SECTION_NODE) {
    if (cdata) {
      buf.push(node.nodeValue);
    } else {
      buf.push('<![CDATA[' + node.nodeValue + ']]>');
    }

  } else if (node.nodeType == DOM_COMMENT_NODE) {
    buf.push('<!--' + node.nodeValue + '-->');

  } else if (node.nodeType == DOM_ELEMENT_NODE) {
    nodeName = xmlFullNodeName(node);
    buf.push('<' + nodeName);
    for (i = 0; i < node.attributes.length; ++i) {
      a = node.attributes[i];
      if (a && a.nodeName && a.nodeValue) {
        buf.push(' ' + xmlFullNodeName(a) + '="' +
                 xmlEscapeAttr(a.nodeValue) + '"');
      }
    }

    if (node.childNodes.length == 0) {
      buf.push('/>');
    } else {
      elementContainsCDATA = false;
      if (cdata && typeof cdata === 'object' && typeof cdata.length === 'number' && typeof cdata.splice === 'function' && !cdata.propertyIsEnumerable('length')) {
        for (i = 0; i < cdata.length; ++i) {
          if (nodeName === cdata[i]) {
            elementContainsCDATA = true;
            break;
          }
        }
      }
      buf.push('>');
      for (i = 0; i < node.childNodes.length; ++i) {
        arguments.callee(node.childNodes[i], buf, cdata, elementContainsCDATA);
      }
      buf.push('</' + nodeName + '>');
    }

  } else if (node.nodeType == DOM_DOCUMENT_NODE ||
             node.nodeType == DOM_DOCUMENT_FRAGMENT_NODE) {
    for (i = 0; i < node.childNodes.length; ++i) {
      arguments.callee(node.childNodes[i], buf, cdata);
    }
	/* New starts */
  } else if (node.nodeType == DOM_PROCESSING_INSTRUCTION_NODE) {
    buf.push('<?' + node.nodeValue + '?>');
	/* New ends */
  }
}
