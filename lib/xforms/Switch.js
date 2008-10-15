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

function Switch(elmnt)
{
	this.element = elmnt;
	this.oCurrentCase = null;
}
		Switch.prototype.toggleDefault = function()
		{
			//Prepare to loop through the child nodes of the switch - 
			//	this list may include text nodes, and, if poorly authored, non-case elements.
			var caseColl = this.element.childNodes;
			var caseInHand = null;
			var candidateDefaultCase = null;
			var bCaseSelectedBySelectedAttribute = false;						
			for(var i = 0 ;i < caseColl.length;++i)
			{
				if(caseColl[i].nodeType == 1 && (caseColl[i]._case))
				{
					caseInHand = caseColl[i];
					if(candidateDefaultCase === null)
					{
						//This is the first case element in the nodelist, store it as a candidate default.
						candidateDefaultCase = caseInHand;
					}
					else if(!bCaseSelectedBySelectedAttribute && caseColl[i].getAttribute("selected") == "true" )
					{
						//This case is the first to have @selected="true", which trumps simple document-order
						if(candidateDefaultCase !== null)
						{
							candidateDefaultCase.deselect();
						}
						candidateDefaultCase = caseInHand;
						bCaseSelectedBySelectedAttribute = true;
					}
					else
					{
						//This is neither the first  case, nor the first case encountered with @selected=true.  
						//therefore, deselect it.
						caseInHand.deselect();
					}
				}
			}
			if(candidateDefaultCase!==null)
			{
				candidateDefaultCase.select();
				this.oCurrentCase = candidateDefaultCase;
			}
			
		}
		
		Switch.prototype.toggle = function(sCaseID)
		{
			/*
			 * The case must be a child so no need to search the
			 * whole document.
			 */

			var oCase = this.element.ownerDocument.getElementById(sCaseID);

			if (oCase)
			{
				if (this.oCurrentCase)
					this.oCurrentCase.deselect();
				oCase.select();
				this.oCurrentCase = oCase;
			}
		}
Switch.prototype.onDocumentReady = Switch.prototype.toggleDefault;
		