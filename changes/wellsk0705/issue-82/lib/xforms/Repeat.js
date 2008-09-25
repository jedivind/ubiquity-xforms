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

function Repeat(elmnt)
{
	this.element = elmnt;
	this.m_nLastStartIndex = -1;
	this.m_nIndex = 1;
	this.element.iterationTagName = "group";
	this.m_CurrentIterationCount = 0;
	//MUST occur prior to oncontentready, as otherwise, access to the DOM by descendent 
	//	(.htc-bound) nodes may cause crashes.
}

		
		Repeat.prototype.onDocumentReady = function()
		{
			this.storeTemplate();
			this.addcontroltomodel();
			this.element.addEventListener(
					"DOMActivate",
					{
						control: this,
						handleEvent: function(evt)
						{
							this.control.Activate(evt.target);
						}
					},
					true
				);

		}
		
		Repeat.prototype.Activate  = function(o)
		{
			var coll = this.element.childNodes;
			var len = coll.length;
			for(var i = 0;i < len;++i)
			{
				if(coll[i].contains(o))
				{
					this.m_nIndex = i + 1;
					break;
				}
			}
		}
		
		Repeat.prototype.storeTemplate = function()
		{
			this.element.setAttribute("sTemplate",this.element.innerHTML);
		    UX.addClassName(this.element, "repeat-ready");
			while(this.element.childNodes.length)
			{
				this.element.removeChild(this.element.firstChild);
			}
		}

		//register this element with the model
		
		Repeat.prototype.addcontroltomodel = function()
		{
			if (!this.m_bAddedToModel)
			{
				var oModel = getModelFor(this);
				if (oModel)
					oModel.addControl(this);
				else
					debugger;
			}
			else /* shouldn't be called twice */
				debugger;
		}

		Repeat.prototype.refresh = function()
		{

		}

		Repeat.prototype.rewire = function()
		{
		
			var arrNodes = null;
			var sExpr = this.element.getAttribute("nodeset");
			
			if (!sExpr)
			{
				var sBind = this.element.getAttribute("bind");
				
				if (!sBind)
				{
					//debugger; /* the repeat has neither a @nodeset or a @bind */
				}
				else
				{
					var oBind = this.element.ownerDocument.getElementById(sBind);
					
					if (!oBind)
					{
						debugger; /* bind not found with this ID */
					}
					else
					{
						arrNodes = oBind["boundNodeSet"];
						this.m_model = oBind["ownerModel"];
					}
				}
			}
			else
			{
			
				this.element.ownerDocument.logger.log("Rewiring: " + this.element.tagName + ":" + this.element.uniqueID
					+ ":" + sExpr, "info");
					
				
				var oContext = this.element.getEvaluationContext();
				this.m_model = oContext.model;
				var r = this.m_model.EvaluateXPath(sExpr);
			
				arrNodes = r.value;
			}
			
			if (arrNodes)
			{
				//Alter the number of iterations, if appropriate
				//
			
				var sNumber = this.getAttribute("number");
				var desiredIterationCount = 0;

				if(sNumber == null || isNaN(sNumber))
				{
					//without a number attribute, vary the repeat with the size of the nodeset.
					desiredIterationCount = arrNodes.length;
				}
				else
				{
					desiredIterationCount =  Number(sNumber);
				}

				var sStartIndex = this.element.getAttribute("startindex");
				var nStartIndex;
				if(sStartIndex == null || isNaN(sStartIndex))
				{
					nStartIndex = 1;
				}
				else
				{
					nStartIndex = Number(sStartIndex);
				}
				
				var lastIndex = desiredIterationCount + nStartIndex - 1;
				if(desiredIterationCount <= this.m_CurrentIterationCount)
				{
					//trim any superfluous iterations if desired.
					while(this.element.childNodes.length > desiredIterationCount)
					{
						this.element.removeChild(this.element.lastChild);
					}
					this.m_CurrentIterationCount = this.element.childNodes.length;
				}
				
				if(desiredIterationCount <= this.m_CurrentIterationCount && nStartIndex == this.m_nLastStartIndex)
				{
					//do nothing
				}
				else
				{
					var coll = this.element.childNodes;
					var arrExtraIterations = new Array();
					for(var i = 0; i < desiredIterationCount; ++i)
					{
						var iCurrentIndex = i + nStartIndex;
						if(coll[i])
						{
							if(nStartIndex != this.m_nLastStartIndex)
								coll[i].setAttribute("ordinal",iCurrentIndex);
						}
						else
						{
							//In the absence of an iteration corresponding to this index, insert one.
							var sDefaultPrefix = NamespaceManager.getOutputPrefixesFromURI( "http://www.w3.org/2002/xforms")[0] + ":";
							arrExtraIterations.push("<" + sDefaultPrefix+this.element.iterationTagName+" ref='.' ordinal='"+iCurrentIndex+"' class='repeat-iteration'>" + this.element.getAttribute("sTemplate") + "</" +sDefaultPrefix+this.element.iterationTagName+">");
						}
					}
					this.m_nLastStartIndex = nStartIndex;

					if(arrExtraIterations.length> 0)
					{
						var sExtraIterations = arrExtraIterations.join("");
						var pThis = this;
						//spawn(function(){pThis.element.insertAdjacentHTML("beforeEnd",sExtraIterations);window.status = "";});
						pThis.element.insertAdjacentHTML("beforeEnd",sExtraIterations);
						window.status = "";
						//set the status bar, to fix the progress bar.
						//See: http://support.microsoft.com/default.aspx?scid=kb;en-us;Q320731
						
					}
				}
				this.m_CurrentIterationCount = desiredIterationCount;
				//this.element.ownerDocument.logger.log("Rewiring complete: " + this.element.tagName + ":" + this.element.uniqueID
				//	+ ":" + sExpr + " iterations added:" , "info");
			}
			return false;
		}
		
		
		
		Repeat.prototype.getIndex = function()
		{
			return this.m_nIndex;
		}
