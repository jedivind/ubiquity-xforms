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
var UX = {useRollup: false};
document.logger = { log: function(sText, sContext) { } };

function pathToModule(module) {
  if (!module) {
    throw ("Missing or null parameter supplied.");
  }
  var i;
  var head = document.getElementsByTagName("head")[0];
  
  var childNodes = head.childNodes;
  var l = childNodes.length;
  var s = null;
  var el, src, pos;

  for (i = 0; i < l; ++i) {
    el = childNodes[i];
    if (el.nodeType === 1 && (el.nodeName.slice(el.nodeName.indexOf(":") + 1, el.nodeName.length).toLowerCase() === "script")) { 
      src = el.getAttribute("src");
      if (src) {
        pos = src.lastIndexOf(module + ".js");
        
        if (pos != -1 && (!pos || src.charAt(pos - 1) === "/" || src.charAt(pos - 1) === "\\")) {
          s = src.slice(0, pos);
          break;
        }
      }// if @src is present
    }// if we have a script element
  }// for each child node

  if (s === null) {
    throw ("No Module called '" + module + "' was found.");
  }
  return s;
}


var baseDefaultPath = pathToModule("ubiquity-loader");
var g_sBehaviourDirectory = baseDefaultPath + "/behaviours/";
(
  function () {
    var head = document.getElementsByTagName("head")[0];
   /**
     function: addScript
     Adds a script to the document, and optionally executes a function when the script has finished loading
     
     scriptURL - The URL of the script to load
     onComplete - (optional) A function to execute once the script defined by <scriptURL> has finished loading, or failed to load.
   */
    var addScript = function (scriptURL, onComplete) {
      var scriptElement;
      scriptElement = document.createElement('script');
      head.appendChild(scriptElement);
      scriptElement.setAttribute("type", "text/javascript");
      scriptElement.setAttribute("src", scriptURL); 
      if (onComplete) {
        scriptElement.onreadystatechange  = function () {
          if (scriptElement.readyState === 'loaded') {
            onComplete();
          } 
        };
        scriptElement.onload = onComplete;
        scriptElement.onerror = onComplete;
      }
      return scriptElement;
    };
    var addStyle = function (styleURL) {
      var styleElement;
      styleElement = document.createElement('link');
      head.appendChild(styleElement);
      styleElement.setAttribute("rel", "stylesheet");
      styleElement.setAttribute("href", styleURL); 
    };
    //Add preliminary scripts - in particular, ie-instance-fixer must come here, since adding it as part of addApplicationScripts is too late for it to have any effect
    //  The others may not need to be here, but I have left this set of scripts in the same order as I found them.
    addScript(baseDefaultPath + "lib/sniffer.js");
    addScript(baseDefaultPath + "lib/xforms/ie-instance-fixer.js");
    addScript(baseDefaultPath + "lib/xforms/ie6-css-selectors-fixer.js");
    addScript(baseDefaultPath + "lib/xforms/set-document-loaded.js");
    //Add the script to determine whether or not to use the rollup.  Once this is ready, the application scripts can be added.
    addScript("http://ubiquity.googlecode.com/svn/trunk/client-parameters/fragmentParsing.js", function () {
      //Inspect the URL to see whether the application should be  loaded from the rollup, 
      //  or with the loader.
      if (typeof saveParametersFromURL === 'function') {
        saveParametersFromURL(window.location.href, UX);
      } 
      
      //Vars returned from the URL are just strings.
      if (UX.useRollup && UX.useRollup !== "false") {
        addStyle(baseDefaultPath + "lib/xforms/style/ubiquity-xforms.css");
        addScript(baseDefaultPath + "ubiquity-xforms.js");
      } else {
        addScript("http://yui.yahooapis.com/2.5.2/build/yuiloader/yuiloader-beta-min.js", 
          function () {
            addScript(baseDefaultPath + "lib/xforms/loader-begin.js");
            addScript(baseDefaultPath + "lib/xforms/xforms-loader.js");
            addScript(baseDefaultPath + "lib/xforms/loader-end.js");
          }
        );
      }
    });
  }()
);


