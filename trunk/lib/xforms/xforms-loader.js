// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity XForms module adds XForms support to the Ubiquity library.
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

(
  function(){
    var baseDefaultPath = pathToModule("xforms-loader");
  
  	window.status = "configuring module loader";
  	loader.addModule({ name: "ux-default-css",       type: "css",  fullpath: baseDefaultPath + "default.css" });
  
    loader.addModule({ name: "libxh-xlink",          type: "js",  fullpath: baseDefaultPath + "lib/_backplane/xlink.js",
  		requires: [ "connection" ] });
  	loader.addModule({ name: "xforms-listener",            type: "js",  fullpath: baseDefaultPath + "lib/dom/listener.js" });
  	loader.addModule({ name: "xforms-threads",             type: "js",  fullpath: baseDefaultPath + "lib/threads.js" });
  	loader.addModule({ name: "xforms-dom2events",          type: "js",  fullpath: baseDefaultPath + "lib/dom/dom2events.js",
  		requires: [ "yahoo" ] });
  	loader.addModule({ name: "xforms-insert-adjacent-html", type: "js",  fullpath: baseDefaultPath + "lib/insertAdjacentHTML.js" });
  	
  	loader.addModule({ name: "xforms-vertex-target",       type: "js",  fullpath: baseDefaultPath + "lib/xforms/VertexTargets.js",
  		requires: [ "yahoo" ] });
  	loader.addModule({ name: "xforms-state",               type: "js",  fullpath: baseDefaultPath + "lib/xforms/state.js" });
  	
  	loader.addModule({ name: "backplane-pds",              type: "js",  fullpath: baseDefaultPath + "lib/xforms/pds.js" });
  	loader.addModule({ name: "backplane-model",            type: "js",  fullpath: baseDefaultPath + "lib/xforms/model.js",
  		requires: [ "backplane-pds" ] });
  	loader.addModule({ name: "xforms-model",               type: "js",  fullpath: baseDefaultPath + "lib/xforms/modelObj.js",
  		requires: ["xforms-instance",  "backplane-model", "libxh-namespace-manager", "xforms-threads", "xforms-vertex-target" ] });
  	loader.addModule({ name: "xforms-submission-core",     type: "js",  fullpath: baseDefaultPath + "lib/xforms/xforms-submission.js" });
  	loader.addModule({ name: "xforms-submission-core-yui", type: "js",  fullpath: baseDefaultPath + "lib/xforms/xforms-submission-yui.js",
  		requires: [ "xforms-submission-core", "connection" ] });
  	loader.addModule({ name: "xforms-submission",          type: "js",  fullpath: baseDefaultPath + "lib/xforms/Submission.js",
  		requires: ["libxh-xlink", "xforms-processor", "xforms-submission-core-yui" ] });
  	
  	loader.addModule({ name: "xforms-processor",           type: "js",  fullpath: baseDefaultPath + "lib/xforms/xforms.js",
  		requires: [ "xforms-model"] });
  	loader.addModule({ name: "xforms-conditional-invocation", type: "js", fullpath: baseDefaultPath + "lib/xforms/conditional-invocation.js",
  		requires: [ "xforms-processor" ] });
  	
  	loader.addModule({ name: "libxh-namespace-manager",            type: "js",  fullpath: baseDefaultPath + "lib/namespaceManager.js",
  			requires:["dom"]});
  	
  	loader.addModule({ name: "libxh-decorator",            type: "js",  fullpath: baseDefaultPath + "lib/decorate.js", 
  		requires:["libxh-namespace-manager"]});
  
  	loader.addModule({ name: "xforms-dom-misc",            type: "js",  fullpath: baseDefaultPath + "lib/ajaxslt/misc.js" });
  	loader.addModule({ name: "xforms-dom",                 type: "js",  fullpath: baseDefaultPath + "lib/ajaxslt/dom.js",
  		requires: [ "xforms-dom-misc" ] });
  	loader.addModule({ name: "xforms-xpath",               type: "js",  fullpath: baseDefaultPath + "lib/ajaxslt/xpath.js" });
  	loader.addModule({ name: "xforms-ajaxslt-improvements", type: "js",  fullpath: baseDefaultPath + "lib/xforms/ajaxslt-improvements.js",
  		requires: [ "xforms-dom", "xforms-xpath" ] });
  	loader.addModule({ name: "xforms-core-function-library", type: "js",  fullpath: baseDefaultPath + "lib/xforms/xforms-core-function-library.js",
  	requires: [ "xforms-xpath" ] });
  	
  	loader.addModule({ name: "xforms-instance",            type: "js",  fullpath: baseDefaultPath + "lib/xforms/Instance.js",
  		requires: ["xforms-dom", "xforms-dom2events", "xforms-ajaxslt-improvements", "xforms-core-function-library" ] });
  	
  	
  	//control values
  	loader.addModule({ name: "xforms-input-value",         type: "js",  fullpath: baseDefaultPath + "lib/xforms/input-value.js" });
  	loader.addModule({ name: "xforms-output-value",        type: "js",  fullpath: baseDefaultPath + "lib/xforms/output-value.js" });
  	loader.addModule({ name: "xforms-range-value",        type: "js",  fullpath: baseDefaultPath + "lib/xforms/range-value.js",
  		requires: ["slider"]});
  	
  	//container elements
  	loader.addModule({ name: "xforms-group",        type: "js",  fullpath: baseDefaultPath + "lib/xforms/Group.js" });
  	loader.addModule({ name: "xforms-repeat",        type: "js",  fullpath: baseDefaultPath + "lib/xforms/Repeat.js",
  		requires: [ "xforms-model","xforms-group"]});
  	
  	loader.addModule({ name: "backplane-case",        type: "js",  fullpath: baseDefaultPath + "lib/_backplane/case.js" });
  	loader.addModule({ name: "xforms-case",        type: "js",  fullpath: baseDefaultPath + "lib/xforms/case.js", 
  		requires: [ "backplane-case"]});
  	loader.addModule({ name: "xforms-switch",        type: "js",  fullpath: baseDefaultPath + "lib/xforms/Switch.js",
  		requires: [ "xforms-case"]});
  	
  	
  	loader.addModule({ name: "xforms-control",             type: "js",  fullpath: baseDefaultPath + "lib/xforms/Control.js",
  		requires: [ "xforms-model", "xforms-processor", "xforms-state", "xforms-insert-adjacent-html" ] });
  	loader.addModule({ name: "xforms-context",             type: "js",  fullpath: baseDefaultPath + "lib/xforms/context.js",
  	    requires:[ "libxh-namespace-manager"]});
  	loader.addModule({ name: "xforms-event-target-proxy",  type: "js",  fullpath: baseDefaultPath + "lib/dom/eventTargetProxy.js",
  		requires: [ "xforms-dom2events" ] });
  
  	//actions
  	loader.addModule({ name: "xforms-action",              type: "js",  fullpath: baseDefaultPath + "lib/xforms/xf-action.js",
  		requires: [ "xforms-listener", "xforms-threads" ] });
  	loader.addModule({ name: "xforms-actions",              type: "js",  fullpath: baseDefaultPath + "lib/xforms/actions.js",
  		requires:["container"]});  
  	loader.addModule({ name: "xforms-setvalue",             type: "js",  fullpath: baseDefaultPath + "lib/xforms/setvalue.js",
  	    	requires:["xforms-actions"]});
  	loader.addModule({ name: "xforms-toggle",             type: "js",  fullpath: baseDefaultPath + "lib/xforms/toggle.js",
  	    	requires:["xforms-actions"]});
  	loader.addModule({ name: "xforms-select",             type: "js",  fullpath: baseDefaultPath + "lib/xforms/select.js",
  	    	requires:["xforms-dom2events"]});
  	loader.addModule({ name: "xforms-item",             type: "js",  fullpath: baseDefaultPath + "lib/xforms/item.js",
  	    	requires:["xforms-dom2events"]});
  	
  	loader.addModule({ name: "xforms-defs",                type: "js",  fullpath: baseDefaultPath + "lib/xforms/xforms-defs.js",
  	  requires: [
  	    "ux-default-css",
        "libxh-decorator",
  	    "xforms-listener", "xforms-event-target-proxy",
  	    "xforms-conditional-invocation",
  	    "xforms-model", "xforms-instance", "xforms-submission",
  	    "xforms-action", "xforms-context", "xforms-control",
  	    "xforms-input-value", "xforms-output-value", "xforms-range-value", 
  	    "xforms-group","xforms-repeat","xforms-switch",
  	    "xforms-select","xforms-item",
  	    "xforms-actions","xforms-setvalue","xforms-toggle"
  	  ]
  	});
    loader.require( "xforms-defs" );

    loader.addModule({
      name: "second-onload",
      type: "js",  
      fullpath: baseDefaultPath + "lib/second-onload.js", 
      requires:[ "xforms-insert-adjacent-html" ]
    });

    loader.require( "second-onload" );
  }()
);
