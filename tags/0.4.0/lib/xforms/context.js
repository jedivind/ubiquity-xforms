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

function Context(elmnt)
{
	this.element = elmnt;
	this.m_context = null;
	this.m_arrNodes = null;
	this.m_model = null;
	this.m_proxy = null;
}
Context.prototype.unwire = function()
{
	this.m_context = null;
	this.m_arrNodes = null;
}
//TODO: rewrite these functions to have more objectiness,
//	Originally written to remove an amount of stuff from the .htc
//	so just calls equivalent friend function with pThis.
//	This is no longer needed or desired, with the advent of the decorator stuff.

Context.prototype.getEvaluationContext = function(nOrdinal)
{
	return _getEvaluationContext(this,nOrdinal);
}


/*
	* If an element doesn't have an evaluation context then we
	* use the parent's.
	*/

Context.prototype.getParentEvaluationContext = function(nOrdinal)
{
	return _getParentEvaluationContext(this,nOrdinal);
}

/*
	* Get the node that this element is bound to.
	*/

Context.prototype.getBoundNode = function(nOrdinal)
{
	return _getBoundNode(this,nOrdinal);
}	

//Friend functions:

		function _getEvaluationContext(pThis,nOrdinal)
		{
		
			if(!nOrdinal || isNaN(nOrdinal))
				nOrdinal = 1;

			if(pThis.m_context && nOrdinal == 1)
			{
				return { model: pThis.m_context.model, node: pThis.m_context.node};
			}
			else if(pThis.m_arrNodes)
			{
				return { model: pThis.m_model, node: pThis.m_arrNodes[nOrdinal - 1]};
			}
				
			
			var oRet = { model: null, node: null };

			/*
			 * If we have a bind attribute then use it to find
			 * the model and evaluation context.
			 */

			var sBindID = pThis.element.getAttribute("bind");

			if (sBindID)
			{
				var oBind  = pThis.element.ownerDocument.getElementById(sBindID);

				if (oBind)
				{
					oRet.model = oBind["ownerModel"];
					if (oBind["boundNodeSet"])
						oRet.node = oBind["boundNodeSet"][nOrdinal-1];
					//else
					//	debugger;
				}
				//else
				//	throw "No bind with an ID of '" + sBindID + "'";
			}
			else {
				
				 //If there is a model attribute, or the element *is* a model
				 //    then subject to further checks, the evaluation context
				 //    may be retrieved from the model itself.
				 

				if (pThis.element.getAttribute("model")) {

					var oModel  = pThis.element.ownerDocument.getElementById(pThis.element.getAttribute("model"));
					//TODO: The form author cannot be relied upon to provide an IDREF in @model that actually corresponds
					//	to a model. In order to prevent errors throwing out and causing problems, a test is required to ensure that
					//	oModel, retrieved above does not only exist (as the following test proves) but is also actually a model 
					//	(a possibility which is ignored by the following test)
					//  (The obvious test of using a tagname for pThis should not be done as the behaviours should not need to know 
					//	what they are bound to, i.e. a node may behave as a model even without being a <model>)
					if (oModel) {
						//Having fetched a model node which corresponds to the given @model IDREF
						//	Find the model to which the parent element is bound.
						var oCTXModel = getModelFor(pThis.element.parentNode);
						//In the case that the parent's model and the model fetched from the @model IDREF
						//	are identical, the evaluation context for pThis node is the context gleaned
						//	from its position within the document, to wit, the same context as though it 
						//	had no model attribute at all.
						if(oCTXModel == oModel) {	
							oRet = _getParentEvaluationContext(pThis);
						}
						//Where the above clause is false, i.e. a disparity exists between the model to which 
						//	the parent node is bound, and the model to which pThis node is bound, then pThis node is
						//	not evaluated in the context of the parent node, but is evaluated in the default context for
						//	the model whose id matches the IDREF given in pThis element's model attribute.
						else {
							oRet = oModel.getEvaluationContext();
						}
					}
					else
						throw "No model with an ID of '" + sModelID + "'";
				}
				else {
                    //Otherwise  use the parent's evaluation context.
                    oRet = _getParentEvaluationContext(pThis);
                }
			}
			pThis.m_context = { model: oRet.model, node: oRet.node };
			return oRet;
		}
		
		
		function _getParentEvaluationContext(pThis,nOrdinal)
		{
			var oRet = { model: null, node: null };
			var oParent = pThis.element.parentNode;
			
			if(!nOrdinal || isNaN(nOrdinal))
			{
				var nOrdinal = Number(pThis.element.getAttribute("ordinal"));
				if(!nOrdinal || isNaN(nOrdinal))
					nOrdinal = 1;
			}
				
			while (oParent)
			{
			
				if(oParent.getBoundNode === undefined)
				{
					oParent = oParent.parentNode;
				}
				else
				{
					oRet = oParent.getBoundNode(nOrdinal);
					//if oParent is not the sort of node that binds to nodes
					//	then it will return a null-filled object.
					//	In this case, context needs to be passed through from its parent.
					if(oRet == null || (oRet.model == null && oRet.node == null))
					{
						//Although recursion would be the more beauteous solution here, 
						//	invoking it at this point leads inexorably to a stack overflow
						//	therefore, the less elegant solution of stepping round to the 
						//	next iteration of the loop is employed.	
						oParent = oParent.parentNode;
					}
					else
					{
						//Now that a real context has been found, leave the loop
						break;
					}
				}
			}

			/*
			 * If we don't get a context then we must be the
			 * highest element, so we use the evaluation context
			 * of the first model.
			 */

			if (!oParent)
			{
				//retrieve the first model in document order.	
				if(!document.defaultModel) {
					var models = NamespaceManager.getElementsByTagNameNS( pThis.element.ownerDocument, "http://www.w3.org/2002/xforms","model");
					if (models && models.length > 0) {
						document.defaultModel = models[0];
					}
				}
				
				if(document.defaultModel) {
					oRet = document.defaultModel.getEvaluationContext();
				}
			}
			return oRet;
		}

		function _getBoundNode(pThis,nOrdinal)
		{
			var oRet = { model: null, node: null };
			
			if(!nOrdinal || isNaN(nOrdinal))
				nOrdinal = 1;

			/*
			 * If we have a proxy node (and not a proxy expression)
			 * then use that.
			 */

			if (pThis.m_proxy && !pThis.m_proxy.m_xpath)
			{
				if (!pThis.m_model)
				{
					var oContext = _getEvaluationContext(pThis);

					pThis.m_model = oContext.model;
				}
				oRet = { model: pThis.m_model, node: pThis.m_proxy };
			}
			else if(pThis.tagName == "model")
			{
				oRet = pThis.getEvaluationContext();
			}
			else
			{
				
				//Bind has the highest priority - see:
				//	http://www.w3.org/TR/2006/REC-xforms-20060314/slice3.html#structure-attrs-single-node
				//	http://www.w3.org/TR/2006/REC-xforms-20060314/slice3.html#structure-attrs-nodeset
				if (pThis.element.getAttribute("bind"))
				{
					if (!pThis.m_arrNodes)
					{
						var oBind = pThis.element.ownerDocument.getElementById( pThis.element.getAttribute("bind"));

						pThis.m_arrNodes = oBind["boundNodeSet"];
						pThis.m_model = oBind["ownerModel"];
					}
					oRet.node = pThis.m_arrNodes[nOrdinal - 1];
					oRet.model = pThis.m_model;
				}
				else
				{
					//Don't bother going through all pThis palaver if there is no ref or nodeset.
					if(pThis.element.getAttribute("ref") || pThis.element.getAttribute("nodeset"))
					{
					   /*
						* Get the evaluation context, and save the model
						* value.
						*/
						var oContext = _getEvaluationContext(pThis);

						pThis.m_model = oContext.model;

						if (pThis.element.getAttribute("ref") && nOrdinal == 1)
						{
							oRet.node = getFirstNode(
								pThis.m_model.EvaluateXPath(pThis.element.getAttribute("ref"), oContext.node)
							);
							oRet.model = pThis.m_model;
						}
						else if (pThis.element.getAttribute("nodeset"))
						{
							if (!pThis.m_arrNodes)
								pThis.m_arrNodes = pThis.m_model.EvaluateXPath(pThis.element.getAttribute("nodeset"), oContext.node).value;

							oRet.node = pThis.m_arrNodes[nOrdinal - 1];
							oRet.model = pThis.m_model;
						}
					}
				}
			}
			return oRet;
		}
