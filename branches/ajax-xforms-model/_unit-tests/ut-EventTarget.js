// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity XForms module adds XForms 1.1 support to the Ubiquity
// library.
//
// Copyright (C) 2008 Backplane Ltd.
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
// limitations under the License
var Assert = YAHOO.util.Assert;


/*
 * Test case to test the addEventListener and removeEventListener of EventTarget object  
 */
var oEventTargetListenerTest = new YAHOO.tool.TestCase({
    name        : "EventTarget Listener Test",
    testValue   : 0,
    addOneCB    : { handleEvent: function(evt) { oEventTargetListenerTest.testValue++; } },
    addTwoCB    : { handleEvent: function(evt) { oEventTargetListenerTest.testValue+=2; } },
    subOneCB    : { handleEvent: function(evt) { oEventTargetListenerTest.testValue--; } },
    subTwoCB    : { handleEvent: function(evt) { oEventTargetListenerTest.testValue-=2; } },   
    setUp       :   function() {
        var elements = NamespaceManager.getElementsByTagNameNS(document.body, "http://www.w3.org/2002/xforms", "model");
        Assert.areEqual(1, elements.length, "No XForms model available for test");
        this.testElement = elements[0];
        this.aDOMInsertedEvent = document.createEvent("Events");
        this.aDOMInsertedEvent.initEvent("DOMNodeInserted", true, false);
        this.aDOMRemovedEvent = document.createEvent("Events");
        this.aDOMRemovedEvent.initEvent("DOMNodeRemoved", true, false);
    },  
    testEventTargetAddListeners1:  
    function() {
        this.testElement.addEventListener("DOMNodeInserted", this.addOneCB, false);
        this.testElement.addEventListener("DOMNodeInserted", this.addTwoCB, false);
        // InsertListener = addOne, addTwo
        // RemoveListener = empty
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);        
        Assert.areEqual(3, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetRemoveListeners1:  
    function() {
        this.testElement.removeEventListener("DOMNodeInserted", this.addOneCB, false);
        this.testElement.removeEventListener("DOMNodeInserted", this.addTwoCB, false);        
        // InsertListener = empty
        // RemoveListener = empty
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);
        Assert.areEqual(0, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetAddListeners2:  
    function() {        
        this.testElement.addEventListener("DOMNodeRemoved", this.subOneCB, false);
        this.testElement.addEventListener("DOMNodeRemoved", this.subTwoCB, false);
        // InsertListener = empty
        // RemoveListener = subOne, subTwo
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);        
        Assert.areEqual(-3, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetAddRemoveListener1:  
    function() {
        this.testElement.addEventListener("DOMNodeInserted", this.addTwoCB, false);
        this.testElement.removeEventListener("DOMNodeRemoved", this.subTwoCB, false);
        // InsertListener = addTwo
        // RemoveListener = subOne
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);
        Assert.areEqual(2, this.testValue, 0);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);
        Assert.areEqual(1, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetListenerRemoveRemovedListener1:
    function() {
        this.testElement.removeEventListener("DOMNodeRemoved", this.subTwoCB, false);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);        
        // InsertListener = addTwo
        // RemoveListener = subOne
        Assert.areEqual(-1, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetListenerAddNullListener:
    function() {
        this.testElement.addEventListener("DOMNodeInserted", null, false);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);
        // InsertListener = addTwo
        // RemoveListener = subOne
        Assert.areEqual(2, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetListenerRemoveNullListener:
    function() {
        this.testElement.removeEventListener("DOMNodeRemoved", null, false);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);        
        // InsertListener = addTwo
        // RemoveListener = subOne
        Assert.areEqual(-1, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetListenerRemoveRemovedListener2:
    function() {
        this.testElement.removeEventListener("DOMNodeInserted", this.addOneCB, false);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);        
        // InsertListener = addTwo
        // RemoveListener = subOne
        Assert.areEqual(2, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetAddRemoveListener2:  
    function() {
        this.testElement.addEventListener("DOMNodeRemoved", this.subTwoCB, false);
        this.testElement.removeEventListener("DOMNodeInserted", this.addTwoCB, false);
        // InsertListener = empty
        // RemoveListener = subOne, subTwo
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);
        Assert.areEqual(-3, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetNoListener:
    function() {
        this.testElement.removeEventListener("DOMNodeRemoved", this.subTwoCB, false);
        this.testElement.removeEventListener("DOMNodeRemoved", this.subOneCB, false);
        // InsertListener = empty
        // RemoveListener = empty
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);        
        Assert.areEqual(0, this.testValue, 0);
        this.testValue = 0;
    },            
    testEventTargetAddDuplicateListener:
    function() {
        this.testElement.addEventListener("DOMNodeInserted", this.addOneCB, false);
        this.testElement.addEventListener("DOMNodeInserted", this.addOneCB, false);
        // InsertListener = addOne
        // RemoveListener = empty
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);        
        Assert.areEqual(1, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetRemoveDuplicateListener:
    function() {
        this.testElement.removeEventListener("DOMNodeInserted", this.addOneCB, false);
        this.testElement.removeEventListener("DOMNodeInserted", this.addOneCB, false);
        //  InsertListener = empty
        //  RemoveListener = empty
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);        
        Assert.areEqual(0, this.testValue, 0);
        this.testValue = 0;
    },        
    testEventTargetAddandRemoveCapture1:
    function() {        
        this.testElement.addEventListener("DOMNodeInserted", this.addOneCB, true);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);
        
        this.testElement.removeEventListener("DOMNodeInserted", this.addOneCB, false);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);
        
        this.testElement.removeEventListener("DOMNodeInserted", this.addOneCB, true);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMInsertedEvent);
        Assert.areEqual(0, this.testValue, 0);
        this.testValue = 0;
    },
    testEventTargetAddandRemoveCapture2:
    function() {        
        this.testElement.addEventListener("DOMNodeRemoved", this.subOneCB, true);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);
            
        this.testElement.removeEventListener("DOMNodeRemoved", this.subOneCB, false);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);
            
        this.testElement.removeEventListener("DOMNodeRemoved", this.subOneCB, true);
        FormsProcessor.dispatchEvent(this.testElement, this.aDOMRemovedEvent);
        Assert.areEqual(0, this.testValue, 0);
        this.testValue = 0;
    } 
});

var suiteEventTarget = new YAHOO.tool.TestSuite("Test EventTarget");
suiteEventTarget.add(oEventTargetListenerTest);
