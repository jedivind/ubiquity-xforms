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
 
 /*global document, UX, CommonSelect, spawn, FormsProcessor, NamespaceManager, event, DropBox*/
 
function XFormsSelect1(elmnt)
{
	this.element = elmnt;
	this.currentDisplayValue = "";
	this.element.addEventListener("fp-select", this, false);
	this.element.addEventListener("xforms-select", this, false);
	this.element.addEventListener("xforms-deselect", this, false);
	this.element.addEventListener("xforms-value-changed", this, false);
	this.element.addEventListener("data-value-changed", this, false);
	this.m_currentItem = null;
			
	var keypressHandler = {
	  handleEvent: function (o) {
      switch (o.keyCode) {
      case 38 : //up
        elmnt.selectPreviousItem();
        break;
      case 40 : //down
        elmnt.selectNextItem();
  	  }
	  }
	},
	
	wheelHandler = {
    handleEvent: function (o) {
      switch (o.type) {
      case "focus":
        this.trapMouseWheel();
        break;
      case "blur":
        this.untrapMouseWheel();
        break;
      case "mousewheel":
      case "DOMMouseScroll":
        this.handleScroll(o);
	    }
	  },
	  
	  trapMouseWheel: function () {
      if (UX.isFF) {
        document.addEventListener("DOMMouseScroll", this, true);
      } else if (UX.isIE) {
        document.attachEvent("onmousewheel", wheelHandler.handleScroll);
      } else {
        document.addEventListener("mousewheel", this, true);  	    
      }
      
    }, 	  
	  untrapMouseWheel: function () {
      if (UX.isFF) {
        document.removeEventListener("DOMMouseScroll", this, true);
      } else if (UX.isIE) {
        document.detachEvent("onmousewheel", wheelHandler.handleScroll);
      } else {
        document.removeEventListener("mousewheel", this, true);  	    
      }
	  },
	  
	  handleScroll: function (o) {
	    var wheelDelta = o.wheelDelta;
	    if (typeof wheelDelta === "undefined") {
	      wheelDelta = o.detail;
	    }
	    
	    //Firefox mousewheel movement is reported in the
	    //  opposite direction to everyone else
	    if (UX.isFF) {
	      wheelDelta *= -1;
	    }
	     
	    if (wheelDelta > 0) {
	      elmnt.selectPreviousItem();
	    } else {
	      elmnt.selectNextItem();
	    }
	    
	    if (o.preventDefault) {
	      o.preventDefault();
	    }
	    return false;
	    
	  }
	};

  if (UX.isIE) {
    this.element.attachEvent("onkeyup", keypressHandler.handleEvent);
    this.element.attachEvent("onfocusin", wheelHandler.trapMouseWheel);
    this.element.attachEvent("onfocusout", wheelHandler.untrapMouseWheel);
    
  } else {
    this.element.addEventListener("keyup", keypressHandler, false);
    this.element.addEventListener("focus", wheelHandler, true);
    this.element.addEventListener("blur", wheelHandler, true);
  }
  
  
  
}

XFormsSelect1.prototype = new CommonSelect();

XFormsSelect1.prototype.handleEvent = function (oEvt)
{
	switch (oEvt.type)
	{
	case "fp-select":
	  this.element.m_currentItem = oEvt.target;
	  this.onValueSelected(oEvt.target.getValue());
		break;
	case "xforms-select":
	case "xforms-deselect":
		oEvt.stopPropagation();
		break;
	case "xforms-value-changed" :
	//This needn't be run inline, and causes stack overflow in IE if it is.
	  var element = this.element;
    spawn(function () {
      element.itemChanged(oEvt);
    });
    break;
	 case "data-value-changed" :
 		this.onSelectionChanged(oEvt.newValue);
		oEvt.stopPropagation();
		break;
	}			
};
	

XFormsSelect1.prototype.getFirstItem = function () {
  return UX.getFirstNodeByName(this.m_choices, "item", "http://www.w3.org/2002/xforms");
};

XFormsSelect1.prototype.selectFirstItem = function () {
  var firstItem = this.getFirstItem();
  if (firstItem !== null) {
    firstItem.onUserSelect();
  }
};

XFormsSelect1.prototype.selectPreviousItem = function () {
  var previousItem;
  if (this.m_currentItem === null) {
    this.selectFirstItem();
  } else {
    previousItem = UX.getPreviousNodeByName(this.m_currentItem, "item", "http://www.w3.org/2002/xforms", this.m_choices);
    if (previousItem !== null) {
      previousItem.onUserSelect();
    }
  }
};

XFormsSelect1.prototype.selectNextItem = function () {
  var nextItem;
  if (this.m_currentItem === null) {
    this.selectFirstItem();
  } else {
    nextItem = UX.getNextNodeByName(this.m_currentItem, "item", "http://www.w3.org/2002/xforms", this.m_choices);
    if (nextItem !== null) {
      nextItem.onUserSelect();
    }
  }
};

XFormsSelect1.prototype.onValueSelected = function (value) {
  this.element.hideChoices();
  var oEvt1 = document.createEvent("MutationEvents");
  oEvt1.initMutationEvent("control-value-changed", false, true, null, "", value, "", 1);
  FormsProcessor.dispatchEvent(this.element.m_value, oEvt1);
};

XFormsSelect1.prototype.itemChanged = function (oEvt) {
  if (oEvt.target !== this.element) {
    var sNodeName = NamespaceManager.getLowerCaseLocalName(oEvt.target);
    if (sNodeName === "value") {
      this.itemValueChanged(oEvt.target.parentNode, oEvt.prevValue, oEvt.newValue);
    }
  }
};
	
XFormsSelect1.prototype.focusOnValuePseudoElement = function () {
	if (this.m_value && event.srcElement !== this.m_value)	{
		if (!this.m_value.contains(event.srcElement) && (this.m_choices && event.srcElement !== this.m_choices && !this.m_choices.contains(event.srcElement))) {
			this.m_value.focus();
		}
	}
};

XFormsSelect1.prototype.onContentReady = function () {
	var s = this.getAttribute("appearance");
	//Set a default appearance of minimal.  This is not mandated,
	//  but a minimal style is typically expected from a select1
	if (!s) {
		s = "minimal";
	}
	UX.addClassName(this, "appearance-" + s);
};

XFormsSelect1.prototype.onDocumentReady = function () {
	this.createChoicesPseudoElement();
};

XFormsSelect1.prototype.getDisplayValue = function (sValue) {
  return this.getSingleDisplayValue(sValue);
};
  
XFormsSelect1.prototype.isOpen = function () {
  return this.getAttribute("selection") === "open";
};

XFormsSelect1.prototype.onItemAdded = function (item, key) {
  //The new item is the same as the current value,
  //    which could not be displayed when it was set.
  //  Since it can now be set, set it.
  if (!this.isInRange() && key === this.currentDisplayValue && this.m_value.setValue) {
    this.m_value.setValue(key);
  }
};

XFormsSelect1.prototype.onItemRemoved = function (item, key) {
  //The removed item is the same as the current value,
  //  which may no longer be displayable.
  if (this.isInRange() && key === this.currentDisplayValue && this.m_value.setValue) {
    this.m_value.setValue(key);
  } 
};


XFormsSelect1.prototype.refreshDisplayValue = function () {
  if (this.m_value.refreshDisplayValue) {
    this.m_value.refreshDisplayValue();
   }
};

XFormsSelect1.prototype.useDropBox = function () {
  return (this.element.getAttribute("appearance") === null || this.element.getAttribute("appearance") === "minimal");
};


XFormsSelect1.prototype.onSelectionChanged = function (s) {
	var oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
	oEvt1.initMutationEvent("selection-changed", false, false, null, "", s, "", 1);
	FormsProcessor.dispatchEvent(this.element, oEvt1);
	return;
};


function XFormsSelect(elmnt) {	
  this.element = elmnt;
  this.multiselect = true;
  this.element.addEventListener("fp-select", this, false);
  this.element.addEventListener("fp-deselect", this, false);
  this.element.addEventListener("xforms-select", this, false);
  this.element.addEventListener("xforms-deselect", this, false);
  this.element.addEventListener("data-value-changed", this, false);
  this.m_values = [];
}

XFormsSelect.prototype = new CommonSelect();

XFormsSelect.prototype.useDropBox = function () {
  return this.element.getAttribute("appearance") === "minimal";
};


XFormsSelect.prototype.onValueSelected = function (value) {
		var oEvt;
		this.m_values.push(value);
		oEvt = this.element.ownerDocument.createEvent("MutationEvents");
		oEvt.initMutationEvent("control-value-changed", false, true, null, "", this.m_values.join(" "), "", 1);
		FormsProcessor.dispatchEvent(this.element.m_value, oEvt);
};

XFormsSelect.prototype.handleEvent = function (oEvt) {
	var oEvt1, s, i;
	switch (oEvt.type) {
	case "fp-select":
	  this.onValueSelected(oEvt.target.getValue());
		oEvt.stopPropagation();
		break;
		
	case "fp-deselect":
		s = oEvt.target.getValue();
		for (i = 0;i < this.m_values.length;++i) {
			if (s === this.m_values[i]) {
				this.m_values.splice(i, 1);

				oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
				oEvt1.initMutationEvent("control-value-changed", false, true, null, "", this.m_values.join(" "), "", 1);
				oEvt1._actionDepth = oEvt._actionDepth;
				FormsProcessor.dispatchEvent(this.element.m_value, oEvt1);
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

XFormsSelect.prototype.onSelectionChanged = function (s) {
	var oEvt1 = this.element.ownerDocument.createEvent("MutationEvents");
	//In a DOM Events compliant environment, only strings are allowed to be values in the mutation event
	//  and it is readonly.  Therefore, it can't be used to transmit the change in array values.
	this.element.m_undisplayedValues = s.trim().split(" ");
	oEvt1.initMutationEvent("selection-changed", false, false, null, "", s, "", 1);
	FormsProcessor.dispatchEvent(this.element, oEvt1);
  // If there are values left over, then this control is out of range.
  if (this.element.m_undisplayedValues.length) {
	  this.element.onOutOfRange();
	}	else { 
	  this.element.onInRange();
	}
	return;
};


XFormsSelect.prototype.focusOnValuePseudoElement = function () {
  if (this.useDropBox()) {
  	if (this.m_value && event.srcElement !== this.m_value)	{
  		if (!this.m_value.contains(event.srcElement) && (this.m_choices && event.srcElement !== this.m_choices && !this.m_choices.contains(event.srcElement))) {
  			this.m_value.focus();
  		}
  	}
  }
};

XFormsSelect.prototype.onContentReady = function () {
	var s = this.getAttribute("appearance");
	//Set a default appearance of compact.  This is not mandated, 
	// but a dropbox is not typically expected of a select control.
	if (!s) {
		s = "compact";
	}
	UX.addClassName(this, "appearance-" + s);
	
};

XFormsSelect.prototype.onDocumentReady = function () {
  this.createChoicesPseudoElement();
};


XFormsSelect.prototype.isOpen = function () {
  return this.getAttribute("selection") === "open";
};

XFormsSelect.prototype.refreshDisplayValue = function () {
  if (this.m_value.refreshDisplayValue) {
    this.m_value.refreshDisplayValue();
   }
};

XFormsSelect.prototype.getDisplayValue = function (sValue) {
  var i, l,  arrDisplayValues = [], arrValues = sValue.trim().split(" ");
  l = arrValues.length;
  for (i = 0 ; i < l ;++i) {
    arrDisplayValues.push(this.getSingleDisplayValue(arrValues[i]));
  }
  return arrDisplayValues.join(" ");
};

function XFormsCommonSelectValue(elmnt) {
	this.element = elmnt;
  this.currValue = "";
  this.m_bFirstSetValue = true;
}


XFormsCommonSelectValue.prototype.onDocumentReady = function () {
	if (this.element.ownerDocument.media !== "print") {
		var sElementToCreate = "input",
		oInput = document.createElement(sElementToCreate),
    pSelect = this.parentNode,
    pThis = this;
    
    if (oInput.addEventListener) {
      oInput.addEventListener("change", function (e) {
        pThis.trySetManuallyEnteredValue(oInput.value);
      }, false);
      
      oInput.addEventListener("click", function () {
        pSelect.showChoices();
      }, false);
      
      if (!this.parentNode.isOpen()) {
        //ignore the typing of any alphanumeric characters, other than tab, 
        //  which should cause focus to move. 
        oInput.addEventListener("keypress", function (e) {
          if (e.keyCode !== 9) {
            e.preventDefault();
          }
        }, true);
      }
    }
    else {
      oInput.attachEvent("onchange", function (e) {
        pThis.trySetManuallyEnteredValue(oInput.value);
      });
      
      oInput.attachEvent("onclick", function () {
        pSelect.showChoices();
      });
      
      if (!this.parentNode.isOpen()) {
        //ignore the typing of any alphanumeric characters, other than tab, 
        //  which should cause focus to move. 
        oInput.attachEvent("onkeypress", function (e) {
          if (e.keyCode !== 9) {
            return false;
          }
          return true;
        });
      }
    }
  
		UX.addStyle(oInput, "backgroundColor", "transparent");
    UX.addStyle(oInput, "padding", "0");
    UX.addStyle(oInput, "margin", "0");
    UX.addStyle(oInput, "border", "0");
    
    this.element.appendChild(oInput);   
    this.m_value = oInput;
  }
};


XFormsCommonSelectValue.prototype.trySetManuallyEnteredValue = function (value) {
  if (this.parentNode.isOpen() || this.parentNode.getDisplayValue(value) !== null) {    
    //if the value entered is legitimate, let it in.
    this.parentNode.onValueSelected(value);
  }
  else {
    //otherwise, replace it with the current value.
    this.setDisplayValue(this.currValue, true);
  }
};

XFormsCommonSelectValue.prototype.setValue = function (sValue) {
  if (this.m_sValue !== sValue) {
    this.m_sValue = sValue;
    this.refreshDisplayValue();
    return true;
  }
  return false;
};

XFormsCommonSelectValue.prototype.refreshDisplayValue = function () {
  var sDisplayValue = this.parentNode.getDisplayValue(this.m_sValue);

  //Open selections don't go out of range, just display the value as given
  if (sDisplayValue === null && this.parentNode.isOpen()) {
    sDisplayValue = sValue;
  }
  
  return this.setDisplayValue(sDisplayValue);

};

XFormsCommonSelectValue.prototype.setDisplayValue = function (sDisplayValue, bForceRedisplay) {
	var bRet = false;
 
  if (sDisplayValue === null) {
    this.parentNode.onOutOfRange();
    sDisplayValue = "";
  } else {
    this.parentNode.onInRange();
  }
  
  if (this.parentNode.useDropBox()) { 
  	if (bForceRedisplay || this.currValue !== sDisplayValue) {
  	  this.m_value.value = sDisplayValue;
  		this.currValue = sDisplayValue;
  		bRet = true;
  	}	else if (this.m_bFirstSetValue)	{
  		bRet = true;
  		this.m_bFirstSetValue = false;
  	}
  } else {
    bRet = true;
  }
	return bRet;
};


XFormsSelectValue = XFormsCommonSelectValue;
XFormsSelect1Value = XFormsCommonSelectValue;


function ElementWithChoices(){

}

ElementWithChoices.prototype.createChoicesPseudoElement = function () {
  var oPeChoices, nl, n, s, i;
  if (!this.m_choices) {
		oPeChoices = this.element.ownerDocument.createElement("div");
		UX.addClassName(oPeChoices, "pe-choices");

		nl = this.childNodes;
		for (i = 0;i < nl.length; ++i) {
			n = nl[i];
			s = NamespaceManager.getLowerCaseLocalName(n);
			switch (s) {
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
		
		if (this.useDropBox()) {
		  this.choicesBox = new DropBox(this.element, this.element.m_value, oPeChoices);
		} else {
		  this.element.insertBefore(oPeChoices,this.element.m_value);
		}
		
    this.m_choices = oPeChoices;
  }
};

ElementWithChoices.prototype.showChoices = function () {
  if (this.choicesBox) {
    this.choicesBox.show();
  }
};

ElementWithChoices.prototype.hideChoices = function () {
  if (this.choicesBox) {
    this.choicesBox.hide();
  }
};
