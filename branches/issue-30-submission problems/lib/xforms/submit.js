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
function Submit(elmnt)
{
	this.element = elmnt;
    this.element.addEventListener(
   		"DOMActivate",
       	this,			
		true
		);
}

Submit.prototype.handleEvent = DeferToConditionalInvocationProcessor;

Submit.prototype.performAction = function(oEvt) {
   var control = this;
   
   if (oEvt.type === "DOMActivate") { 
     var sID = control.element.getAttribute("submission");
    
	 if (sID){
		var oSubmission = control.element.ownerDocument.getElementById(sID);

		if (oSubmission) {
			var oEvt1 =  oSubmission.ownerDocument.createEvent("Events"); // ("SubmissionEvents");
//			var oEvt1 = document.createEvent("SubmissionEvents");

//			oEvt1.initSubmissionEvent("xforms-submit", false, false, null, null);
            oEvt1.initEvent("xforms-submit", false, false, null, null);
			
			spawn(function(){FormsProcessor.dispatchEvent(oSubmission,oEvt1)});
		}
		else {
			throw "There is no submission element with an ID of '" + sID + "'";
		}
	 }
	 else {
		throw "A submission ID is required.";
	 }
  }
};