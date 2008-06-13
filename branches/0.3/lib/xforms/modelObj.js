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

function Model(elmnt)
{
	this.element = elmnt;	
	this.m_bNeedRebuild = false;
	this.m_bNeedRecalculate = false;
	this.m_bNeedRevalidate = false;
	this.m_bNeedRewire = false;
	this.m_bNeedRefresh = false;
	this.m_bReady = false;
	this.elementState = 1;
	this.elementLoaded = false;
	this.m_arrProxyNodes = new Object();
	this.m_arControls = new Array();
}

Model.prototype.onDocumentReady = function()
{
	this.setElementLoaded();
	this._testForReady();
}
		Model.prototype.onContentReady = function()
		{
			return _model_contentReady(this);

		}//model_contentReady()

		Model.prototype.modelConstruct = function()
		{
			return _modelConstruct(this);
		}

		Model.prototype.modelConstructDone = function()
		{
			this.rewire();
			 window.status ="refreshing"
			this.refresh();

			var pThis = this;
			this.fireMCD();
			this.m_bReady = true;
		}
		
		Model.prototype.fireMCD = function()
		{
			var evt = this.element.ownerDocument.createEvent("Events");
			evt.initEvent("xforms-ready", true, false);
			evt._actionDepth = -1;
			FormsProcessor.dispatchEvent(this.element,evt);
		}
		
		Model.prototype.replaceInstanceDocument = function(sID, oDom)
		{
			return _replaceInstanceDocument(this,sID,oDom);
		}

		Model.prototype.getInstanceDocument = function(sID)
		{
			var oRet = null;
			var oInstance = null;

			if (sID && sID !== "")
			{
				oInstance = document.getElementById(sID);
			}
			else
			{
				oInstance = getElementsByTagNameNS(this.element, "xf","instance")[0];
			}	
			if (!oInstance)
				throw "No instance found with an ID of '" + sID + "'";
			else if(oInstance.parentNode !=this.element)
				throw "instance '" + sID + "' is not part of model '"+this.element.id+"'";
			else
				oRet = oInstance.m_oDOM;
				
			return oRet;
		}

		function getElementsByTagNameNS(el,prefix,tn)
		{
			if(document.all)
				return el.getElementsByTagName(tn);
			else
				return el.getElementsByTagName(prefix + ":" + tn);
		}
		
		Model.prototype.getEvaluationContext = function()
		{
			var oRet = { model: this, node: null };
			
			var ns = getElementsByTagNameNS(this.element,"xf","instance");
			
			/*
			 * [ISSUE] Check tagUrn.
			 */

			if (ns && ns.length > 0)
			{
				var oFirstInstance = ns[0];
				var oDom = oFirstInstance.getDocument();

				if (oDom)
				{
					oRet.node = getFirstNode(
						this.EvaluateXPath("/*", oDom)
					);
				}
			}
			else
				throw "Model ... has no instances";

			return oRet;
		}

		Model.prototype.getBoundNode = function()
		{
			return this.getEvaluationContext();
		}

		/*
		 * The setValue method allows us to set any node,
		 * via an XPath expression. A convenient shorthand
		 * in XForms is that setting a value on an element
		 * has the effect of setting the first text node.
		 */
		Model.prototype.setValue = function(oContext, sXPath, sExprValue)
		{
			//this.element.ownerDocument.xformslog.log("Setting '" + sXPath + "' to '" + sValue + "'", "mdl");
			var oNode = getFirstNode(
				this.EvaluateXPath(sXPath, oContext)
			);

			if (oNode)
			{
				/*
				 * Evaluate the value part.
				 * [TODO] It would be easier if we did what
				 * we do in fP where we evaluate an expression
				 * and also say what 'type' we want from DOM 3
				 * XPath.
				 */

				var sValue = getStringValue( this.EvaluateXPath(sExprValue, oNode) )

				/*
				 * If there is no proxy node then create one.
				 * [Q] Should we now store this? No reason why not,
				 * but it will only ever have default values.
				 */

				var oPN = oNode.m_proxy;

				if (!oPN)
				{
					oPN = new ProxyNode(oNode);
					oNode.m_proxy = oPN;
				}

				oPN.setValue(sValue, this);

				/*
				 * [ISSUE] This doesn't feel right, but we either
				 * have to do this or set the recalculate flag
				 * regardless of the vertices, to force things
				 * to 'drop through'. This feels the lesser, for
				 * now.
				 */

				this.m_bNeedRefresh = true;
			}
			return;
		}//setValue()


		/*
		 * The getValue method allows us to retrieve any node,
		 * via an XPath expression. A convenient shorthand
		 * in XForms is that requesting the value of an element
		 * has the effect of getting the first text node.
		 */

		Model.prototype.getValue = function(sXPath)
		{
			//this.element.ownerDocument.xformslog.log("Getting '" + sXPath + "'", "mdl");

			var oRet = this.EvaluateXPath(sXPath, this);

			return oRet;
		}//getValue()

		/*
		 * Evaluates an XPath expression, returning a
		 */

		Model.prototype.EvaluateXPath = function(sXPath, pContextResolver)
		{
			return _EvaluateXPath(this,sXPath, pContextResolver);
		}


		Model.prototype.addControl = function(oTarget)
		{
			/*
			 * Add the control to the list of controls
			 * attached to this model.
			 */

			this.m_arControls.push(oTarget);

//var sTemp = oTarget.element.innerHTML;

			//running these inline causes stack overflow, and "taking too long to respond" error messages to appear.
			//			oTarget.rewire();
			//			oTarget.refresh()

			var oTargetSaved = oTarget;
			if(this.m_bReady)
			{
				spawn(
					function()
					{
						try
						{
							if(oTargetSaved && typeof(oTargetSaved.element) == "object")
							{
								oTargetSaved.rewire();
								oTargetSaved.refresh();
							}
						}
						catch(e)
						{
							//debugger;
						}
					}
				);
			}
			return;
		}

		/*
		 * Creates a connection between a DOM node
		 * and a proxy node.
		 */

		Model.prototype.addBindingTemp = function(oContext, sXPath)
		{
			return _addBindingTemp(this,oContext,sXPath);
		}

		/*
		 * Creates a connection between a form control and a proxy node.
		 */

		Model.prototype.addControlBinding = function(oTarget)
		{

			/*
			 * Register for the change event from the control.
			 */

			oTarget.addEventListener(
				"target-value-changed",
				{
					model: this,
					handleEvent: function(evt)
					{
					
						var oPN = evt.target.m_proxy;

						if (oPN)
							oPN.setValue(evt.newValue, this.model);
					}
				},
				false
			);
			return;
		}

		/*
		 * Creates a connection between a form control and a DOM node,
		 * via a proxy node.
		 */

		Model.prototype.addControlExpression = function(oTarget, oContext, sXPath)
		{
			return _addControlExpression(this,oTarget, oContext, sXPath);
		}

		/*
		 * Adds a binding between a DOM node and a vertex.
		 */

		Model.prototype.AddSingleNodeBinding = function(oTarget, oContext, sXPath)
		{
			if (!oContext)
				oContext = this;

			var oSNE = new SingleNodeExpression(oTarget, sXPath, oContext, this, true);

			return oSNE;
		}

		Model.prototype.AddNodesetBinding = function(oTarget, oContext, sXPath)
		{
			if(!oContext)
				oContext = this;

			var oNE = new NodesetExpression(oTarget, sXPath, oContext, this, false);

			return oNE;
		}

		Model.prototype.AddMIP = function(arrContext,sXPath,sMIP)
		{
			for(var i = 0;i < arrContext.length;++i)			
			{
				arrContext[i];
			}
		}


		Model.prototype.rebuild = function()
		{

			/*
			 * Clear the dependency graph and the change list.
			 */

 			this.m_oDE.clear();
			this.changeList.clear();

			/*
			 * Process the bind statements.
			 */

			var oContext = this.getEvaluationContext();

			processBinds(this, this.element, oContext.node);

			this.m_bNeedRebuild = false;
			this.m_bNeedRecalculate = true;
		}

		Model.prototype.recalculate = function()
		{
			this.m_oDE.recalculate(this.changeList);

			/* these could go into one function */
			this.changeList.clear();
			this.m_bNeedRecalculate = false;
			this.m_bNeedRevalidate = true;
		}

		Model.prototype.revalidate = function()
		{
			this.m_bNeedRevalidate = false;
			this.m_bNeedRewire = true;
		}

		/*
		 * We give all of the controls the opportunity to
		 * update themselves.
		 */

		Model.prototype.rewire = function()
		{
			for (var i = 0; i < this.m_arControls.length; ++i)
			{
				var fc = this.m_arControls[i];

				if (fc && typeof(fc.element) == "object")
					fc.unwire();
				else
					this.m_arControls.splice(i);
			}	

			for (var i = 0; i < this.m_arControls.length; ++i)
			{
				var fc = this.m_arControls[i];

				if (fc && typeof(fc.element) == "object")
					fc.rewire();
				else
					this.m_arControls.splice(i);
			}
			
			this.m_bNeedRewire = false;
			this.m_bNeedRefresh = true;
			return;
		}
		
		Model.prototype.refresh = function()
		{
			var pThis = this;
			spawn(function(){pThis._refresh();});
		}
		
		Model.prototype._refresh = function()
		{
			if(this.m_bNeedRefresh)
			{
				this.m_bNeedRefresh = false;
				for (var i = 0; i < this.m_arControls.length; ++i)
				{
					var fc = this.m_arControls[i];

					if (fc && typeof(fc.element) == "object")
						fc.refresh();
					else
						this.m_arControls.splice(i);
				}
			}
 		 window.status =""

			return;
		}

		Model.prototype.deferredUpdate = function()
		{
			return _deferredUpdate(this);
		}

		/*
		 * P R I V A T E
		 * =============
		 */




		Model.prototype.createMIP = function(oVertex, sMIPName, sExpr, oPN, oContextNode)
		{
			return _createMIP(this,oVertex, sMIPName, sExpr, oPN, oContextNode);
		}
		
		Model.prototype._testForReady = function()
		{
			testForReady(this);
		}
		Model.prototype.setElementLoaded = function()
		{
			this["elementLoaded"] = true;

			return;
		}//setElementLoaded()