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

function Value(elmnt)
{
	this.element = elmnt;
	this.element.style.display = "none";
}

Value.prototype.onContentReady = function(){

	if(this.element.parentNode.m_ancestorEventTarget){
        this.element.parentNode.m_ancestorEventTarget.addItem(this.element.parentNode);
	}
}

Value.prototype.getValue = function()
{
  if(this.m_sValue === undefined) {
    if(DOM_TEXT_NODE === this.element.firstChild.nodeType) {
  	  this.m_sValue = this.element.firstChild.nodeValue;
  	}
  	else {
  	  this.m_sValue = "";
  	}
  }
  
	return this.m_sValue;
};

function Itemset(elmnt)
{
	this.element = elmnt;
	this.element.iterationTagName = "item";
}
//TODO: The  functions here have just been pasted from the .htc, and have not been checked for 
//	compatibility with the new .js object mechanism.  Certainly, functions towards the end are not 
//	expected to work.
function Item(elmnt)
{
	this.m_value = null;
	this.m_bSelected = false;
	this.m_bReady = false;		
	this.m_ancestorEventTarget = null;
	this.element = elmnt;
}


Item.prototype.getAncestorEventTarget = function() {
	if(!this.m_ancestorEventTarget) {
		var el  = this.element.parentNode;
    //seek through ancestors until the select is found.
		while(el) {
      var s = NamespaceManager.getLowerCaseLocalName(el);
      if(s.indexOf("select") == 0) {
				this.m_ancestorEventTarget = el;
				break;
			}
			el = el.parentNode;
     }
	}
	return this.m_ancestorEventTarget;
};

Item.prototype.getLabel = function() {
  
  var s;
  if(this.m_label) {
    s = this.m_label.getValue();
  }
  else {
    s = this.m_value.getValue();
  }
  return s;
}



Item.prototype.findValueElement = function()
{
	var coll = NamespaceManager.getElementsByTagNameNS(this.element,"http://www.w3.org/2002/xforms","value");
	for(var i = 0;i < coll.length;++i)
	{
		if(coll[i].parentNode == this.element)
		{
			this.m_value = coll[i];
			break;
		}
	}
	
};

Item.prototype.findLabelElement = function()
{
	var coll = NamespaceManager.getElementsByTagNameNS(this.element,"http://www.w3.org/2002/xforms","label");
	for(var i = 0;i < coll.length;++i)
	{
		if(coll[i].parentNode == this.element)
		{
			this.m_label = coll[i];
			break;
		}
	}
	
};

Item.prototype.onContentReady = function()
{
	this.findValueElement();
	this.findLabelElement();
	this.addVisualRepresentation();

	var ownerSelect = this.getAncestorEventTarget()
	if(ownerSelect) {
  	var pThis = this;
  	ownerSelect.addEventListener("selection-changed", function(e){pThis.handleEvent(e);}, false);

  	this.addEventListener(
  		"DOMActivate",
  		{
  			handleEvent: function(evt)
  			{
  				evt.currentTarget.toggleSelectionStatus();
  			}
  		},
  		false
  	);
  }
	if(!this.m_bReady)
	{
		//appear as though deselected.
		this.m_bSelected = false;
		YAHOO.util.Dom.addClass(this.element, "pc-deselected");
	}
};

Item.prototype.addVisualRepresentation = function()
{

};

Item.prototype.handleEvent = function(oEvt)
{
	if(oEvt.type == "selection-changed" && oEvt.target == this.getAncestorEventTarget())
	{
		if(typeof(oEvt.newValue) == "object")
		{
			oEvt.newValue = this.array_tryDataselect(oEvt.newValue);
		}
		else
		{
			this.string_tryDataselect(oEvt.newValue);
		}
	}
};

Item.prototype.getValue = function()
{
  if(this.m_value.getValue) {
	  return this.m_value.getValue();
	}
	else {
	  return "";
	}
};

Item.prototype.string_tryDataselect = function(s)
{

	if(s != "" && s == this.getValue())
	{
		this.onDataSelect();
		return true;
	}
	else
	{
		this.onDataDeselect();
		return false;			
	}
};

Item.prototype.array_tryDataselect = function(arr)
{
	//given an array, search for this value,
	//	if present, 
	var s = this.getValue();
//	debugger;
	if(s != "")
	{
		for(var i = 0;i < arr.length;++i)
		{
			if(s == arr[i])
			{
				this.onDataSelect();
				arr.splice(i,1);
				return arr;
			}
		}
	}
	this.onDataDeselect();
	return arr;
};

Item.prototype.toggleSelectionStatus = function()
{
	//switch the selected status first, not last,
	//	else the status may switch fall out-of-phase due to data
	//	oriented status changes;
	var bSelected = !this.m_bSelected;
	
	if(bSelected)
	{
		this.onUserSelect();
	}
	else
	{
		this.onUserDeselect();
	}
};

Item.prototype.onUserSelect = function()
{
	var oEvt = this.element.ownerDocument.createEvent("Events");
	oEvt.initEvent("fp-select", true, true);
	var elmnt = this.element;
	spawn(function(){FormsProcessor.dispatchEvent(elmnt,oEvt);});
};

Item.prototype.onUserDeselect = function()
{
	var oEvt = this.element.ownerDocument.createEvent("Events");
	oEvt.initEvent("fp-deselect", true, true);
	var elmnt = this.element;
	spawn(function(){FormsProcessor.dispatchEvent(elmnt,oEvt);});
};

Item.prototype.onDataSelect = function()
{
	if(!this.m_bSelected || !this.m_bReady)
	{
		this.m_bSelected = true;
		YAHOO.util.Dom.removeClass(this.element,"pc-deselected");
		YAHOO.util.Dom.addClass(this.element, "pc-selected");
		var oEvt = this.element.ownerDocument.createEvent("Events");
		oEvt.initEvent("xforms-select", true, true);
		FormsProcessor.dispatchEvent(this.element,oEvt);
		this.m_bReady = true;
	}
};

Item.prototype.onDataDeselect = function()
{
	if(this.m_bSelected || !this.m_bReady)
	{
		this.m_bSelected = false;
		YAHOO.util.Dom.removeClass(this.element,"pc-selected");
		YAHOO.util.Dom.addClass(this.element, "pc-deselected");
		var oEvt = this.element.ownerDocument.createEvent("Events");
		oEvt.initEvent("xforms-deselect", true, true);
		FormsProcessor.dispatchEvent(this.element,oEvt);
		this.m_bReady = true;
	}
};