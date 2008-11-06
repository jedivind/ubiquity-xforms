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
// limitations under the License.


function runTheTests() {
  var moduleBase = pathToModule("unit-test-loader");
  var loader = new YAHOO.util.YUILoader();

  // There is no 'short name' for these two CSS files, so we need to reference them directly.
  //
  loader.addModule({ name: "logger-css",      type: "css",  fullpath: "http://yui.yahooapis.com/2.5.2/build/logger/assets/logger.css" });
  loader.addModule({ name: "test-logger-css", type: "css",  fullpath: "http://yui.yahooapis.com/2.5.2/build/yuitest/assets/testlogger.css" });

  // Add references to unit test scripts here.
  //
  
  loader.addModule({ name: "ux-ut-xforms-library-loaded", type: "js",  fullpath: moduleBase + "ut-xforms-library-loaded.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });
  loader.addModule({ name: "ux-ut-xpath-core-functions", type: "js",  fullpath: moduleBase + "ut-xpath-core-functions.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });
  loader.addModule({ name: "ux-ut-NamespaceManager", type: "js",  fullpath: moduleBase + "ut-NamespaceManager.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });

  loader.addModule({ name: "ux-ut-path-to-module", type: "js",  fullpath: moduleBase + "ut-path-to-module.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });

  loader.addModule({ name: "ux-ut-instance-standalone", type: "js",  fullpath: moduleBase + "ut-instance-standalone.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });

  loader.addModule({ name: "ux-ut-model-standalone", type: "js",  fullpath: moduleBase + "ut-model-standalone.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });

  loader.addModule({ name: "ux-ut-reset", type: "js",  fullpath: moduleBase + "ut-reset.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });
  
  loader.addModule({ name: "ux-ut-select1", type: "js",  fullpath: moduleBase + "ut-select1.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });

  loader.addModule({ name: "ux-ut-finite-control", type: "js",  fullpath: moduleBase + "ut-finite-control.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });

  loader.addModule({ name: "ux-ut-delete-nodes", type: "js",  fullpath: moduleBase + "ut-delete-nodes.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });

  loader.addModule({ name: "ux-ut-insert-nodes", type: "js",  fullpath: moduleBase + "ut-insert-nodes.js",
    requires: [ "yuitest", "logger-css", "test-logger-css" ] });

  loader.require(

    "ux-ut-xforms-library-loaded", 
    "ux-ut-xpath-core-functions", 
    "ux-ut-NamespaceManager", 
    "ux-ut-path-to-module", 
    "ux-ut-reset",
    "ux-ut-model-standalone",
    "ux-ut-instance-standalone", 
    "ux-ut-select1", 
    "ux-ut-finite-control",  
    "ux-ut-delete-nodes", 
    "ux-ut-insert-nodes");

  var sBars = "";
  loader.onProgress = function(o) {
    sBars += ("|");
    window.status = ("Loading test modules: " + sBars + " [" + o.name + "]");
  };

  loader.onSuccess = function(o) {
    //create the logger
    var logger = new YAHOO.tool.TestLogger();
    window.status = "testing"; 

    // Add the test suite to the runner's queue.
    //
    
    YAHOO.tool.TestRunner.add(oSuitePathToModule);
    YAHOO.tool.TestRunner.add(suiteXFormsLibraryLoaded);
    YAHOO.tool.TestRunner.add(suiteXPathCoreFunctions);
    YAHOO.tool.TestRunner.add(suiteNamespaceManager);
    YAHOO.tool.TestRunner.add(suiteInstanceStandalone);
    YAHOO.tool.TestRunner.add(suiteModelStandalone);
    YAHOO.tool.TestRunner.add(suiteReset);

    YAHOO.tool.TestRunner.add(suiteFiniteControl);
    YAHOO.tool.TestRunner.add(suiteSelect1);

    // Run the tests.
    //

    YAHOO.tool.TestRunner.run();
    window.status = "tested"; 
		return;
  };// onSucess()
  
  loader.insert();
  return;
}

(
  //Don't assume that the YUILoader is present
  function () {
    if (typeof YAHOO === 'undefined' || typeof YAHOO.util.YUILoader === 'undefined') {

        var head = document.getElementsByTagName("head")[0],
        scriptElement  = document.createElement('script');
        head.appendChild(scriptElement);
        scriptElement.setAttribute("type", "text/javascript");
        scriptElement.setAttribute("src",   "http://yui.yahooapis.com/2.5.2/build/yuiloader/yuiloader-beta-min.js"); 
        window.onload=runTheTests;
        
    } else if(typeof loader !== 'undefined') {
 
      //Where a loader is defined (and probably running).  Set the testrunner to kick off once it has finished.
      var onSuccessAlready =  loader.onSuccess || function(o){};
      loader.onSuccess = function(o) {
        onSuccessAlready(o);
        runTheTests();
      };
      
    }

  }()
);


