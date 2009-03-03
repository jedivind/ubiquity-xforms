
// Copyright © 2008-2009 Backplane Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

(function(){
	var testDiv, suiteGetBindObject, errorReceptacle;

	errorReceptacle = {
	  err:"",
	  ownerDocument: document,
	  dispatchEvent: function (e) {
			this.err = e.type;
	  }
	};

	suiteGetBindObject = new YAHOO.tool.TestSuite({
      setUp: function(){
      	testDiv = this.createElement("div", "", document.body);
      	testDiv.innerHTML = "<xf:bind xmlns:xf='http://www.w3.org/2002/xforms' id='bind-0'></xf:bind><span id='not-a-bind'></span>";
      },
      
      tearDown: function(){
				this.destroyElement(testDiv, "testDiv", document.body);  	
      },
          
			createElement: function(name, ns, parent) {
				var element;
	
				if (ns) {
					element = document.createElementNS(ns, name);
				} else {
					element = document.createElement(name);
				}
	
				if (parent) {
					parent.appendChild(element);
				}
	
				return element;
			},
	
			destroyElement: function(element, propertyName, parent) {
				if (parent) {
					parent.removeChild(element);
				}
			}
	});
	
	YAHOO.tool.TestRunner.add(suiteGetBindObject);
	
  suiteGetBindObject.add(
    new YAHOO.tool.TestCase({
    	setUp: function () {
    		errorReceptacle.err = "";
    	},
    	
      tearDown: function(){
    		FormsProcessor.halted = false;
    	},
    	
      testGetBindSuccessfullyWithNoErrorReceptacle : function () {
      	var bindObj;
      	bindObj = FormsProcessor.getBindObject("bind-0");
      	//YAHOO.util.Assert.areSame(bindObj.id,"bind-0");
      	YAHOO.util.Assert.areSame(bindObj.getAttribute("id"),"bind-0");
      },

      testGetBindSuccessfully : function () {
      	var bindObj;
      	bindObj = FormsProcessor.getBindObject("bind-0", errorReceptacle);
      	YAHOO.util.Assert.areSame("bind-0", bindObj.getAttribute("id"));
      	YAHOO.util.Assert.areSame("", errorReceptacle.err);
      },
      
      testGetNoObject : function() {
      	var bindObj = FormsProcessor.getBindObject("ThereIsNoObjectWithThisID", errorReceptacle);
      	YAHOO.util.Assert.isNull(bindObj);
      	YAHOO.util.Assert.areSame("xforms-binding-exception", errorReceptacle.err);
      },
      
      testGetNoObjectWithNoErrorReceptacle : function() {
      	var bindObj = FormsProcessor.getBindObject("ThereIsNoObjectWithThisID");
      	YAHOO.util.Assert.isNull(bindObj);
      },
      
      testGetNotABind : function() {
      	var bindObj = FormsProcessor.getBindObject("not-a-bind", errorReceptacle);
      	YAHOO.util.Assert.isNull(bindObj);
      	YAHOO.util.Assert.areSame("xforms-binding-exception", errorReceptacle.err);
      },
      
      testGetNotABindWithNoErrorReceptacle : function() {
      	var bindObj = FormsProcessor.getBindObject("not-a-bind");
      	YAHOO.util.Assert.isNull(bindObj);
      }
      
  }));
}());


