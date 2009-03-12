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
return;
	this.updateMIPs();

	if (this.dirtyState.isDirty()) {
		this.broadcastMIPs();
		this.dirtyState.setClean();
	}
};

(function () {
	var isDirtyMIP = function (self, sMIPName) {
		var state = self.getMIPState(sMIPName);
		return self.m_MIPSCurrentlyShowing[sMIPName] === undefined ||
			(state.isSet && self.m_MIPSCurrentlyShowing[sMIPName] !== state.value);
	},
	
	setDirtyState = function (self, mip) {
		if (isDirtyMIP(self, mip)) {
			self.dirtyState.setDirty(mip);
		}
	},
	
	setDirtyStates = function (self) {
		setDirtyState(self, "enabled");
		setDirtyState(self, "readonly");
		setDirtyState(self, "required");
		setDirtyState(self, "valid");
	},
	updateMIPs = function (self) {
	 	setDirtyStates(self);
	 	setState(self, "enabled", "enabled", "disabled");
		setState(self, "readonly", "read-only", "read-write");
		setState(self, "required", "required", "optional");
		setState(self, "valid", "valid", "invalid");	
	};

	MIPHandler.prototype.updateMIPs = function() {
		updateMIPs(self);
	};
	
	//public exposition of otherwise private functions, to 
	//	facilitate testing.
	MIPHandler.prototype.isDirtyMIP = function (mip) {
		return isDirtyMIP(this, mip);
	}

	MIPHandler.prototype.setDirtyState = function (mip) {
		setDirtyState(this, mip);
	};
	
	MIPHandler.prototype.setDirtyStates = function () {
		setDirtyStates(this);
	};
	
}());

MIPHandler.prototype.broadcastMIPs = function () {
};

MIPHandler.prototype.onDocumentReady = function () {
	this.addcontroltomodel();
}

MIPHandler.prototype.mustBeBound = function () {
	return true;
};

MIPHandler.prototype.inheritEnabled = function () {
	var parent = this.element.parentNode;
	while (parent) {
		if (parent.isGroup || parent.isSwitch) {
			if (parent.isEnabled() === false) {
				return false;
			}
		} else if (parent.isCase) {
			if (parent.getSwitch() && typeof parent.getSwitch().getSelectedCase === "function" && parent !== parent.getSwitch().getSelectedCase()) {
				return false;
			}
		}

		parent = parent.parentNode;
	}

	return true;
};

MIPHandler.prototype.isEnabled = function () {
	var proxyNode;

	if (!this.inheritEnabled()) {
		return false;
	}

	proxyNode = FormsProcessor.getProxyNode(this.element);
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
