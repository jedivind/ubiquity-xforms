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
function XFormsSelect1(elmnt)
{
	this.element = elmnt;
	this.currentDisplayValue = "";
	this.element.addEventListener("fp-select",this,false);
	this.element.addEventListener("xforms-select",this,false);
	this.element.addEventListener("xforms-deselect",this,false);
	this.element.addEventListener("xforms-value-changed",this,false);
}
XFormsSelect1.prototype = new CommonSelect();

		XFormsSelect1.prototype.handleEvent = function(oEvt)
		{
			switch(oEvt.type)
			{
				case "fp-select":
				  this.onValueSelected(oEvt.target.getValue());
					break;
				case "xforms-select":
				case "xforms-deselect":
					oEvt.stopPropagation();
					break;
				case "xforms-value-changed" :
				//This needn't be run inline, and causes stack overflow in IE if it is.
				  var element = this.element;
          spawn(function(){element.itemChanged(oEvt);});
				
			}			
		};
		
XFormsSelect1.prototype.onValueSelected = function(value) {
  this.element.hideChoices();
  var oEvt1 = document.createEvent("MutationEvents");
  oEvt1.initMutationEvent("control-value-changed", false, true,null, "",value,"", 1);
  FormsProcessor.dispatchEvent(this.element.m_value,oEvt1);
};

XFormsSelect1.prototype.itemChanged = function(oEvt) {
  if(oEvt.target !== this.element) {
    var sNodeName = oEvt.target.nodeName;
    sNodeName = sNodeName.slice(sNodeName.indexOf(":")+1,sNodeName.length).toLowerCase();
    if(sNodeName === "value") {
      this.itemValueChanged(oEvt.target.parentNode,oEvt.prevValue,oEvt.newValue);
    }
  }
};
	
	
	
XFormsSelect1.prototype.focusOnValuePseudoElement = function()
{
	if(this.m_value && event.srcElement != this.m_value)
	{
		if(!this.m_value.contains(event.srcElement) && ( this.m_choices && event.srcElement !=this.m_choices && !this.m_choices.contains(event.srcElement)))
		{
			this.m_value.focus();
		}
	}
};
		XFormsSelect1.prototype.onContentReady = function()
		{
			var s = this.getAttribute("appearance");
			if(s !== undefined && s !== "")
			{
				this.className += "appearance-" + s;
			}
		};
		
		XFormsSelect1.prototype.onDocumentReady = function()
		{
				if(!this.m_choices)
				{
				  //YUI menus only work with divs
				  this.element.className += " yui-skin-sam";
					var oPeChoicesWrapper = this.element.ownerDocument.createElement("div");
					oPeChoicesWrapper.className = "pe-choices-wrapper yuimenu";
					
					var oPeChoices = this.element.ownerDocument.createElement("div");
					oPeChoices.className = "pe-choices bd";
					this.element.appendChild(oPeChoicesWrapper);
					oPeChoicesWrapper.appendChild(oPeChoices);

					var nl = this.childNodes;
					for(var i = 0;i < nl.length; ++i) {
						var n = nl[i];
						var s = n.nodeName;
						s = s.slice(s.indexOf(":")+1,s.length).toLowerCase();
						switch(s) {
							case "item":
							case "itemset":
							case "choices":
								//shift to pc-choices.
								oPeChoices.appendChild(n);
								--i;
							break;
							default:
							//leave in situ
						}
					}

          this.m_choices = oPeChoices;
          var oMenu = new YAHOO.widget.Menu(oPeChoicesWrapper);
          this.choicesMenu = oMenu;
          this.choicesMenu.render();
          this.choicesMenu.cfg.setProperty("context", [this.element.m_value, "tl", "bl"]); 
          //this.showChoices();

      }
    };

    XFormsSelect1.prototype.showChoices = function() {
      this.choicesMenu.align("tl", "bl");
      this.choicesMenu.show();
    };

    XFormsSelect1.prototype.hideChoices = function() {
      this.choicesMenu.hide();
    };

		XFormsSelect1.prototype.getDisplayValue = function(sValue) {
      return this.getSingleDisplayValue(sValue);
    };
    
    XFormsSelect1.prototype.isOpen = function() {
      return this.getAttribute("selection") === "open";
    };
    
    XFormsSelect1.prototype.onItemAdded = function(item,key) {
      //The new item is the same as the current value,
      //    which could not be displayed when it was set.
      //  Since it can now be set, set it.
      if(!this.isInRange() && key === this.currentDisplayValue && this.m_value.setValue) {
        this.m_value.setValue(key);
      }
    };

    XFormsSelect1.prototype.onItemRemoved = function(item,key) {
      //The removed item is the same as the current value,
      //  which may no longer be displayable.
      if(this.isInRange() && key === this.currentDisplayValue && this.m_value.setValue) {
        this.m_value.setValue(key);
      }
    };
  
	function Select(elmnt)
	{	
		this.element = elmnt;
		this.element.addEventListener("fp-select",this,false);
		this.element.addEventListener("fp-deselect",this,false);
		this.element.addEventListener("xforms-select",this,false);
		this.element.addEventListener("xforms-deselect",this,false);
		this.element.addEventListener("data-value-changed",this,false);
		this.m_values = [];
	}
	
		Select.prototype.handleEvent = function(oEvt)
		{
			var oEvt1;
			switch(oEvt.type)
			{
				case "fp-select":
					this.m_values.push(oEvt.target.getValue());
					oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
					oEvt1.initMutationEvent("control-value-changed", false, true,
						null, "",this.m_values.join(" "), 1);
					oEvt1._actionDepth = oEvt._actionDepth;
					FormsProcessor.dispatchEvent(this.element.m_value,oEvt1);
					break;
					
				case "fp-deselect":
					var s = oEvt.target.getValue();
					for(var i = 0;i < m_values.length;++i)
					{
						if(s == this.m_values[i])
						{
							this.m_values.splice(i,1);

							oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
							oEvt1.initMutationEvent("control-value-changed", false, true,
								null, "",this.m_values.join(" "), 1);
							oEvt1._actionDepth = oEvt._actionDepth;
							FormsProcessor.dispatchEvent(this.element.m_value,oEvt1);
							break;
						}
					}
					break;
				case "data-value-changed":
					this.m_values = oEvt.newValue.split(" ");
					this.onSelectionChanged(oEvt.newValue);
					oEvt.stopPropagation();
					break;
				case "xforms-select":
				case "xforms-deselect":
					oEvt.stopPropagation();
				break;
			}				
		};
		
		Select.prototype.onSelectionChanged = function(s)
		{
			var oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
			oEvt1.initMutationEvent("selection-changed", false, false,null, "",s.split(" "), 1);
			FormsProcessor.dispatchEvent(element,oEvt1);
			return;
		};
		
  	
		
		var XFormsSelectValue = XFormsInputValue;
		
		
		
		
function XFormsSelect1Value(elmnt)
{
		this.element = elmnt;
  	this.currValue = "";
  	this.m_bFirstSetValue = true;
}


XFormsSelect1Value.prototype.getOwnerNodeName  = function()
{
	var sNodeName = this.element.parentNode.nodeName;
	return sNodeName.slice(sNodeName.indexOf(":")+1,sNodeName.length).toLowerCase();
};

XFormsSelect1Value.prototype.onDocumentReady = function()
{
	if (this.element.ownerDocument.media != "print")
	{
		var sTagNameLC = this.getOwnerNodeName();
		var sElementToCreate = "input";
		var oInput = document.createElement(sElementToCreate);
    var pSelect = this.parentNode;
    var pThis = this;
    if(oInput.addEventListener) {
      oInput.addEventListener("change",function(e){pThis.trySetManuallyEnteredValue(oInput.value);},false);
      oInput.addEventListener("focus",function(){pSelect.showChoices();}, false);
    }
    else {
      oInput.attachEvent("onchange", function(e){pThis.trySetManuallyEnteredValue(oInput.value);});
      oInput.attachEvent("onfocus",function(){pSelect.showChoices();});
    }
  
    oInput.style.backgroundColor = "transparent";
    oInput.style.padding = "0";
    oInput.style.margin = "0";
    oInput.style.border = "0";
    
    this.element.appendChild(oInput);
    
    this.m_value = oInput;
  }
};


XFormsSelect1Value.prototype.trySetManuallyEnteredValue = function(value) {
  if(this.parentNode.isOpen() || this.parentNode.getDisplayValue(value) !== null) {
    //if the value entered is legitimate, let it in.
    this.parentNode.onValueSelected(value);
  }
  else {
    //otherwise, replace it with the current value.
    this.setDisplayValue(this.currValue, true);
  }
};

XFormsSelect1Value.prototype.setValue = function(sValue) {

  var sDisplayValue = this.parentNode.getDisplayValue(sValue);

  //Open selections don't go out of range, just display the value as given
  if(sDisplayValue === null && this.parentNode.isOpen()) {
    sDisplayValue = sValue;
  }
  
  return this.setDisplayValue(sDisplayValue);
};

XFormsSelect1Value.prototype.setDisplayValue = function(sDisplayValue, bForceRedisplay) {
	var bRet = false;
 
  if(sDisplayValue === null){
      this.parentNode.onOutOfRange();
      sDisplayValue = "";
  }
  else {
      this.parentNode.onInRange();
  }
  

	if (bForceRedisplay || this.currValue !== sDisplayValue)
	{
	  this.m_value.value = sDisplayValue;
		this.currValue = sDisplayValue;
		bRet = true;
	}
	else if (this.m_bFirstSetValue)
	{
		bRet = true;
		this.m_bFirstSetValue = false;
	}
	
	return bRet;
};

		