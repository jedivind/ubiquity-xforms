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

function Insert(elmnt)
{
	this.element = elmnt;
}

Insert.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Insert.prototype.performAction = function (evt)
{
	var oContext = this.getEvaluationContext(),
	bindid = this.element.getAttribute("bind"),
	atExpr = this.element.getAttribute("at"),
	positionExpr = this.element.getAttribute("position"),
	originExpr = this.element.getAttribute("origin"),
	oInstance = oContext.model.instances()[0],
	nodesetExpr,
	nodeset,
	bindObject;

	if (bindid) {
		bindObject = FormsProcessor.getBindObject(bindid, this.element);
		nodeset = bindObject.boundNodeSet;
	} else {
		nodesetExpr = this.element.getAttribute("nodeset");
		nodeset = (nodesetExpr) ? oInstance.evalXPath(nodesetExpr, oContext).nodeSetValue() : null;
	}

	if (oInstance.insertNodeset(nodeset, oContext, atExpr, positionExpr, originExpr)) {
		oContext.model.flagRebuild();
	}
	this.m_context = null;
};
