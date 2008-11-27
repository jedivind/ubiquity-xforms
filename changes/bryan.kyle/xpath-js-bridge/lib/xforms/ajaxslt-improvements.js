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

var g_currentModel = null;
var g_bSaveDependencies = false;

/**
    The entry point for the library: match an expression against a DOM
    node. Returns an XPath value.
    @addon
*/
function xpathDomEval(expr, node, resolverElement) {
    var expr1 = xpathParse(expr);
    var ctx = new ExprContext(node); 
    ctx["currentModel"] = g_currentModel;
    ctx["outermostContextNode"] = node;
    // resolverElement is the node that contained the XPath function.
    ctx["resolverElement"] = resolverElement;
    // If the browser doesn't preserve the case of node names,
    // tell the XPath evaluator to do node name tests in a
    // case-insensitive manner.
    ctx.setCaseInsensitive(!UX.isXHTML && (UX.isFF || UX.isChrome || UX.isSafari));
    var ret = expr1.evaluate(ctx);
    return ret;
}

ExprContext.prototype.clone = function(opt_node, opt_position, opt_nodelist) {
  var oRet = new ExprContext(
      opt_node || this.node,
      typeof opt_position != 'undefined' ? opt_position : this.position,
      opt_nodelist || this.nodelist, this, this.caseInsensitive,
      this.ignoreAttributesWithoutValue);
  oRet.outermostContextNode = this.outermostContextNode;
  oRet.resolverElement = this.resolverElement;
  return oRet;
};

/** 
    The AJAXSLT XNode does not support cloneNode
    @addon
    @param {bool} bDeep Whether to run a deep (everything) or shallow (just the tag and attributes, no children) clone
    @throws String if bDeep is false, shallow clones are not yet implemented.
*/

XNode.prototype.cloneNode = function(bDeep)
{
    var s, oDoc;
    if(bDeep)
    {
        //TODO: revisit and revise this method to use the DOM.
        //    Serializing and deserializing the candidate node is obviously the quick way to write this function, but somewhat inefficient.
        //     Also, this can only work for nodes of type document or element.  
        s = xmlText(this);
        oDoc = xmlParse(s);
        if(this.nodeType == DOM_DOCUMENT_NODE)
        {
            return oDoc;
        }
        else if(this.nodeType == DOM_ELEMENT_NODE)
        {
            return oDoc.documentElement;
        }
        else
        {
            return null;
        }
    }
    else
    {
        //TODO: implement shallow cloning.
        throw ("XNode::cloneNode - shallow clones are not supported");
    }
};


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
	
	var i, nodes, retval, f;
	
	var fn = String(this.name.value);
	
	if ((f = this.xpathfunctions[fn])) {	
		retval = f.call(this, ctx);
		if (g_bSaveDependencies && retval.type == 'node-set') {
			nodes = retval.nodeSetValue();
			for (i = 0; i < nodes.length; ++i) {
				g_arrSavedDependencies.push(nodes[i]);
			}
		}
		return retval;
		
	} else if ((f = eval(fn))) {
		
		var args = Collection.map(this.args, function(o) {
									  var result = o;
									  while (result && result.evaluate)
										  result = result.evaluate(ctx);
									  
									  return result.value;
								  });

		retval = f.apply(null, args );
		
		switch (Type.of(retval)) {
		case 'boolean':
			return new BooleanValue(retval);
			break;
		case 'string':
			return new StringValue(retval);
			break;
		case 'number':
			return new NumberValue(retval);
			break;
		case 'array':
			return new NodeSetValue(retval);
			break;
		default:
			return new BooleanValue(false);
			break;
		}
		
	} else {
		
		xpathLog('XPath NO SUCH FUNCTION ' + fn);
		return new BooleanValue(false);
		
	}

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

