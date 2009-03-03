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
 
function MIPConsumer(element) {
	this.element = element;
	this.dirtyState = new DirtyState();
	this.m_MIPSCurrentlyShowing = {};

}

MIPConsumer.prototype.addcontroltomodel = function () {
	var oModel;
	if (!this.m_bAddedToModel) {		
		oModel = getModelFor(this);

		if (oModel) {
			setInitialState(this);
			oModel.addControl(this);
		} else{
			throw("Could not resolve model for MIPConsumer");
		}
	} else{ // shouldn't be called twice 
		throw("Second attempt to add MIPConsumer to model as a control.");
	}
};


MIPConsumer.prototype.rewire = function () {
	
	var bRet, ctxBoundNode;
	bRet = false;
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

MIPConsumer.prototype.refresh = function () {
	
	document.logger.log("Refreshing: " + this.element.tagName + ":" + this.element.uniqueID, "control");

	var oProxy = this.element.m_proxy;


	if (oProxy) {
		this.setView(oProxy);
		if( this.dirtyState.isDirty()) {
			this.dispatchMIPEvents(oProxy);
    	this.dirtyState.setClean();
   	}
	}
	return;
};

MIPConsumer.prototype.isDirtyMIP = function (oProxy, sMIPName) {
  return (this.m_MIPSCurrentlyShowing[sMIPName] === undefined ||
           (oProxy.getMIPState !== undefined && 
              this.m_MIPSCurrentlyShowing[sMIPName] !== oProxy.getMIPState(sMIPName)
            )
          );
};

MIPConsumer.prototype.testMIPChanges = function (oProxy) {
  if (this.isDirtyMIP(oProxy, "enabled")) {
    this.dirtyState.setDirty("enabled");
  }
  if (this.isDirtyMIP(oProxy, "readonly")) {
    this.dirtyState.setDirty("readonly");
  }
  if (this.isDirtyMIP(oProxy, "required")) {
    this.dirtyState.setDirty("required");
  }
  if (this.isDirtyMIP(oProxy, "valid")) {
    this.dirtyState.setDirty("valid");
  }
};

MIPConsumer.prototype.setView = function(oProxy) {
 	this.testMIPChanges(oProxy);
 	setState(this, oProxy, "enabled", "enabled", "disabled");
	setState(this, oProxy, "readonly", "read-only", "read-write");
	setState(this, oProxy, "required", "required", "optional");
	setState(this, oProxy, "valid", "valid", "invalid");
	return;
};

MIPConsumer.prototype.dispatchMIPEvents = function (oProxy) {
  if (oProxy.m_oNode) { 
    UX.dispatchEvent(this, oProxy.valid.getValue() ? "xforms-valid" : "xforms-invalid", true, false);
    UX.dispatchEvent(this, oProxy.required.getValue() ? "xforms-required" : "xforms-optional", true, false);
    UX.dispatchEvent(this, oProxy.readonly.getValue() ? "xforms-readonly" : "xforms-readwrite", true, false);
    UX.dispatchEvent(this, oProxy.enabled.getValue() ? "xforms-enabled" : "xforms-disabled", true, false);
  }
};
		