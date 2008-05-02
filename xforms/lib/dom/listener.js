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
		 * The key to the whole thing is @ev:event, so there's
		 * no point in proceeding if we don't have that.
		 */

function Listener(elmnt)
{
	this.element = elmnt;
}

		//attachListeners();

		Listener.prototype.attachListeners = function()
		{
			var oAttr = this.element.getAttribute("ev:event");
			var sType = oAttr ? String(oAttr) : "";

			if (sType != "")
			{

				try
				{
					var sID = this.element.getAttribute("ev:observer");
					var oObserver = null;

					/*
					* [TODO] What if the element doesn't exist yet?
					*/

					if (!sID)
						oObserver = this.element.parentNode;
					else
						oObserver = this.element.document.getElementById(sID);

					/*
					* Get the "phase" value, which can either be "capture"
					* or "default".
					*/

					var sPhase = this.element.getAttribute("ev:phase");
					var bUseCapture;

					switch (sPhase)
					{
						case "capture":
							bUseCapture = true;
							break;

						case "default":
						default:
							bUseCapture = false;
							break;
					}

					if (oObserver && sType != "")
					{
						//Firefox EventTarget::addEventListener will not take an element as a listener
						//	even if it exposes a handleEvent method.
						//In order to work around this, a proxy function is required.

						var thisAsListener;
						if(document.all)
							thisAsListener = this;
						else
						{
		   					var o = this.element;
   							thisAsListener = function(evt){o.handleEvent(evt);}
   						}

   						oObserver.addEventListener(sType, thisAsListener, bUseCapture);

					}
				}
				catch(e)
				{
					debugger;
				}
			}
		}//attach()

		 Listener.prototype.detach = function()
		{
			/*
			 * [TODO] Detach the registered listener.
			 */
		}
		
		Listener.prototype.onDocumentReady = Listener.prototype.attachListeners;
