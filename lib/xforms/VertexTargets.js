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

/*
function spawn(pFunc)
{
	setTimeout(pFunc, 1);
}
*/
function spawn(pFunc,pOnEnd)
{
	if(pOnEnd)
		setTimeout(function(){pFunc();spawn(pOnEnd);}, 1);
	else
		setTimeout(pFunc, 1);
}


/*
 * [ISSUE] Things have got a little untidy, in that
 * in the various context functions (getBoundNode,
 * getEvaluationContext and getParentEvaluationContext)
 * we sometimes return a DOM node and sometimes return
 * a proxy node. This means that if we actually want
 * the proxy node, we have to do a bit of analysis on
 * the node returned, and potentially create a proxy
 * node if one doesn't exist. This could all do with
 * a big old sort out.
 */

function getProxyNode(oNode)
{
	var pnRet = null;

	if (oNode)
	{

		/*
		 * The node could be either a DOM
		 * node, or a proxy node. If it's a proxy node,
		 * then we're done. 
		 */

		if (oNode.m_oNode)
			pnRet = oNode;

		/*
		 * If we have a DOM node, it may already have a
		 * proxy node...
		 */

		else
		{
			if (oNode.m_proxy)
				pnRet = oNode.m_proxy;
			
			/*
			 * ...but if it hasn't, create one. 
			 */

			else
			{
				pnRet = new ProxyNode(oNode);

				oNode.m_proxy = pnRet;
			}
		}
	}
	return pnRet;
}//getProxyNode


function getElementValueOrContent(oContext, oElement)
{
	var sExprValue = oElement.getAttribute("value");
	var sRet = "";

	if (sExprValue == undefined)
		sRet = oElement.innerHTML;
	else
	{
		sRet = getStringValue(
			oContext.model.EvaluateXPath(sExprValue, oContext.node)
		);
	}
	return sRet;
}//getElementValueOrContent

function getFirstNode(oRes)
{
	var oRet = null;

	if (oRes)
	{
		switch (oRes.type)
		{
			/*
			 * If we have a nodeset then return the first node.
			 */
	
			case "node-set":
				oRet = oRes.nodeSetValue()[0];
				break;

			/*
			 * [ISSUE] We have break-points here because it's not
			 * really clear whether we should return a node or a
			 * value. Single-stepping from here will help clarify
			 * this.
			 */

			case "string":
				debugger;
				oRet = oRes.stringValue();
				break;

			case "boolean":
				debugger;
				oRet = oRes.booleanValue();
				break;

			default:
				debugger;
				oRet = oRes.stringValue();
				break;
		}
	}
	return oRet;
}

/*
 * Get the first text node of an element, or create one.
 */

function getFirstTextNode(oNode)
{
	var oRet = null;

	if (oNode)
	{
		/*
		 * If we already have the text node or an attribute
		 * then just return it.
		 */

		if ((oNode.nodeType == DOM_TEXT_NODE) || (oNode.nodeType == DOM_ATTRIBUTE_NODE))
			oRet = oNode;

		/*
		 * Otherwise, if the node is an element then we want
		 * the first text node, but we'll create one if there
		 * isn't one.
		 */

		else if (oNode.nodeType == DOM_ELEMENT_NODE)
		{
			oRet = oNode.firstChild;

			/*
			 * If there is no child node, or the first child node is
			 * not a text node, then we need to create an empty text
			 * node.
			 */

			if (!oRet || oRet.nodeType != DOM_TEXT_NODE)
			{
				/*
				 * Create an empty text node for insertion.
				 */
	
				var newNode = oNode.ownerDocument.createTextNode("");
	
				/*
				 * If there were no existing nodes then add the new
				 * text node directly...
				 */
	
				if (!oRet)
					oNode.appendChild(newNode);
	
				/*
				 * ...otherwise place it before the non-text node that
				 * we just located.
				 */
	
				else
					oNode.insertBefore(newNode, oRet);
	
				/*
				 * It's the new text node that we want to return.
				 */
	
				oRet = newNode;
			}
		}
	}
	return oRet;
}

function getStringValue(oRes)
{
	var sRet = "";
	var oNode = null;

	if (oRes)
	{
		switch (oRes.type)
		{
			case "node-set":
				oNode = getFirstNode(oRes);
				if (oNode)
				{
					/*
					 * If we already have the text node then just
					 * return it.
					 */

					if ((oNode.nodeType == DOM_TEXT_NODE) || (oNode.nodeType == DOM_ATTRIBUTE_NODE))
						sRet = oNode.nodeValue;

					/*
					 * Otherwise, if the node is an element then we want
					 * the first text node, but we'll create one if there
					 * isn't one.
					 */

					else if (oNode.nodeType == DOM_ELEMENT_NODE)
					{
						oNode = oNode.firstChild;
						if (oNode && oNode.nodeType == DOM_TEXT_NODE)
							sRet = oNode.nodeValue;
					}
				}
				break;

			case "string":
				sRet = oRes.stringValue();
				oNode = null;
				break;

			case "boolean":
				sRet = oRes.booleanValue();
				break;

			case "number":
				sRet = oRes.numberValue();
				break;

			default:
				debugger;
				break;
		}
	}

	return sRet;
}

function ProxyExpression(oContext, sXPath, oModel)
{
	this.m_context = oContext;
	this.m_xpath = sXPath;
	this.m_model = oModel;
	this.datatype = "xsd:string";
	return;
}

ProxyExpression.prototype.getType = function()
{
	return this.datatype;
}

ProxyExpression.prototype.getNodeset = function()
{
	var sRet = null;
	var oModel = this.m_model;

	if (oModel)
	{
		/*
		 * [ISSUE] This should all be rolled into the one function
		 * in the same way as DOM 3 XPath allows us to specify the
		 * return type.
		 */

		oRet = oModel.EvaluateXPath(this.m_xpath, this.m_context);
	}

	return oRet;
}

ProxyExpression.prototype.getValue = function()
{
	var sRet = "";
	var oRes = this.getNodeset();

	if (oRes)
	{
		switch (oRes.type)
		{
			case "number":
				sRet = oRes.numberValue();
				break;

			case "string":
				sRet = oRes.stringValue();
				break;

			case "node-set":
				var oNode = getFirstTextNode(
					oRes.nodeSetValue()[0]
				);

				if (oNode)
					sRet = oNode.nodeValue;
				break;

			default:
				/* please add any other types that are missing! */
				debugger;
				break;
		}
	}
	return sRet;
}

/*
 * A ProxyNode is...surprisingly, a proxy for a DOM node, onto
 * which we attach all sorts of 'extra' properties.
 */

function ProxyNode(oNode)
{
	this.m_oNode = oNode;
	this.m_refcount = 0;
	this.calculate = null;
	this.readonly = { value: false };
	this.required = { value: false };
	this.enabled = { value: true };
	this.outofrange = { value: false };
	this.valid = { value: true };
	this.datatype = "xsd:string";

	/*
	 * [TEMP]
	 */

	this.datatype = "string";
}

ProxyNode.prototype.getMIP = function(sMIPName)
{
	var mipRet = this[sMIPName];

	if (!mipRet)
	{
		mipRet = null;
		debugger; /* asking for a MIP that doesn't exist */
	}

	return mipRet;
}

ProxyNode.prototype.getMIPState = function(sMIPName)
{
	var oMIP = this.getMIP(sMIPName);
	var bRet = false;

	if (oMIP)
		bRet = oMIP.value;

	return bRet;
}

ProxyNode.prototype.getNode = function()
{
	var oRet = this.m_oNode;

	return oRet;
}

ProxyNode.prototype.getType = function()
{
	return this.datatype;
}

ProxyNode.prototype.getValue = function()
{
	var sRet = "";
	var oNode = this.getNode();

	if (oNode)
	{
		oNode = getFirstTextNode(oNode);

		if (oNode)
			sRet = oNode.nodeValue;
	}

	return sRet;
}

ProxyNode.prototype.setValue = function(sVal, oModel)
{
	var oRet = null;

	if (!this.readonly.value)
	{
		var oNode = this.getNode();
	
		if (oNode)
		{
			oNode = getFirstTextNode(oNode);
	
			if (oNode)
			{
				oNode.nodeValue = (typeof(sVal) == "object")
					?  sVal.stringValue():""+sVal;
			}
		}

		/*
		 * If the proxy has a corresponding vertex
		 * then it means our node has been used in
		 * a calculation somewhere. We therefore need
		 * to add the vertex to the change list, and
		 * signal that we need to perform a recalculate,
		 * which is currently done by the caller.
		 */

		if (oModel)
		{
			if (this.m_vertex)
			{
				var oVertex = this.m_vertex;

				/*
				 * [ISSUE] These two could go probably go
				 * into one function.
				 */

				oModel.changeList.addChange(oVertex);
				oModel.m_bNeedRecalculate = true;
			}
			oModel.m_bNeedRefresh = true;
		}
		
	}
	return oRet;
}

function SingleNodeExpression(oTarget,sXPath, oContextResolver,oModel)
{
	this.m_sXPathExpr = sXPath;
	this.m_oContextResolver = oContextResolver;
	this.m_oModel = oModel;
	this.node = null;

	this.identifier = function()
	{
		return "snb["+sXPath+"]";
	}
}

SingleNodeExpression.prototype.update = function()
{
	var r = this.m_oModel.EvaluateXPath(this.m_sXPathExpr, this.m_oContextResolver);

	if (r != null)
	{	
		this.node = new ProxyNode(r.value[0]);
		return r.value[0];
	}
	return null;
}

SingleNodeExpression.prototype.determineDependentExpressions = function()
{
	/*
	 * The dependencies are worked out in the XPath expression
	 * evaluator.
	 */

	g_bSaveDependencies = true;
	this.m_oModel.EvaluateXPath(this.m_sXPathExpr, this.m_oContextResolver);
	g_bSaveDependencies = false;

	return;
}

function NodesetExpression(oTarget, sXPath, oContextResolver, oModel)
{
	this.m_sXPathExpr = sXPath;
	this.m_oContextResolver = oContextResolver;
	this.m_oModel = oModel;
	var m_nodeset = null;

	this.dependentExpressions = new Array();

	this.getNode = function(i)
	{
		return ProxyNode(m_nodeset[i]);
	}

	this.AddExpressionWhichTakesThisAsContext = function(sXPath)
	{
		this.dependentExpressions.push(new ComputedXPathExpression(sXPath,this,this.m_oModel));
	}

	this.identifier = function()
	{
		return "nsetb["+sXPath+"]";
	}
}

NodesetExpression.prototype.update = function()
{
	var r = this.m_oModel.EvaluateXPath(this.m_sXPathExpr, this.m_oContextResolver);

	if (r != null)
	{	
		this.node = new ProxyNode(r.value);
		return r.value;
	}
	return null;
}

NodesetExpression.prototype.determineDependentExpressions = function()
{
	/*
	 * The dependencies are worked out in the XPath expression
	 * evaluator.
	 */

	g_bSaveDependencies = true;
	this.m_oModel.EvaluateXPath(this.m_sXPathExpr, this.m_oContextResolver);
	g_bSaveDependencies = false;

	return;
}

function ComputedXPathExpression(oProxy, sXPath, oContextResolver, oModel)
{
	this.m_oProxy = oProxy;
	this.m_sXPathExpr = sXPath;
	this.m_oContextResolver = oContextResolver;
	this.m_oModel = oModel;
	this.value = null;
	this.dependentExpressions = new Array();
	this.identifier = function()
	{
		return "comp["+sXPath+"]";
	}
}

ComputedXPathExpression.prototype.update = function()
{
	var oRet = "";
	var oRes = this.m_oModel.EvaluateXPath(this.m_sXPathExpr, this.m_oContextResolver);

	if (oRes)
	{
		oRet = oRes.stringValue();
		this.m_oProxy.setValue(oRet, null);
	}

	this.value = oRet;
	return oRet;
}

/*
 * This breaks computed expression into further expressions on which
 * this one depends.
 */

ComputedXPathExpression.prototype.addDependentExpressions = function(oVertex, oDepEngine, oChangeList)
{
	var oRes = this.determineDependentExpressions();

	var oNode = null;
	var oPN = null;

	/*
	 * If there are any dependents then each of them needs to have
	 * a vertex added.
	 */

	if (this.dependentExpressions.length)
	{
		for (var i = 0; i < this.dependentExpressions.length; i++)
		{
			var oDependentNode = this.dependentExpressions[i];

			/*
			 * Get the proxy node if there is one, or create
			 * a new one.
			 */

			oPN = oDependentNode.m_proxy;

			if (!oPN)
			{
				oPN = new ProxyNode(oDependentNode);
				oDependentNode.m_proxy = oPN;
			}

			/*
			 * Now see if the node has an associated vertex...
			 */

			var oSubVertex;

			if (oPN.m_vertex)
				oSubVertex = oPN.m_vertex;

			/*
			 * ...otherwise, a sub-expression is created with its
			 * own vertex.
			 */

			else
			{
				var oSubExpr = new SubExpression(oDependentNode);

				oSubVertex = oDepEngine.createVertex(oSubExpr);
				oPN.m_vertex = oSubVertex;
				oChangeList.addChange(oSubVertex);
			}

			/*
			 * Make the target vertex dependent on the new
			 * sub-expression.
			 */

			oSubVertex.addDependent(oVertex);
		}
	}
}//addDependentExpressions()

ComputedXPathExpression.prototype.determineDependentExpressions = function()
{
	var oRet = null;

	/*
	 * The dependencies are worked out in the XPath expression
	 * evaluator, and stored in the array pointed to by g_arrSavedDependencies.
	 */

	g_bSaveDependencies = true;
	g_arrSavedDependencies = this.dependentExpressions;
	oRet = this.m_oModel.EvaluateXPath(this.m_sXPathExpr, this.m_oContextResolver);
	g_bSaveDependencies = false;
	return oRet;
}

/*
 * [ISSUE] This is almost exactly the same as ComputedXPathExpression,
 * but we don't call setValue() in update--so we may be able to merge
 * these two classes. (At the very least we should do the inheritance
 * the other way round, and call a base class update() method, before
 * calling ProxyNode::setValue().
 */


function MIPExpression(oProxy, sXPath, oContextResolver, oModel)
{
	MIPExpression.superclass.constructor.call(this, oProxy, sXPath, oContextResolver, oModel);
}

YAHOO.extend(MIPExpression, ComputedXPathExpression);


MIPExpression.prototype.update = function()
{
	var bRet = false;
	var oRes = this.m_oModel.EvaluateXPath(this.m_sXPathExpr, this.m_oContextResolver);

	if (oRes)
		bRet = oRes.booleanValue();

	this.value = bRet;
	return bRet;
}

function SubExpression(oProxy)
{
	this.m_oProxy = oProxy;
	this.value = null;
	this.identifier = function()
	{
		return "sub";
	}
}

/*
 * The update method need do nothing since we're only interested in
 * the dependencies.
 */

SubExpression.prototype.update = function()
{
	var oRet = null;

	this.value = oRet;
	return oRet;
}
