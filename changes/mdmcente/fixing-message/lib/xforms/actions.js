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

function Dispatch(elmnt) {
    this.element = elmnt;
}

Dispatch.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Dispatch.prototype.performAction = function (evt) {
    var sTargetID = UX.getPropertyValue(this, "target");
    var oTarget, sName, oEvt, delay_time;

    if (sTargetID) {
        oTarget = this.element.ownerDocument.getElementById(sTargetID);

        if (oTarget) {
            sName = UX.getPropertyValue(this, "name");

            if (sName) {
                oEvt = this.element.ownerDocument.createEvent("Events");

                oEvt.initEvent(sName, false, false);

                // Copy through the current event depth.

                oEvt._actionDepth = evt._actionDepth;

                delay_time = UX.getPropertyValue(this, "delay");
                if (!delay_time || isNaN(parseInt(delay_time, 10)) || delay_time < 0) {
                    delay_time = 0;
                }
                setTimeout(function() { FormsProcessor.dispatchEvent(oTarget,oEvt); }, delay_time);

                // I'm assuming that there is no point in copying the
                // 'new' depth, since it should be the same as the
                // old one...but that might not be true, hence the
                // debugger statement (now changed to throw).

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

function Message(elmnt) {
    this.element = elmnt;
    
    // hide the message, for ephemeral case
    document.notify.ephemeral(this.element, false);
    
    this.element.addEventListener("xforms-hint-off", this, true);
}

Message.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Message.prototype.performAction = function(evt) {
    var sLevel = this.element.getAttribute("level");
    // The context for our hint is the parent element.
    //
    var context = this.element.parentNode;
    
    switch (sLevel) {
        case "modeless":
            document.notify.MessageWindow(this, false);
            break;
            
        case "ephemeral":
            // Check to see if the message parent is valid.
            //
            if ( !context ) {
                throw "No context found for message";
            }
            
            // The positioning of the message is relative to its container so
            // indicate that it's a message container, so that the CSS styles
            // in message.css can kick in.
            //
            UX.addClassName(context, "xf-message-container");
            
            // An ephemeral message will "act" like a hint, in fact, the xforms-hint-off event can be used
            // to turn-off the message, just like a hint.  The ephemeral message will be shown and a user
            // can click on the ephemeral message to turn it off, otherwise it times out.
            if ( (evt.type === "xforms-hint-off") && (evt.target.parentNode === this.element) ) {
                document.notify.ephemeral(this.element, false);
            } else {
                document.notify.ephemeral(this.element, true);
            }
            break;
            
        case "modal":
        default :
            document.notify.MessageWindow(this, true);
            break;
    }
};




