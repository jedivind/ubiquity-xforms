
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
	var suiteMIPConsumer;
	var returnFalse = function () { 
		return false;
	} 
	var returnTrue= function () { 
		return true;
	} 
	YAHOO.tool.TestRunner.add(new YAHOO.tool.TestCase({
			name: "Testing the MIPConsumer object",
      setUp: function(){
      	this.testDiv = this.createElement("div", document.body);
      	DECORATOR.extend(this.testDiv, new MIPConsumer(this.testDiv), false);
      },
      
      tearDown: function(){
      	this.destroyElement(this.testDiv, "testDiv", document.body);
    		FormsProcessor.halted = false;
      },
      
      testSetView : function () {
      	this.testDiv.setView({
      		readonly:{getValue:returnFalse},
      		required:{getValue:returnFalse},
      		valid:{getValue:returnTrue},
      		enabled:{getValue:returnTrue},
      		getMIPState: function (s) {
      			switch(s) {
      				case "readonly" :
      					return false;
      				case "required":
      					return false;
      				case "valid":
      					return true;
      				case "enabled":
      					return true;
      			}
      		}
      	})
      	
      	YAHOO.util.Assert.areSame( "enabled read-write optional valid", this.testDiv.className);
      },
      
      testIsDirtyMIP : function () {
      	this.testDiv.m_MIPSCurrentlyShowing.readonly = false;
      	YAHOO.util.Assert.areSame(true, this.testDiv.isDirtyMIP({getMIPState: function () {return true}}, "readonly"));
      },
      
      testIsNotDirtyMIP : function () {
      	this.testDiv.m_MIPSCurrentlyShowing.readonly = true;
      	YAHOO.util.Assert.areSame(false, this.testDiv.isDirtyMIP({getMIPState: function () {return true}}, "readonly"));
      },
      
      testTestMIPChangesNoChange : function () {
       	var oProxy = {
      		readonly:{getValue:returnFalse},
      		required:{getValue:returnFalse},
      		valid:{getValue:returnTrue},
      		enabled:{getValue:returnTrue},
      		getMIPState: function (s) {
      			switch(s) {
      				case "readonly" :
      					return false;
      				case "required":
      					return false;
      				case "valid":
      					return true;
      				case "enabled":
      					return true;
      			}
      		}
      	};
      	
       	this.testDiv.setView(oProxy);
       	this.testDiv.dirtyState.setClean();
       	this.testDiv.testMIPChanges(oProxy);
      	YAHOO.util.Assert.areSame(false, this.testDiv.dirtyState.isDirty("readonly"));
      	YAHOO.util.Assert.areSame(false, this.testDiv.dirtyState.isDirty("required"));
      	YAHOO.util.Assert.areSame(false, this.testDiv.dirtyState.isDirty("valid"));
      	YAHOO.util.Assert.areSame(false, this.testDiv.dirtyState.isDirty("enabled"));
      },
      
      testTestMIPChangesAllChange : function () {
       	var oProxy0 = {
      		readonly:{getValue:returnFalse},
      		required:{getValue:returnFalse},
      		valid:{getValue:returnTrue},
      		enabled:{getValue:returnTrue},
      		getMIPState: function (s) {
      			switch(s) {
      				case "readonly" :
      					return false;
      				case "required":
      					return false;
      				case "valid":
      					return true;
      				case "enabled":
      					return true;
      			}
      		}
      	};

				var oProxy1 = {
      		getMIPState: function (s) {
      			switch(s) {
      				case "readonly" :
      					return true;
      				case "required":
      					return true;
      				case "valid":
      					return false;
      				case "enabled":
      					return false;
      			}
      		}
      	};
       	this.testDiv.setView(oProxy0);
       	this.testDiv.dirtyState.setClean();
       	this.testDiv.testMIPChanges(oProxy1);
      	YAHOO.util.Assert.areSame(true, this.testDiv.dirtyState.isDirty("readonly"));
      	YAHOO.util.Assert.areSame(true, this.testDiv.dirtyState.isDirty("required"));
      	YAHOO.util.Assert.areSame(true, this.testDiv.dirtyState.isDirty("valid"));
      	YAHOO.util.Assert.areSame(true, this.testDiv.dirtyState.isDirty("enabled"));
      },
      
      testTestMIPChangesSomeChange : function () {
       	var oProxy0 = {
      		readonly:{getValue:returnFalse},
      		required:{getValue:returnFalse},
      		valid:{getValue:returnTrue},
      		enabled:{getValue:returnTrue},
      		getMIPState: function (s) {
      			switch(s) {
      				case "readonly" :
      					return false;
      				case "required":
      					return false;
      				case "valid":
      					return true;
      				case "enabled":
      					return true;
      			}
      		}
      	};

				var oProxy1 = {
      		getMIPState: function (s) {
      			switch(s) {
      				case "readonly" :
      					return true;
      				case "required":
      					return false;
      				case "valid":
      					return false;
      				case "enabled":
      					return true;
      			}
      		}
      	};
       	this.testDiv.setView(oProxy0);
       	this.testDiv.dirtyState.setClean();
       	this.testDiv.testMIPChanges(oProxy1);
      	YAHOO.util.Assert.areSame(true, this.testDiv.dirtyState.isDirty("readonly"),"readonly");
      	YAHOO.util.Assert.areSame(false, this.testDiv.dirtyState.isDirty("required"), "required");
      	YAHOO.util.Assert.areSame(true, this.testDiv.dirtyState.isDirty("valid"), "valid");
      	YAHOO.util.Assert.areSame(false, this.testDiv.dirtyState.isDirty("enabled"), "enabled");
      },
      
			testDispatchMIPEvents: function () {
				var oProxy = {
      		readonly:{getValue:returnFalse},
      		required:{getValue:returnFalse},
      		valid:{getValue:returnTrue},
      		enabled:{getValue:returnTrue},
      		getMIPState: function (s) {
      			switch(s) {
      				case "readonly" :
      					return false;
      				case "required":
      					return false;
      				case "valid":
      					return true;
      				case "enabled":
      					return true;
      			}
      		},
      		m_oNode: {}
      	};
      	
				this.testDiv.setView(oProxy);
				this.testDiv.eventsReceived = "";
				this.testDiv.dispatchEvent = function (e) {
					this.eventsReceived += e.type;
				};
      	this.testDiv.dispatchMIPEvents(oProxy);
      	YAHOO.util.Assert.areSame("xforms-validxforms-optionalxforms-readwritexforms-enabled", this.testDiv.eventsReceived);
			},
			
			testRefresh: function () {
				this.testDiv.m_proxy = {
      		readonly:{getValue:returnFalse},
      		required:{getValue:returnFalse},
      		valid:{getValue:returnTrue},
      		enabled:{getValue:returnTrue},
      		getMIPState: function (s) {
      			switch(s) {
      				case "readonly" :
      					return false;
      				case "required":
      					return false;
      				case "valid":
      					return true;
      				case "enabled":
      					return true;
      			}
      		},
      		m_oNode: {}
      	};
      	
				this.testDiv.eventsReceived = "";
				this.testDiv.dispatchEvent = function (e) {
					this.eventsReceived += e.type;
				};

				this.testDiv.refresh();
      	YAHOO.util.Assert.areSame( "enabled read-write optional valid", this.testDiv.className, "class");
      	YAHOO.util.Assert.areSame("xforms-validxforms-optionalxforms-readwritexforms-enabled", this.testDiv.eventsReceived, "events");
			},
			
			testRewire: function () {
				var node = {getAttribute: function(){return null}},
						oProxy = getProxyNode(node);
				this.testDiv.getBoundNode = function(){
				
					return {model:{},node:node};
				};
				this.testDiv.rewire();
				YAHOO.util.Assert.areSame(oProxy, this.testDiv.m_proxy);
			},
			
			createElement: function(name, parent) {
				var element = document.createElement(name);
	
				if (parent) {
					parent.appendChild(element);
				}
	
				return element;
			},
	
			destroyElement: function(element, propertyName, parent) {
				if (parent) {
					parent.removeChild(element);
				}
	
				delete this[propertyName];
			}
	}));
	
}());


