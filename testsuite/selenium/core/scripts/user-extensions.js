//HACK: This whole document is a HACK, inspired by the even worse (i.e. non-working) implementation of this hack at:
//http://cfis.savagexi.com/articles/2006/08/02/selenium-and-xhtml
//TODO: Implement properly
//	I suspect that the reason for the published hack may be that the namespace declarations are unavailable in some way.
//		This assertion merits investigation.  It would be far superior to be able to build the switch list found in 
//		_namespaceResolver on the fly, rather than the current implementation that requires us to manually add our most
//		 commonly used prefixes to this list by hand.


PageBot.prototype._namespaceResolver = 
function(prefix)
{

	switch(prefix)
	{
		case "":
		case "html":
		case "xhtml":
		case "x":
			return 'http://www.w3.org/1999/xhtml';
		case "mathml":
			return 'http://www.w3.org/1998/Math/MathML';
		case "xf":
		case "xforms": 
			return "http://www.w3.org/2002/xforms";
		case "smil":
		     return "http://www.w3.org/2005/SMIL21/BasicAnimation";
		default:
			throw new Error("My Unknown namespace: " + prefix + ".")
	}
}

PageBot.prototype._findElementUsingFullXPath = 
function(xpath, inDocument) {
    // HUGE hack - remove namespace from xpath for IE
    if (browserVersion.isIE)
    {
        xpath = xpath.replace(/xf:/g,'')
        xpath = xpath.replace(/xforms:/g,'')
        xpath = xpath.replace(/smil:/g,'')
    }

    // Use document.evaluate() if it's available
    if (inDocument.evaluate) {
        // cfis
        //return inDocument.evaluate(xpath, inDocument, null, 0, null).iterateNext();
        //PRB: This mechanism can't cope with namespaces - Paul.
        //var nl = inDocument.evaluate(xpath, inDocument, this._namespaceResolver, 0, null);
		
//        return nl.iterateNext();
    }

    // If not, fall back to slower JavaScript implementation
    var context = new ExprContext(inDocument);
    var xpathObj = xpathParse(xpath);
    var xpathResult = xpathObj.evaluate(context);
    if (xpathResult && xpathResult.value) {
        return xpathResult.value[0];
    }
    return null;
};

//Allows comparisons such as greater than/less than

PatternMatcher.strategies["numeric"] = function(RHS)
{
	    this.RHS = RHS;
        this.matches = function(actual) {
            return eval(actual + this.RHS);
        };
}

Selenium.prototype.doJustWait = function(timeout)
{
	var d0 = new Date();
	while(true)
	{
		var d1 = new Date();
		if(d1 - d0 > timeout)
			break;
	}
}
/*
Selenium.prototype.XFormsSetProperty = function(locator,propObjString)
{
    var currentDocument = selenium.browserbot.getCurrentWindow().document;
    var element = this.page().findElement(locator);
	if(element)
	{
	    var propObj;
	    eval("propObj = "+propObjString);
		elment.SetProperty(propObj.name,propObj.value);
	}
}
*/

Selenium.prototype.assertXFormsProperty = function(locator,propObjString)
{
    var currentDocument = selenium.browserbot.getCurrentWindow().document;
    var element = this.page().findElement(locator);
    if(!element)
    {
		Assert.fail("element not found");
    }
    else
    {
	    var propObj;
	    eval("propObj = "+propObjString);
		var s = element.getProperty(propObj.name);
		if(propObj.value != s)
		{
			Assert.fail("value '"+s+"' does not match expected '"+propObj.value+"'");
		}
	}
}

Selenium.prototype.getXformsControlValue = function(locator) {
	var element = this.page().findElement(locator);

	return element.getValue();
};

Selenium.prototype.isModelReady = function(locator) {
	var doc = this.page();
	var element = doc.findElement(locator);

	return element.m_bXFormsReadyFired;
};

Selenium.prototype.findEffectiveStyleProperty = function(element, property) {
	var propertyValue = "";
	if (selenium.browserbot.getCurrentWindow().getComputedStyle){
		propertyValue = selenium.browserbot.getCurrentWindow().getComputedStyle(element, null).getPropertyValue(property);
	}
	else if (element.currentStyle){
		property = property.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		propertyValue = element.currentStyle[property];
	}
	return propertyValue;
}

TestResult.prototype.getLocalPath = function(origPath) {
	var originalPath = /* convertUriToUTF8( */ origPath /*,config.options.txtFileSystemCharSet)*/;
	// Remove any location or query part of the URL
	var argPos = originalPath.indexOf("?");
	if (argPos != -1)
		originalPath = originalPath.substr(0,argPos);
	var hashPos = originalPath.indexOf("#");
	if (hashPos != -1)
		originalPath = originalPath.substr(0,hashPos);
	// Convert file://localhost/ to file:///
	if(originalPath.indexOf("file://localhost/") == 0)
		originalPath = "file://" + originalPath.substr(16);
	// Convert to a native file format
	var localPath;
	if(originalPath.charAt(9) == ":") // pc local file
		localPath = unescape(originalPath.substr(8)).replace(new RegExp("/","g"),"\\");
	else if(originalPath.indexOf("file://///") == 0) // FireFox pc network file
		localPath = "\\\\" + unescape(originalPath.substr(10)).replace(new RegExp("/","g"),"\\");
	else if(originalPath.indexOf("file:///") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(7));
	else if(originalPath.indexOf("file:/") == 0) // mac/unix local file
		localPath = unescape(originalPath.substr(5));
	else // pc network file
		localPath = "\\\\" + unescape(originalPath.substr(7)).replace(new RegExp("/","g"),"\\");
	return localPath;
};


TestResult.prototype._saveToFile = function (fileName, form) {
        // This works when run as an IE HTA and in FF
        var inputs = new Object();
        for (var i = 0; i < form.elements.length; i++) {
            inputs[form.elements[i].name] = form.elements[i].value;
        }

        var objFSO, scriptFile;

        if (navigator.userAgent.toLowerCase().indexOf("gecko") !== -1) {
						fileName = this.getLocalPath(
							makeAbsoluteURI(document.location.toString(), fileName)
						);
            netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
						var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
						
						//try {
							file.initWithPath(fileName);
						//} catch(e) {
						//	throw "Bad file name";
						//}
						//try {
							if (!file.exists()) {
								file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420);
							}
						//} catch(e) {
						//	throw "Cannot create file";
						//}
            scriptFile = {
            		stream: Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream),

								WriteLine: function(s) {
									return this.stream.write(s, s.length);
								},

								Close: function() {
									return this.stream.close();
								}
						};
						//try {
							scriptFile.stream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
						//} catch(e) {
						//	throw "Cannot create file";
						//}
        } else {
            objFSO = new ActiveXObject("Scripting.FileSystemObject");
            scriptFile = objFSO.CreateTextFile(fileName);
				}

         scriptFile.WriteLine("<html><body>\n<h1>Test suite results </h1>" +
                             "\n\n<table>\n<tr>\n<td>result:</td>\n<td>" + inputs["result"] + "</td>\n" +
                             "</tr>\n<tr>\n<td>totalTime:</td>\n<td>" + inputs["totalTime"] + "</td>\n</tr>\n" +
                             "<tr>\n<td>numTestPasses:</td>\n<td>" + inputs["numTestPasses"] + "</td>\n</tr>\n" +
                             "<tr>\n<td>numTestFailures:</td>\n<td>" + inputs["numTestFailures"] + "</td>\n</tr>\n" +
                             "<tr>\n<td>numCommandPasses:</td>\n<td>" + inputs["numCommandPasses"] + "</td>\n</tr>\n" +
                             "<tr>\n<td>numCommandFailures:</td>\n<td>" + inputs["numCommandFailures"] + "</td>\n</tr>\n" +
                             "<tr>\n<td>numCommandErrors:</td>\n<td>" + inputs["numCommandErrors"] + "</td>\n</tr>\n" +
                             "<tr>\n<td>" + inputs["suite"] + "</td>\n<td>&nbsp;</td>\n</tr>");
        var testNum = inputs["numTestTotal"];
        for (var rowNum = 1; rowNum < testNum; rowNum++) {
            scriptFile.WriteLine("<tr>\n<td>" + inputs["testTable." + rowNum] + "</td>\n<td>&nbsp;</td>\n</tr>");
        }
        scriptFile.WriteLine("</table></body></html>");
        scriptFile.Close();
    }

