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

function Group(elmnt)
{
	this.element = elmnt;
	this.m_MIPSCurrentlyShowing = {};
}

	
	Group.prototype.rewire = function()
	{
			var bRet = false;
			if (this.m_proxy)
			{
				this.m_proxy = null;
			}

			var ctxBoundNode = this.getBoundNode(1);
			var oPN = null;
				
			/*
			 * [ISSUE] In theory even if the model attribute had changed
			 * by now, this would still work. This means that the
			 * addControl*() methods could perhaps be some kind of global
			 * thing.
			 */

			this.m_model = ctxBoundNode.model;
			if (ctxBoundNode.node)
			{
				oPN = getProxyNode(ctxBoundNode.node);
				bRet = true;
			}

			/*
			 * Make sure our control knows where its
			 * associated proxy is.
			 */

			if (oPN)
			{
				this.m_proxy = oPN;
			}

			return bRet;
	};
	
	Group.prototype.setValue = function(sValue)
	{
		return;
	};

	Group.prototype.setType = function(sType)
	{
		return;
	};
	
	Group.prototype.addcontroltomodel = function()
	{
		if (!this.m_bAddedToModel)
		{
			
			var oModel = getModelFor(this);
			if (oModel)
			{
				setInitialState(this);
				oModel.addControl(this);
			}
			else{
				throw("Could not resolve model for group.");
			}
		}
		else{ /* shouldn't be called twice */
			throw("Second attempt to add group to model as a control.");
		}
	};
	
	
	Group.prototype.refresh = function()
	{
		this.element.ownerDocument.logger.log("Refreshing: " + this.element.tagName + ":" + this.element.uniqueID, "control");

		var oProxy = this.element.m_proxy;

		if (oProxy)
		{

			/*
				* [ISSUE]
				* Sometimes a context is being stored when it should be
				* a proxy...don't know how though!
				*/

			if (oProxy.node)
			{
				oProxy = oProxy.node;

				/*
					* Now fix it so that we don't get this again. This is
					* obviously a hack since we shouldn't have had this
					* problem in the first place!
					*/

				this.element.m_proxy = oProxy;
			}

			this.setView(oProxy);
		}
		return;
	};

	Group.prototype.setView = function(oProxy)
	{
		setState(this,oProxy, "enabled", "enabled", "disabled");
		setState(this,oProxy, "readonly", "read-only", "read-write");
		setState(this,oProxy, "required", "required", "optional");
		setState(this,oProxy, "valid", "valid", "invalid");
		return;
	};

	Group.prototype.onDocumentReady = Group.prototype.addcontroltomodel;
