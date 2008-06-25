arrScripts = [
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/ie-instance-fixer.js",
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/set-document-loaded.js",
    "http://yui.yahooapis.com/2.5.2/build/yuiloader/yuiloader-beta-min.js",
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/loader.js",
	  "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/lib/xforms/main.js"
];

var arrScriptElements = new Array();

for (i in arrScripts) {
  arrScriptElements.push('<script src="' + arrScripts[i] +'">/**/</script>');
}

arrScriptElements.push(
  '<script> \
    window.status = "Loading Ubiquity modules..."; \
    loader.insert(); \
  </script>'
);

document.write(arrScriptElements.join("\n"));
