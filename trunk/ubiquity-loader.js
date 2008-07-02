function pathToModule(module) { 
  if (!module) {
    throw("Missing or null parameter supplied.");
  }

  var scripts = document.getElementsByTagName("script");
  var l = scripts.length;
  var s = "";
  var found = false;
  var i, src, pos;

  for (i = 0; i < l; ++i) {
    src = scripts[i].src;
    pos = src.lastIndexOf(module + ".js");
    
    if (pos != -1 && (pos === 0 || src.charAt(pos - 1) === "/" || src.charAt(pos - 1) === "\\")) {
      s = src.slice(0,pos);
      found = true;
      break;
    }
  }
  
  if (!found) {
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
      baseDefaultPath + "lib/xforms/main.js",
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
