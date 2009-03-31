/*
 * Copyright © 2008-2009 Backplane Ltd.
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


(function(){
	var onValueSelected = function(self, value) {
		var oEvt, clone;
		
		if (value && typeof value === "object") {
			clone = self.element.m_proxy.appendChild(value.cloneNode(true), self);
			
			if (clone) {
				self.element.m_model.flagRebuild();
			}
		} else {
			self.m_values.push(value);
			oEvt = self.element.ownerDocument.createEvent("MutationEvents");
			oEvt.initMutationEvent("control-value-changed", false, true, null, "", self.m_values.join(" "), "", 1);
			FormsProcessor.dispatchEvent(self.element.m_value, oEvt);
		}
	},
	
	
	onValueDeselected = function (self, value) {
		var oEvt
		if (value && typeof value === "object") {
			if (self.element.m_proxy.removeChild(value, self)) {
			  	self.element.m_model.flagRebuild();
				oEvt = self.element.ownerDocument.createEvent("MutationEvents");
				oEvt.initMutationEvent("data-value-changed", false, true, null, "", "", "", 1);
				FormsProcessor.dispatchEvent(self.element, oEvt);
			}
		} else {
			for (i = 0;i < self.m_values.length;++i) {
				if (value === self.m_values[i]) {
					self.m_values.splice(i, 1);
					oEvt = self.element.ownerDocument.createEvent("MutationEvents");
					oEvt.initMutationEvent("control-value-changed", false, true, null, "", self.m_values.join(" "), "", 1);
					FormsProcessor.dispatchEvent(self.element.m_value, oEvt);
					break;
				}
			}
		}
	},
	
	onSelectionChanged = function (element, s) {
		var i, oEvt1 = document.createEvent("MutationEvents");
		//In a DOM Events compliant environment, only strings are allowed to be values in the mutation event
		//  and it is readonly.  Therefore, it can't be used to transmit the change in array values.
		element.m_undisplayedValues = s.trim().split(" ");
		if (element.containsCopyElements()) {
			for (i = 0; i < element.m_proxy.m_oNode.childNodes.length ;++i) {
				if (element.m_proxy.m_oNode.childNodes[i].nodeType !== DOM_TEXT_NODE) {
					element.m_undisplayedValues.push(element.m_proxy.m_oNode.childNodes[i]);
				}
			}
		}
		
		oEvt1.initMutationEvent("selection-changed", false, false, null, "", s, "", 1);
		FormsProcessor.dispatchEvent(element, oEvt1);
	  // If there are values left over, then this control is out of range.
		if (element.m_undisplayedValues.length) {
		  element.onOutOfRange();
		} else { 
		  element.onInRange();
		}
		return;
	};

	XFormsSelect.prototype.onValueSelected = function (value) {
		onValueSelected(this, value);
	};

	XFormsSelect.prototype.handleEvent = function (oEvt) {
		var oEvt, s, i;
		switch (oEvt.type) {
		case "fp-select":
		  	onValueSelected(this, oEvt.target.getValue());
			oEvt.stopPropagation();
			break;
			
		case "fp-deselect":
			onValueDeselected(this, oEvt.target.getValue());
			break;
		case "data-value-changed":
			this.m_values = oEvt.newValue.split(" ");
			onSelectionChanged(this.element, oEvt.newValue);
			oEvt.stopPropagation();
			break;
		case "xforms-select":
		case "xforms-deselect":
			oEvt.stopPropagation();
		  break;
		}
	};
}());

XFormsSelect.prototype.onContentReady = function () {
	var s = this.getAttribute("appearance");
	//Set a default appearance of compact.  This is not mandated, 
	// but a dropbox is not typically expected of a select control.
	if (!s) {
		s = "compact";
	}
	UX.addClassName(this, "appearance-" + s);
	
};

XFormsSelect.prototype.getDisplayValue = function (sValue) {
	var i, l,  arrDisplayValues = [], arrValues;
	arrValues = sValue? sValue.trim().split(" "): [];
	l = arrValues.length;
	for (i = 0 ; i < l ;++i) {
		arrDisplayValues.push(this.getSingleDisplayValue(arrValues[i]));
	}
	return arrDisplayValues.join(" ");
};

XFormsSelectValue = XFormsCommonSelectValue;
