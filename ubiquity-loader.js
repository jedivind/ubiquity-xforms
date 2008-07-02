function pathToModule(module) { 
  if (!module) {
    throw("Missing or null parameter supplied.");
  }
  var head = document.firstChild.firstChild;
  var childNodes = head.childNodes;
  var l = childNodes.length;
  var s = null;
  var el, i, src, pos;

  for (i = 0; i < l; ++i) {
    el = childNodes[i];
    if (el.nodeType === 1 && el.nodeName === "SCRIPT") {
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

  if (!s) {
    throw("No Module called '" + module + "' was found.");
  }
  return s;
}

var baseDefaultPath = pathToModule("ubiquity-loader");
g_sBehaviourDirectory = baseDefaultPath + "behaviours/";

(
  function()
  {
    var arrScripts = [
      "http://yui.yahooapis.com/2.5.2/build/yuiloader/yuiloader-beta-min.js",
      baseDefaultPath + "lib/xforms/ie-instance-fixer.js",
      baseDefaultPath + "lib/xforms/set-document-loaded.js",
      baseDefaultPath + "lib/xforms/loader-begin.js",
      baseDefaultPath + "lib/xforms/xforms-loader.js",
      baseDefaultPath + "lib/xforms/loader-end.js"
    ];
    var arrScriptElements = [ ];
    var i, l = arrScripts.length;

    for (i = 0 ; i < l ; ++i) {
      arrScriptElements.push('<script src="' + arrScripts[i] +'" type="text/javascript">/**/</script>');
    }
    document.write(arrScriptElements.join("\n"));
  }()
);
