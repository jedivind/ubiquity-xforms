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
 
function MIPHandler(element) {
	this.element = element;
	this.dirtyState = new DirtyState();
	this.m_MIPSCurrentlyShowing = {};
}

MIPHandler.prototype.addcontroltomodel = function () {
	var oModel;
	if (!this.m_bAddedToModel) {		
		oModel = getModelFor(this);

		if (oModel) {
			setInitialState(this);
			oModel.addControl(this);
		} else {
			throw("Could not resolve model for MIPHandler");
		}
	} else { // shouldn't be called twice 
		throw("Second attempt to add MIPHandler to model as a control.");
	}
};

MIPHandler.prototype.rewire = function () {
	var bRet = false, ctxBoundNode;
	if (this.m_proxy) {
		this.m_proxy = null;
	}

	ctxBoundNode = this.getBoundNode(1);
	this.m_model = ctxBoundNode.model;
	if (ctxBoundNode.node) {
		this.m_proxy = getProxyNode(ctxBoundNode.node);
		bRet = true;
	}

	return bRet;
};

MIPHandler.prototype.refresh = function () {
	document.logger.log("Refreshing: " + this.element.tagName + ":" + this.element.uniqueID, "control");

	this.setView();

	if (this.dirtyState.isDirty()) {
		this.dispatchMIPEvents();
		this.dirtyState.setClean();
	}
};


MIPHandler.prototype.setView = function() {
 	MIPTester.testMIPChanges(this);
 	setState(this, "enabled", "enabled", "disabled");
	setState(this, "readonly", "read-only", "read-write");
	setState(this, "required", "required", "optional");
	setState(this, "valid", "valid", "invalid");
};

MIPHandler.prototype.dispatchMIPEvents = function () {
	var proxyNode = FormsProcessor.getProxyNode(this.element);
	if (proxyNode) {
		UX.dispatchEvent(this, proxyNode.valid.getValue() ? "xforms-valid" : "xforms-invalid", true, false);
		UX.dispatchEvent(this, proxyNode.required.getValue() ? "xforms-required" : "xforms-optional", true, false);
		UX.dispatchEvent(this, proxyNode.readonly.getValue() ? "xforms-readonly" : "xforms-readwrite", true, false);
	}

	UX.dispatchEvent(this, this.isEnabled() ? "xforms-enabled" : "xforms-disabled", true, false);
};

MIPHandler.prototype.onDocumentReady = function () {
	this.addcontroltomodel();
}

MIPHandler.prototype.mustBeBound = function () {
	return true;
};

MIPHandler.prototype.isEnabled = function () {
	var proxyNode = FormsProcessor.getProxyNode(this.element);
	if (proxyNode) {
		return proxyNode.enabled.getValue();
	}

	return this.mustBeBound() ? false : true;
};

MIPHandler.prototype.getMIPState = function (mip) {
	var retval = { isSet: false }, proxyNode;

	if (mip === "enabled") {
		retval.value = this.isEnabled();
		retval.isSet = true;
	} else {
		proxyNode = FormsProcessor.getProxyNode(this.element);
		if (proxyNode) {
			retval.value = proxyNode.getMIPState(mip);
			retval.isSet = true;
		}
	}

	return retval;
};
