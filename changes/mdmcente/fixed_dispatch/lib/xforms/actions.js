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

//[TODO]  (issue 10) Now that loading performance is not a concern, break actions.js into one class per file
/**
	Event handlers are mandated to be invoked by their "handleEvent" member function, 
	however, XForms provides the possibility for events to be conditionally invoked, 
	or looped. XForms Actions, therefore, implement the "performAction" method, and  
	use DeferToConditionalInvocationProcessor as handleEvent
	
	@param {Event} evt An object reprenting the event that is occuring.
*/
function DeferToConditionalInvocationProcessor(evt)
{
	ActionExecutor.invokeListener(ConditionalInvocationListener(this,"performAction"), evt);
}
/**
	Used in conjunction with Conditional Invocation
*/
function ConditionalInvocationListener(obj,funcName)
{
	return {realListener:obj,handleEvent:function(evt){return obj[funcName](evt);}}
}

function Recalculate(elmnt)
{
	this.element = elmnt;
}


Recalculate.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Recalculate.prototype.performAction = function(evt)
{
	var sModelID = this.element.getAttribute("model");
	var oModel = this.element.ownerDocument.getElementById(sModelID);
	oModel.recalculate();
};


function Recalculate(elmnt)
{
	this.element = elmnt;
}


Recalculate.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Recalculate.prototype.performAction = function(evt)
{
	var sModelID = this.element.getAttribute("model");
	var oModel = this.element.ownerDocument.getElementById(sModelID);
	oModel.recalculate();
};

function Dispatch(elmnt)
{
	this.element = elmnt;
}

var pTarget = null;
var pEvt = null;

function dispatch() {
    FormsProcessor.dispatchEvent(pTarget, pEvt);
}

function getDispatchVariable(pThis, type) {
	var sType = pThis.element.getAttribute(type);
	var aChildNode = NamespaceManager.getElementsByTagNameNS(pThis.element,"http://www.w3.org/2002/xforms",type)[0];
	var oContext = null;
	var node = null;
	
	if (aChildNode) {
	
		if (UX.isIE) {
			sType = aChildNode.innerText;
		}
		else {
			sType = aChildNode.textContent;
		}
		if (aChildNode.getAttribute("value")) {
			oContext = _getEvaluationContext(pThis);
			node = getFirstNode(
				oContext.model.EvaluateXPath(aChildNode.getAttribute("value"), oContext.node)
			);
			if (node) {
				sType = node.firstChild.nodeValue;
			}
			else {
				sType = "";
			}
		}
	
	}	
	return sType;
}

Dispatch.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Dispatch.prototype.performAction = function (evt)
{	
	var sTargetID = getDispatchVariable(this, "target");

	if (sTargetID)
	{
		var oTarget = this.element.ownerDocument.getElementById(sTargetID);

		if (oTarget)
		{
			var sName = getDispatchVariable(this, "name");

			if (sName)
			{
				var oEvt = this.element.ownerDocument.createEvent("Events");

				oEvt.initEvent(sName, false, false);

				/*
					* Copy through the current event depth.
					*/

				oEvt._actionDepth = evt._actionDepth;
				
				var delay_time = getDispatchVariable(this, "delay");
				
				if (!delay_time || isNaN(parseInt(delay_time, 10)) || delay_time < 0) {
					delay_time = 0;
				}
				
				if (UX.isIE && delay_time !== 0) {
					pTarget = oTarget;
					pEvt = oEvt;
					setTimeout(function() { dispatch(); }, delay_time);
				}
				else if (UX.isIE) {
					FormsProcessor.dispatchEvent(oTarget,oEvt);
				}
				else {
					setTimeout(function(a,b) { FormsProcessor.dispatchEvent(a,b); }, delay_time, oTarget, oEvt);
				}

				/*
					* I'm assuming that there is no point in copying the
					* 'new' depth, since it should be the same as the
					* old one...but that might not be true, hence the
					* debugger statement (now changed to throw).
					*/

				if (evt._actionDepth != oEvt._actionDepth) {
					throw "Unexpected Discord between action depths.";
				}
			}
		}
	}
};

function Send(elmnt)
{
	this.element = elmnt;
}

Send.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Send.prototype.performAction = function (evt)
{	
	var sID = this.element.getAttribute("submission");
	if (sID)
	{
		evt.target.ownerDocument.logger.log("Sending to '" + sID + "'", "submission");

		var oSubmission =document.getElementById(sID);

		if (oSubmission)
		{
			var oEvt = this.ownerDocument.createEvent("Events");

			oEvt.initEvent("xforms-submit", false, false, null, null);

			/*
				* Copy through the current event depth.
				*/

			oEvt._actionDepth = evt._actionDepth;
			spawn(function(){FormsProcessor.dispatchEvent(oSubmission,oEvt)});

			/*
				* I'm assuming that there is no point in copying the
				* 'new' depth, since it should be the same as the
				* old one...but that might not be true, hence the
				* debugger statement (now changed to throw).
				*/

			if (evt._actionDepth != oEvt._actionDepth) {
				throw "Unexpected Discord between action depths."
			}
		}
		else {
			throw "There is no submission element with an ID of '" + sID + "'";
		}
	}
	else {
		throw "A submission ID is required.";
	}
};

function Load(elmnt)
{
	this.element = elmnt;
}

Load.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Load.prototype.performAction 	= function(evt)
{
	if (evt.type == "xlink-traversed")
	{
		try
		{
			this.element.removeBehaviour(this.m_cookie);
			this.m_cookie = 0;
		}
		catch(e)
		{
			//debugger;
		}
	}
	else
	{
		if (!this.m_cookie)
		{
			this.element.setAttribute("xlink:href", this.element.getAttribute("resource"));
			this.element.setAttribute("xlink:show", this.element.getAttribute("show"));
			//element.setAttribute("xlink:actuate","onLoad");
			var sTarget = this.element.getAttribute("target")

			if (sTarget == undefined || sTarget == "")
			{
				debugger;
				var sId = evt.target.id;

				if (sId != "")
					this.element.setAttribute("target", sId);
			}
			this.element.addEventListener("xlink-traversed",this);
			
			this.m_cookie = this.element.addBehavior("runtime/xlink.htc");
			this.element.Actuate();
		}
	}
};


function Message(elmnt)
{
	this.element = elmnt;
}

Message.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Message.prototype.performAction = function(evt)
{
    var sLevel = this.getAttribute("level");

	switch (sLevel)
	{
		case "modal":
		    /*
		     * Ideally we'd register on the close event and delete the panel
		     * at that point, but I can't get it working. :)
		     */

            if (this.yahooPanel)
            {
                this.yahooPanel.destroy();
                this.yahooPanel = null;
            }

            /*
             * Create a modal panel.
             */

          this.yahooPanel = new YAHOO.widget.SimpleDialog(
    	        "temp-modal",
    	        {
	                icon: YAHOO.widget.SimpleDialog.ICON_WARN, 
    	            fixedcenter: true,
    	            constraintoviewport: true,
    	            modal: true,
    	            visible: false,
    	            width: (UX.getStyle(this.element, "width")) ? UX.getStyle(this.element, "width") : "300px",
    	            height: (UX.getStyle(this.element, "height")) ? UX.getStyle(this.element, "height") : "200px"
    	        }
    	    );
    	    //this.yahooPanel.setHeader("Modal dialog");
    	    this.yahooPanel.setBody(this.element.innerHTML);
    	    this.yahooPanel.render(document.body);
    	    //this.yahooPanel.setFooter("Some footer");
    	    //this.yahooPanel.render(); //if you want to reuse the xf:message

            this.yahooPanel.show();
            break;

        case "modeless":
            document.Yowl.notify(
                this.element.title,
                this.element.title,
                this.element.innerHTML,
                "fP",
                "alarm.png",
                false,
                0
            );
		    break;

        case "ephemeral":
            if (!this.yahooPanel)
            {
                this.yahooPanel = new YAHOO.widget.Overlay(
          		    this.element,
          		    {
          		        //visible: false,
          		        width:  (UX.getStyle(this.element, "width")) ? UX.getStyle(this.element, "width") : "300px",
          		        height: (UX.getStyle(this.element, "height")) ? UX.getStyle(this.element, "height") : "200px",
          		        context: [ evt.targetElement, "tl", "bl" ]
          		    }
          		);

          		//this.yahooPanel.setHeader("Ephemeral dialog");
          		//this.yahooPanel.setBody(this.element.innerHTML);
          		//this.yahooPanel.render(document.body);
          		//this.yahooPanel.render();
            }
            else
              this.yahooPanel.show();
		    break;

        default :
    			throw "E_NOTIMPL";
	}
};




