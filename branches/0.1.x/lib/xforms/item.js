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
		
Value.prototype.getvalue = function()
{
	return this.innerText;
}

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


Item.prototype.getAncestorEventTarget = function()
{
	if(this.m_ancestorEventTarget)
		return this.m_ancestorEventTarget;
	else
	{
		var el  = this.element.parentElement;
		while(el)
		{
		/*
			var s = typeof(el.addEventListener);
			if(s == "function" || s == "unknown")
			{
				m_ancestorEventTarget = el;
				return m_ancestorEventTarget;
			}
		*/
			var s = el.tagName;
			if(s.indexOf("select") == 0)
			{
				this.m_ancestorEventTarget = el;
				return this.m_ancestorEventTarget;
			}
			
			el = el.parentElement;
		}
	}
}

Item.prototype.onContentReady = function()
{
	this.findValueElement();
	this.addVisualRepresentation();
	this.getAncestorEventTarget().addEventListener("selection-changed", this, false);
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
	if(!this.m_bReady)
	{
		//appear as though deselected.
		this.m_bSelected = false;
		YAHOO.util.Dom.addClass(this.element, "pc-deselected");
	}
}

Item.prototype.addVisualRepresentation = function()
{

}

Item.prototype.findValueElement = function()
{
	var coll = this.element.getElementsByTagName("value");
	for(var i = 0;i < coll.length;++i)
	{
		if(coll[i].parentElement == this.element)
		{
			this.m_value = coll[i];
			break;
		}
	}
	
}

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
}

Item.prototype.getvalue = function()
{
	return this.m_value.getvalue();
}

Item.prototype.string_tryDataselect = function(s)
{

	if(s != "" && s == this.getvalue())
	{
		this.onDataSelect();
		return true;
	}
	else
	{
		this.onDataDeselect();
		return false;			
	}
}

Item.prototype.array_tryDataselect = function(arr)
{
	//given an array, search for this value,
	//	if present, 
	var s = this.getvalue();
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
}

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
}

Item.prototype.onUserSelect = function()
{
	var oEvt = this.element.ownerDocument.createEvent("Events");
	oEvt.initEvent("fp-select", true, true);
	var elmnt = this.element;
	spawn(function(){FormsProcessor.dispatchEvent(elmnt,oEvt);});
}

Item.prototype.onUserDeselect = function()
{
	var oEvt = this.element.ownerDocument.createEvent("Events");
	oEvt.initEvent("fp-deselect", true, true);
	var elmnt = this.element;
	spawn(function(){FormsProcessor.dispatchEvent(elmnt,oEvt);});
}

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
}

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
}