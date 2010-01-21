arrScripts = [
	  "http://yui.yahooapis.com/2.5.2/build/yuiloader/yuiloader-beta-min.js",
	  "file://C:\\svn\\code.google.com\\ubiquity-xforms\\range-map\\lib\\xforms\\ie-instance-fixer.js",
	  "file://C:\\svn\\code.google.com\\ubiquity-xforms\\range-map\\lib\\xforms\\set-document-loaded.js",
	  "file://C:\\svn\\code.google.com\\ubiquity-xforms\\range-map\\lib\\xforms\\loader-begin.js",
	  "file://C:\\svn\\code.google.com\\ubiquity-xforms\\range-map\\lib\\xforms\\main.js",
	  "file://C:\\svn\\code.google.com\\ubiquity-xforms\\range-map\\lib\\xforms\\loader-end.js"
];

var arrScriptElements = [];
var l = arrScripts.length;
//for (var i = l-1;i >=0;--i) {
for (var i = 0 ; i < l ; ++i) {
  arrScriptElements.push('<script src="' + arrScripts[i] +'" type="text/javascript">/**/</script>');
}

document.write(arrScriptElements.join("\n"));


