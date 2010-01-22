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

function DojoInputValue(elmnt)
{
	
  	this.element = elmnt;
  	this.curValue = "";
  	this.m_bFirstSetValue = true;
  	this.widgetInstance = null;
}

DojoInputValue.prototype.valueChangedIE = function(pThis,newValue)
{
	/*
	 * [ISSUE] Not really suitable to use mutation events.
	 */

	var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
	
	oEvt.initMutationEvent("control-value-changed", true, true,
		null, pThis.currValue, newValue, null, null);

	spawn(function(){FormsProcessor.dispatchEvent(pThis.element,oEvt);});

}

DojoInputValue.prototype.valueChangedFF = function(pThis,newValue)
{
	/*
	 * [ISSUE] Not really suitable to use mutation events.
	 */
	var oEvt = pThis.element.ownerDocument.createEvent("MutationEvents");
	
	oEvt.initMutationEvent("control-value-changed", true, true,
		null, pThis.currValue, newValue, null, null);

	FormsProcessor.dispatchEvent(pThis.element,oEvt);

}

DojoInputValue.prototype.getOwnerNodeName  = function()
{
	return NamespaceManager.getLowerCaseLocalName(this.element.parentNode);
};

DojoInputValue.prototype.onDocumentReady = function()
{
	if (this.element.ownerDocument.media != "print")
	{ 
		var oInput = document.createElement("input");
		this.element.appendChild(oInput);

        var widgetName = this.element.parentNode.getAttribute("widget");
		dojo.require(widgetName);
		var widgetClass = dojo.getObject(widgetName);
		
		var widgetProps = {
		  "store" : null,
		  "queryExpr" : "name"
		};
		this.widgetInstance = new widgetClass( widgetProps, oInput );

        var eventName = (this.element.parentNode.getAttribute("incremental") === "true")
			? "keyup"
			: "change";

		UX.addStyle(oInput, "backgroundColor", "transparent");
		UX.addStyle(oInput, "padding", "0");
		UX.addStyle(oInput, "margin", "0");
		UX.addStyle(oInput, "border", "0");

		var pThis = this;
		dojo.connect( this.widgetInstance, "_setValueAttr", null,
		  function(newValue) { 
		      pThis.valueChangedFF(pThis, newValue); 
		  } );

	}
};

DojoInputValue.prototype.setValue = function(sValue)
{
	var bRet = false;
	
	if(this.m_bFirstSetValue || this.curValue!=sValue)	{  // initial setup or diff value coming from the model
		this.m_bFirstSetValue = false;
		this.curValue = sValue;
		
	    // can we figure out what type to assign?
	    var curWidgetValue = this.widgetInstance.attr( "value" );
	    if ( typeof curWidgetValue == "number" ) {
	       this.widgetInstance.attr( "value", parseInt( sValue ) );
	    }
	    else {
		  this.widgetInstance.attr("value", sValue);
		};
		bRet = true;
	}
	return bRet;
};

DojoInputValue.prototype.isTypeAllowed = function(sType) {
    // Data Binding Restrictions: Binds to any simpleContent (except xsd:base64Binary,
    // xsd:hexBinary or any datatype derived from these).
    var arrSegments, prefix, localPart, namespace;

    arrSegments = sType.split(":");
    prefix = arrSegments.length === 2 ? arrSegments[0] : "";
    localPart = arrSegments.length === 2 ? arrSegments[1] : "";
    namespace = NamespaceManager.getNamespaceURIForPrefix(prefix);

    return ((namespace === "http://www.w3.org/2001/XMLSchema" || namespace === "http://www.w3.org/2002/xforms") &&
            localPart !== "base64Binary" && localPart !== "hexBinary" &&
            !this.parentNode.isBoundToComplexContent());
};
