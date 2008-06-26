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

function Instance(elmnt)
{
	this.element = elmnt;
	this.m_oDOM = null;
	this.elementState = 1;
	if(this.element.style)
	{
		this.element.style.display = "none";
	}

}

Instance.prototype.xlinkEmbed = function(s)
{
	this.m_oDOM = xmlParse(s);
	this.elementState = 0;
	this.parentNode.flagRebuild();
	return true;
};

Instance.prototype.initialisedom = function()
{
	if (!this.m_oDOM)
	{
		if (!this.getAttribute("src")) {
			this.parseInstance();
		}
		else
		{
			/*
				* We map our @src to an XLink.
				*/

			this.element.setAttribute("xlink:actuate", "onRequest");
			this.element.setAttribute("xlink:show", "embed");
			this.element.setAttribute("xlink:href", this.element.getAttribute("src"));
			this.element.setAttribute("base", " "); //Prevent XLink resolving the base URL.
			this.element.attachSingleBehaviour("XLinkElement");
		/*
				* When the document has been loaded by our XLink handler
				* we parse it and then fire a 'document load' event.
				*/

			this.element.addEventListener(
				"xlink-traversed",
				{
					context: this,
					handleEvent: function(evtParam)
					{
						//this.context.parseInstance();
						var evt = this.context.element.ownerDocument.createEvent("Events");
						evt.initEvent("instance-load", true, false);
						var oTarget = this.context.element;
						spawn(function(){FormsProcessor.dispatchEvent(oTarget,evt);});
					}
				},
				false
			);

			/*
				* [ISSUE] Need to decide how to actuate, since
				* onLoad is too late.
				*/

			this.element.Actuate();
		}
		
		if(this.m_oDOM) {
			this.m_oDOM.XFormsInstance = this;
		}
	}
};

Instance.prototype.parseInstance = function()
{
	var sXML = "";
	if(document.isFFXHTMLMode)
	{
		var o =  new XMLSerializer();
		var n = this.element.firstChild;
		while(n)
		{
			sXML += o.serializeToString(n);
			n =n.nextSibling;
		}
	}
	else
	{
		sXML = this.element.innerHTML;
	}
	if (sXML !== "")
	{
		this.m_oDOM = xmlParse(sXML);
		this.elementState = 0;
		this.parentNode.flagRebuild();
	}
	else
	{
		this.elementState = -1;
		this.setAttribute("elementStateDescription", "Cannot have an empty instance.");
	}
	return;
};

Instance.prototype.getDocument = function()
{
	this.m_oDOM.XFormsInstance = this;
	return this.m_oDOM;
};

Instance.prototype.replaceDocument = function(oDom)
{
	this.m_oDOM = null;
	this.m_oDOM = oDom;
	return;
};

Instance.prototype.onContentReady = Instance.prototype.initialisedom;

