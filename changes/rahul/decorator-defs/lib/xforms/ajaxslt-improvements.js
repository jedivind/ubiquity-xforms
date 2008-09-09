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
var g_currentModel = null;
var g_bSaveDependencies = false;

FunctionCallExpr.prototype.xpathfunctions["namespace-uri"] = function(ctx)
{
    alert('not IMPLEMENTED yet: XPath function namespace-uri()');
};

FunctionCallExpr.prototype.evaluate = function(ctx) {
  var fn = String(this.name.value);
  var f = this.xpathfunctions[fn];
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
    xpathLog('XPath NO SUCH FUNCTION ' + fn);
    retval = new BooleanValue(false);
  }
  return retval;
};

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
