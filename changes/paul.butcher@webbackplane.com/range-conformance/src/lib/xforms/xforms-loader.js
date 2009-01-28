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

var g_sBehaviourDirectory  = "";
 
(
  function(){
    var moduleBase = pathToModule("xforms-loader");
    g_sBehaviourDirectory = moduleBase + "../../behaviours/";
    
  	window.status = "configuring module loader";  	
  	
  	loader.addModule({ name: "ux-default-css",       type: "css",  fullpath: moduleBase + "../../assets/style/default.css"});
  
    loader.addModule({ name: "libxh-xlink",          type: "js",  fullpath: moduleBase + "../_backplane/xlink.js",
  		requires: [ "connection" ] });
  	loader.addModule({ name: "xforms-listener",            type: "js",  fullpath: moduleBase + "../dom/listener.js" });
  	loader.addModule({ name: "xforms-threads",             type: "js",  fullpath: moduleBase + "../threads.js" });
  	loader.addModule({ name: "xforms-dom2events",          type: "js",  fullpath: moduleBase + "../dom/dom2events.js",
  		requires: [ "yahoo" ] });
  	loader.addModule({ name: "xforms-utils", type: "js",  fullpath: moduleBase + "../UXUtils.js" });
  	
  	loader.addModule({ name: "xforms-vertex-target",       type: "js",  fullpath: moduleBase + "VertexTargets.js",
  		requires: [ "yahoo" ] });
  	loader.addModule({ name: "xforms-state",               type: "js",  fullpath: moduleBase + "state.js" });
  	
  	loader.addModule({ name: "backplane-pds",              type: "js",  fullpath: moduleBase + "pds.js" });
  	loader.addModule({ name: "backplane-model",            type: "js",  fullpath: moduleBase + "model.js",
  		requires: [ "backplane-pds" ] });
  	loader.addModule({ name: "xforms-model",               type: "js",  fullpath: moduleBase + "modelObj.js",
  		requires: ["xforms-instance",  "backplane-model", "libxh-namespace-manager", "xforms-threads", "xforms-vertex-target" ] });

  	loader.addModule({ name: "xforms-submission-core",     type: "js",  fullpath: moduleBase + "xforms-submission.js" });

    loader.addModule({ name: "xforms-submission",          type: "js",  fullpath: moduleBase + "Submission.js",
  		requires: ["libxh-xlink", "xforms-processor", "xforms-submission-core", "libxh-namespace-manager"  ] });
  	
  	loader.addModule({ name: "xforms-processor",           type: "js",  fullpath: moduleBase + "xforms.js",
  		requires: [ "xforms-model"] });
  	loader.addModule({ name: "xforms-conditional-invocation", type: "js", fullpath: moduleBase + "conditional-invocation.js",
  		requires: [ "xforms-processor" ] });
  	
  	loader.addModule({ name: "libxh-namespace-manager",            type: "js",  fullpath: moduleBase + "../namespaceManager.js",
  			requires:["dom"]});
  	
  	loader.addModule({ name: "libxh-decorator",            type: "js",  fullpath: moduleBase + "../decorate.js", 
  		requires:["libxh-namespace-manager"]});
  
    // crypto
    loader.addModule({ name: "xpath-extension-md5",          type: "js",  fullpath: moduleBase + "../third-party/md5.js" });
    loader.addModule({ name: "xpath-extension-sha1",        type: "js",  fullpath: moduleBase + "../third-party/sha1.js" });

  	loader.addModule({ name: "xforms-dom-util",            type: "js",  fullpath: moduleBase + "../ajaxslt/util.js" });
  	loader.addModule({ name: "xforms-dom-xml",            type: "js",  fullpath: moduleBase + "../ajaxslt/xmltoken.js" });
  	loader.addModule({ name: "xforms-dom",                 type: "js",  fullpath: moduleBase + "../ajaxslt/dom.js",
  		requires: [ "xforms-dom-util", "xforms-dom-xml" ] });
  	loader.addModule({ name: "xforms-xpath",               type: "js",  fullpath: moduleBase + "../ajaxslt/xpath.js" });
  	loader.addModule({ name: "xforms-ajaxslt-improvements", type: "js",  fullpath: moduleBase + "ajaxslt-improvements.js",
  		requires: [ "xforms-dom", "xforms-xpath" ] });
  	loader.addModule({ name: "xforms-core-function-library", type: "js",  fullpath: moduleBase + "xforms-core-function-library.js",
  	requires: [ "xforms-xpath", "xpath-extension-md5", "xpath-extension-sha1" ] });


  	loader.addModule({ name: "xforms-instance",            type: "js",  fullpath: moduleBase + "Instance.js",
  		requires: ["xforms-dom", "xforms-dom2events", "xforms-ajaxslt-improvements", "xforms-core-function-library" ] });
  	
  	
  	//control values
  	loader.addModule({ name: "xforms-input-value",         type: "js",  fullpath: moduleBase + "input-value.js" });
  	loader.addModule({ name: "xforms-output-value",        type: "js",  fullpath: moduleBase + "output-value.js" });
  	loader.addModule({ name: "xforms-range-value",        type: "js",  fullpath: moduleBase + "range-value.js",
  		requires: ["slider"]});
  	
  	//container elements
  	loader.addModule({ name: "xforms-group",        type: "js",  fullpath: moduleBase + "Group.js" });
  	loader.addModule({ name: "xforms-repeat",        type: "js",  fullpath: moduleBase + "Repeat.js",
  		requires: [ "xforms-model","xforms-group"]});
  	
  	loader.addModule({ name: "backplane-case",        type: "js",  fullpath: moduleBase + "../_backplane/case.js" });
  	loader.addModule({ name: "xforms-case",        type: "js",  fullpath: moduleBase + "case.js", 
  		requires: [ "backplane-case"]});
  	loader.addModule({ name: "xforms-switch",        type: "js",  fullpath: moduleBase + "Switch.js",
  		requires: [ "xforms-case"]});
  	
  	
  	loader.addModule({ name: "xforms-control",             type: "js",  fullpath: moduleBase + "Control.js",
  		requires: [ "xforms-model", "xforms-processor", "xforms-state", "xforms-utils" ] });
  	loader.addModule({ name: "xforms-context",             type: "js",  fullpath: moduleBase + "context.js",
  	    requires:[ "libxh-namespace-manager"]});
  	loader.addModule({ name: "xforms-event-target-proxy",  type: "js",  fullpath: moduleBase + "../dom/eventTargetProxy.js",
  		requires: [ "xforms-dom2events" ] });
  
  	//actions
  	loader.addModule({ name: "xforms-actions",              type: "js",  fullpath: moduleBase + "actions.js",
  		requires:["container", "xforms-message-css", "yui-style-css", "xforms-notify", "message-yui"]});  
  	loader.addModule({ name: "xforms-action",              type: "js",  fullpath: moduleBase + "xf-action.js",
  		requires: [ "xforms-listener", "xforms-threads", "xforms-actions" ] });
  	loader.addModule({ name: "xforms-model-actions",        type: "js",  fullpath: moduleBase + "modelactions.js",
  		requires:["xforms-actions","xforms-processor"]});  

  	loader.addModule({ name: "xforms-setvalue",             type: "js",  fullpath: moduleBase + "setvalue.js",
  	    	requires:["xforms-instance","xforms-actions"]});
    loader.addModule({ name: "xforms-insert",               type: "js",  fullpath: moduleBase + "insert.js",
            requires:["xforms-instance","xforms-actions"]});
    loader.addModule({ name: "xforms-delete",               type: "js",  fullpath: moduleBase + "delete.js",
            requires:["xforms-instance","xforms-actions"]});
            
  	loader.addModule({ name: "xforms-toggle",             type: "js",  fullpath: moduleBase + "toggle.js",
  	    	requires:["xforms-actions"]});

  	loader.addModule({ name: "backplane-multimap",             type: "js",  fullpath: moduleBase + "../_backplane/multimap.js"});
  	
  	loader.addModule({ name: "backplane-select",             type: "js",  fullpath: moduleBase + "../_backplane/select.js",
  	    	requires:["backplane-multimap"]});

  	loader.addModule({ name: "finite-control",             type: "js",  fullpath: moduleBase + "finite-control.js"});
    
  	      
  	loader.addModule({ name: "xforms-select",             type: "js",  fullpath: moduleBase + "select.js",
  	    	requires:["xforms-dom2events", "backplane-select", "finite-control","xforms-dropbox-yui"]});
  	loader.addModule({ name: "xforms-item",             type: "js",  fullpath: moduleBase + "item.js",
  	    	requires:["xforms-dom2events"]});

    loader.addModule({ name: "xforms-submit",             type: "js",  fullpath: moduleBase + "submit.js"});

    // --- CUSTOM CONTROLS ---

    //     -- YUI --

  	loader.addModule({ name: "xforms-submission-core-yui", type: "js",  fullpath: moduleBase + "../_platform/yui/xforms-submission-yui.js",
  		requires: [ "connection" ] });

    loader.addModule({ name: "xforms-dropbox-yui",             type: "js",  fullpath: moduleBase + "../_platform/yui/dropbox-yui.js",
  	      requires:["menu"]});

    // ColorPicker widget
  	loader.addModule({ name: "yui-input-color",     type: "js",  fullpath: moduleBase + "../extensions/input-color.js",
  		requires: ["yui-color","yui-colorpicker-css"]});
  	loader.addModule({ name: "yui-color",           type: "js",  fullpath: "http://yui.yahooapis.com/2.5.2/build/colorpicker/colorpicker-min.js",
  		requires: ["yui-slider"]});
  	loader.addModule({ name: "yui-slider",          type: "js",  fullpath: "http://yui.yahooapis.com/2.5.2/build/slider/slider-min.js" });
  	loader.addModule({ name: "yui-colorpicker-css", type: "css", fullpath: "http://yui.yahooapis.com/2.5.2/build/colorpicker/assets/skins/sam/colorpicker.css" });

    // Calendar widget
    loader.addModule({ name: "yui-input-calendar",  type: "js",  fullpath: moduleBase + "../extensions/input-calendar.js",
            requires: ["yui-element","yui-dom-event","yui-button","yui-container-core","yui-calendar","yui-calendar-css","yui-button-css"]});
    loader.addModule({ name: "yui-calendar",        type: "js",  fullpath: "http://yui.yahooapis.com/2.5.2/build/calendar/calendar-min.js" });
    loader.addModule({ name: "yui-container-core",  type: "js",  fullpath: "http://yui.yahooapis.com/2.5.2/build/container/container_core-min.js" });
    loader.addModule({ name: "yui-button",          type: "js",  fullpath: "http://yui.yahooapis.com/2.5.2/build/button/button-min.js" });
    loader.addModule({ name: "yui-dom-event",       type: "js",  fullpath: "http://yui.yahooapis.com/2.5.2/build/yahoo-dom-event/yahoo-dom-event.js" });
    loader.addModule({ name: "yui-element",         type: "js",  fullpath: "http://yui.yahooapis.com/2.5.2/build/element/element-beta-min.js" });
    loader.addModule({ name: "yui-calendar-css",    type: "css", fullpath: "http://yui.yahooapis.com/2.5.2/build/calendar/assets/skins/sam/calendar.css" });
    loader.addModule({ name: "yui-button-css",      type: "css", fullpath: "http://yui.yahooapis.com/2.5.2/build/button/assets/skins/sam/button.css" });

    // Messaging work
    loader.addModule({ name: "yui-style-css",       type: "css", fullpath: moduleBase + "../_platform/yui/message-panel.css" });
    loader.addModule({ name: "xforms-notify",       type: "js",  fullpath: moduleBase + "../_backplane/notify.js" });
    loader.addModule({ name: "message-yui",         type: "js",  fullpath: moduleBase + "../_platform/yui/message.js" });
	loader.addModule({ name: "xforms-hint-css",     type: "css", fullpath: moduleBase + "../../assets/style/hint.css" });
	loader.addModule({ name: "xforms-message-css",  type: "css", fullpath: moduleBase + "../../assets/style/message.css" });

    loader.addModule({ name: "xforms-hint",         type: "js",  fullpath: moduleBase + "hint.js",
      requires: [ "xforms-hint-css", "xforms-notify" ] });

    // XF4H Processor
    loader.addModule( { name: "xf4h",  type: "js",  fullpath: moduleBase + "xf4h.js"});

    loader.addModule({ name: "xforms-defs",                type: "js",  fullpath: moduleBase + "xforms-defs.js",
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
        "xforms-actions","xforms-model-actions",
        "xforms-setvalue","xforms-insert","xforms-delete",
        "xforms-toggle", 
        "xforms-submit",
        "xforms-hint",
        "yui-input-calendar","yui-input-color",
        "xf4h","xforms-submission-core-yui"
      ]
    });
    loader.require( "xforms-defs" );

    loader.addModule({
      name: "second-onload",
      type: "js",  
      fullpath: moduleBase + "../second-onload.js", 
      requires:[ "xforms-utils" ]
    });

    loader.require( "second-onload" );
  }()
);
