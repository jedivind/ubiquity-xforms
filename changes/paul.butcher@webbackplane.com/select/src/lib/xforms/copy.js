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


function Copy(element) {
	this.element = element;
	this.m_oValue = undefined;
	UX.addStyle(this.element, "display", "none");
}

Copy.prototype.onContentReady = function () {
	if (this.element.parentNode.m_ancestorEventTarget) {
		this.element.parentNode.m_ancestorEventTarget.addItem(this.element.parentNode,this.getValue());
	}
};

Copy.prototype.onDocumentReady = function () {
	var pThis = this;
	spawn( function () {
		var ownerSelect;
		if(pThis.element.parentNode.getAncestorEventTarget) {
			ownerSelect = pThis.element.parentNode.getAncestorEventTarget();
			if(getModelFor(pThis) !== getModelFor(ownerSelect)) {
				UX.dispatchEvent(pThis.element, "xforms-binding-exception", true, false);
			}
		}
	});

};


Copy.prototype.setValue = function (o) {

	if (this.m_oValue !== this.m_proxy.m_oNode) {

		if (this.element.parentNode.m_ancestorEventTarget) {
		  // When the value of an xf:copy element changes, this must be reflected
		  //  in the select or select1 to which it is bound.  It may be the case that 
		  //  the visible value needs to change, or the control needs to become out-of-range
		  //  It is also necessary to inform the select or select1, in order to allow
		  //  future changes in value to be accurately reflected.
		  this.element.parentNode.m_ancestorEventTarget.itemValueChanged(this.element.parentNode,this.getValue(),this.m_proxy.m_oNode);
		  this.m_oValue = this.m_proxy.m_oNode;
			this.element.parentNode.m_ancestorEventTarget.refreshDisplayValue();
		}
	}
};

Copy.prototype.getValue = function () {
	return this.m_oValue? this.m_oValue: null;
};