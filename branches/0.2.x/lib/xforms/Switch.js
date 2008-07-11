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

		/*
		 * [ISSUE] This isn't quite right, because if there is
		 * only one child element of the switch, and it is not
		 * a case element, calling select() on it will throw an
		 * exception. Also, the case that is actually selected
		 * will get both an xforms-deselect and an xforms-select
		 * event.
		 */
		Switch.prototype.toggleDefault = function()
		{
			var caseColl = this.element.childNodes;
			var caseInHand = this.element.firstChild;
			var defaultCaseSelected = false;						
			for(var i = 0 ;i < caseColl.length;++i)
			{
				if(caseColl[i].nodeType == 1 && caseColl[i].tagName == "case")
				{
					caseColl[i].deselect();
					if(!defaultCaseSelected && caseColl[i].getAttribute("selected") == "true")
					{
						caseInHand = caseColl[i];
					}
				}
			}
			
			if(caseInHand!=null)
			{
				caseInHand.select();
				this.oCurrentCase = caseInHand;
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
		