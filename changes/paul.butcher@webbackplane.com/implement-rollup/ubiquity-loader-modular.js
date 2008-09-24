var UX = { };

function pathToModule(module) {
  if (!module) {
    throw("Missing or null parameter supplied.");
  }
  var i;
  var head = document.getElementsByTagName("head")[0];
  
  var childNodes = head.childNodes;
  var l = childNodes.length;
  var s = null;
  var el, src, pos;

  for (i = 0; i < l; ++i) {
    el = childNodes[i];
    if (el.nodeType === 1 && (el.nodeName.slice(el.nodeName.indexOf(":")+1,el.nodeName.length).toLowerCase() === "script")) { 
      src = el.src;
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
    throw("No Module called '" + module + "' was found.");
  }
  return s;
}


var baseDefaultPath = pathToModule("ubiquity-loader");

(
  function() {
    var arrScripts = [
      "http://yui.yahooapis.com/2.5.2/build/yuiloader/yuiloader-beta-min.js",
      baseDefaultPath + "lib/sniffer.js",
      baseDefaultPath + "lib/xforms/ie-instance-fixer.js",
      baseDefaultPath + "lib/xforms/ie6-css-selectors-fixer.js",
      baseDefaultPath + "lib/xforms/set-document-loaded.js",
      baseDefaultPath + "lib/xforms/loader-begin.js",
      baseDefaultPath + "lib/xforms/xforms-loader.js",
//      baseDefaultPath + "lib/_platform/yui/xforms-loader-yui.js",
      baseDefaultPath + "lib/xforms/loader-end.js"
    ];
    var arrScriptElements = [ ];
    var i, l = arrScripts.length;

    var head = document.getElementsByTagName("head")[0];
    var scriptElement;    
    for (i = 0 ; i < l ; i++) {
       scriptElement = document.createElement('script');
       head.appendChild(scriptElement);
       scriptElement.setAttribute("type","text/javascript");
       scriptElement.setAttribute("src", arrScripts[i]);    
    }
            
  }()
);
