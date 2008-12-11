/*
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

function Form(elmnt) {
    this.element = elmnt;
    this.ownerModel = null;    
};

Form.prototype.onContentReady = function() {
    var xformsNS = "http://www.w3.org/2002/xforms";
    var oModelNode = null;
    var oInstanceNode = null;
    var oElement = this.element;
    var models = 
        NamespaceManager.getElementsByTagNameNS(oElement, xformsNS, "model");
    var sFormName = oElement.attributes['name'].value;
    
    if (!sFormName) {        
        sFormName = "data";
    }
    
    oInstanceNode = UX.createElementNS(oElement, xformsNS, "instance");
    var oRootNode = document.createElement(sFormName);
    oInstanceNode.appendChild(oRootNode);
    oModelNode = UX.createElementNS(oElement, xformsNS, "model");
    oModelNode.appendChild(oInstanceNode);
    oElement.insertBefore(oModelNode, oElement.firstChild);    
    
    if (UX.isIE || !UX.hasDecorationSupport) {
        // Force immediate decoration of instance element for IE and
        // browser that doesn't support decoration
        DECORATOR.attachDecoration(oModelNode, true, true);
    }
    this.ownerModel = oModelNode;
};

Form.prototype.getBoundNode = function() {
    return this.ownerModel.getEvaluationContext();
};

Form.prototype.onDocumentReady = function() {
};