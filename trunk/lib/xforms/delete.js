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

function Delete(elmnt)
{
	this.element = elmnt;
}

Delete.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Delete.prototype.performAction = function (evt)
{
    var oContext = this.getEvaluationContext(1);
    var nodesetExpr = this.element.getAttribute("nodeset"),
        atExpr = this.element.getAttribute("at");
    var oInstance = oContext.model.instances()[0];
    
    if (oInstance.deleteNodes(oContext.node, nodesetExpr, atExpr)) {
        oContext.model.flagRebuild();
    }
};
