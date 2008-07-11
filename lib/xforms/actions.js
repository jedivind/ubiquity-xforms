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

function ConditionalInvocationListener(obj,funcName)
{
	return {realListener:obj,handleEvent:function(evt){return obj[funcName](evt);}}
}

function Recalculate(elmnt)
{
	this.element = elmnt;
}

function DeferToConditionalInvocationProcessor(evt)
{
	FormsProcessor.invokeListener(ConditionalInvocationListener(this,"performAction"), evt);
}

Recalculate.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Recalculate.prototype.performAction = function(evt)
{
	var sModelID = this.element["model"];
	var oModel = this.element.ownerDocument.getElementById(sModelID);
	oModel.recalculate();
}

function Toggle(elmnt)
{
	this.element = elmnt;
}

Toggle.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Toggle.prototype.performAction = function (evt)
{

	var sCaseID = this.element["case"];
	var oCase = this.element.ownerDocument.getElementById(sCaseID);
	var oSwitch = oCase.parentElement;
	oSwitch.toggle(sCaseID);
}

function Dispatch(elmnt)
{
	this.element = elmnt;
}

Dispatch.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Dispatch.prototype.performAction = function (evt)
{	
	var sTargetID = this.element["target"];

	if (sTargetID)
	{
		var oTarget = this.element.ownerDocument.all[sTargetID];

		if (oTarget)
		{
			var sName = this.element["name"];

			if (sName)
			{
				var oEvt = this.element.ownerDocument.createEvent("Events");

				oEvt.initEvent(sName, false, false);

				/*
					* Copy through the current event depth.
					*/

				oEvt._actionDepth = evt._actionDepth;
				FormsProcessor.dispatchEvent(oTarget,oEvt);

				/*
					* I'm assuming that there is no point in copying the
					* 'new' depth, since it should be the same as the
					* old one...but that might not be true, hence the
					* debugger statement.
					*/

				if (evt._actionDepth != oEvt._actionDepth)
					debugger;
			}
		}
	}
}

function Send(elmnt)
{
	this.element = elmnt;
}

Send.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Send.prototype.performAction = function (evt)
{	
	var sID = this.element["submission"];

	if (sID)
	{
		evt.target.document.logger.log("Sending to '" + sID + "'", "submission");

		var oSubmission =document.getElementById(sID);

		if (oSubmission)
		{
			var oEvt = this.ownerDocument.createEvent("SubmissionEvents");

			oEvt.initSubmissionEvent("xforms-submit", false, false, null, null);

			/*
				* Copy through the current event depth.
				*/

			oEvt._actionDepth = evt._actionDepth;
			spawn(function(){FormsProcessor.dispatchEvent(oSubmission,oEvt)});

			/*
				* I'm assuming that there is no point in copying the
				* 'new' depth, since it should be the same as the
				* old one...but that might not be true, hence the
				* debugger statement.
				*/

			if (evt._actionDepth != oEvt._actionDepth)
				debugger;
		}
		else
			throw "There is no submission element with an ID of '" + sID + "'";
	}
	else
		throw "A submission ID is required.";
}

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
}


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
    	            width: (this.element.style.width) ? this.element.style.width : "300px",
    	            height: (this.element.style.height) ? this.element.style.height : "200px"
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
          		        width: (this.element.style.width) ? this.element.style.width : "300px",
          		        height: (this.element.style.height) ? this.element.style.height : "200px",
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
}