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
 
function Toggle(elmnt) {
	this.element = elmnt;
}

Toggle.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Toggle.prototype.performAction = function (evt) {
	var oCase, oContext, ns, sCaseID;
	oContext = this.getEvaluationContext();
	ns = NamespaceManager.getElementsByTagNameNS(this.element, "http://www.w3.org/2002/xforms", "case");
	
	sCaseID = (ns && ns.length > 0)
		? getElementValueOrContent(oContext, ns[0])
		: this.element.getAttribute("case");

	if (sCaseID) {
	
		oCase = FormsProcessor.getElementById(sCaseID, this.element);

		//According to http://www.w3.org/TR/xforms11/#action-toggle
 		//	The case to be selected by the switch is identified by IDREF either by the attribute case or by a child case element. 
 		//		If no case element contains the given identifier, then this action has no effect.
 		//This implies that if the element returned by getElementById is not a case, then the
 		//	processor must carry on searching for a case element that does have that id.
 		//Notable is the fact that this does not cause a binding-exception, as @submit, @bind and @model do.
 		//In a valid (and validated) XForms document, it would be impossible to encounter this situation, as 
 		// even with the repeating-structure factor, it would be impossible to define two *different* elements
 		// that share an ID.
 		
 		//If it is deemed that this is incorrect behaviour, this block, starting "if (!oCase)" should be deleted.
 		//This will also invalidate Issue 97, for which there is a test in the regression suite, which should also be removed.
		if (!oCase) {
			var caseCollection = NamespaceManager.getElementsByTagNameNS(document, "http://www.w3.org/2002/xforms", "case");
			for (i = 0; i < caseCollection.length; ++i) {
				oCase = caseCollection[i];
				if (oCase.id === sCaseID && typeof oCase.toggle === 'function') {	// quack quack	
					break;
				}
			}
		}
		
		if (oCase) {
			oCase.toggle();
		}
	}
};

