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

