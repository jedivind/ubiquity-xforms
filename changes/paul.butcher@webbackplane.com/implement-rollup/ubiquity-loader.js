var UX = { };

function pathToModule(module) {
  if (!module) {
    throw("Missing or null parameter supplied.");
  }
  var childNodes = document.childNodes; 
  var l = childNodes.length;
  var i;
  var head;
  for (i = 0; i < l; ++i) {
    if(childNodes[i].nodeName.toLowerCase() === "html") {
      head = childNodes[i].firstChild;
    }
  }
  
  childNodes = head.childNodes;
  l = childNodes.length;
  var s = null;
  var el, src, pos;

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

  if (s === null) {
    throw("No Module called '" + module + "' was found.");
  }
  return s;
}


document.logger = {log:function(s){}};

var baseDefaultPath = pathToModule("ubiquity-loader");
var g_sBehaviourDirectory = baseDefaultPath + "behaviours/";
(
  function()
  {
    var arrScripts = [
      baseDefaultPath + "lib/sniffer.js",
      baseDefaultPath + "lib/xforms/ie-instance-fixer.js",
      baseDefaultPath + "lib/xforms/ie6-css-selectors-fixer.js",
      baseDefaultPath + "lib/xforms/set-document-loaded.js",
      baseDefaultPath + "ubiquity-xforms.js"
    ];
    var arrScriptElements = [ ];
    var i, l = arrScripts.length;

    for (i = 0 ; i < l ; ++i) {
      arrScriptElements.push('<script src="' + arrScripts[i] +'" type="text/javascript">/**/</script>');
    }
    arrScriptElements.push("<link rel='stylesheet' href='" + baseDefaultPath + "ubiquity-xforms.css'></style>");
    document.write(arrScriptElements.join("\n"));
    
  }()
);
