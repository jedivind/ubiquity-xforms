/*
 * Copyright © 2009 Backplane Ltd.
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

function UploadValue(element) {
 	this.element = element;
  	this.value = "";
  	this.unset = true;
}

UploadValue.prototype.onDocumentReady = function () {
	var self = this, form, changeEvent;

	if (this.element.ownerDocument.media !== "print")
	{
		this.impl = document.createElement("input");
		this.impl.type = "file";

		UX.addStyle(this.impl, "backgroundColor", "transparent");
		UX.addStyle(this.impl, "padding", "0");
		UX.addStyle(this.impl, "margin", "0");
		UX.addStyle(this.impl, "border", "0");

		changeEvent = this.element.parentNode.getAttribute("incremental") === "true" ? "keyup" : "change";
		if (UX.isIE) {
			this.impl.attachEvent("on" + changeEvent, function (e) { self.onValueChanged(e); });
		} else {
			this.impl.addEventListener(changeEvent, function (e) { self.onValueChanged(e); });
		}

		this.element.appendChild(this.impl);
	}
};

UploadValue.prototype.onValueChanged = function (evtIn) {
	var evtOut = this.element.ownerDocument.createEvent("MutationEvents");

	evtOut.initMutationEvent("control-value-changed", true, true, null, this.value,
	                         evtIn.target ? evtIn.target.value : evtIn.srcElement.value, null, null);

	FormsProcessor.dispatchEvent(this.element, evtOut);

	evtIn.cancelBubble = true;
};

UploadValue.prototype.setValue = function(value)
{
	if (this.impl.value != value) {
		this.value = this.impl.value = value;
		return true;
	}

	if (this.unset) {
		this.unset = false;
		return true;
	}

	return false;
};
