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
function Submit(elmnt) {
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
    
     var oSubmission = null;
	 if (sID){
		oSubmission = control.element.ownerDocument.getElementById(sID);
     }
     else {
       // if there is not a declared submssion id,  get the first submission element of the default model 
       var oModel = getModelFor(control.element.ownerDocument);
       if (oModel) {
         // halt on the first submission in model
          var nsChildNodes = oModel.element.childNodes;
          for (var i = 0; i < nsChildNodes.length; i++) {
			 if (CheckElementName(nsChildNodes[i],"submission","http://www.w3.org/2002/xforms")) {
			    var oSubmission = nsChildNodes[i];
			    break;
			 }   
		  }
       }
     }

	 if (oSubmission) {
		var oEvt1 =  oSubmission.ownerDocument.createEvent("Events"); 

        oEvt1.initEvent("xforms-submit", false, false, null, null);
			
		spawn(function(){FormsProcessor.dispatchEvent(oSubmission,oEvt1)});
 	 }
	 else {
	    if (sID) {
		  throw "There is no submission element with an ID of '" + sID + "'";
		}
		else {
		  throw "There is no submission element associated with the default model.";
		}
	 }	 
  }
};