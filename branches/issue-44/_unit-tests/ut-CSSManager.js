var Assert = YAHOO.util.Assert; 

var oTestTranslateCSS = new YAHOO.tool.TestCase({
	name		:	"Test translation of CSS Selectors",
	setUp		: 	function(){ },
	tearDown	:	function(){ },

	_should: { 
		error: { 
			testUnknownCSSSelector: true
		} 
	}, 
	testConstruction:
	function() {
		Assert.isObject(CSSManager);
	},
	testHomographousNamespaceSelector:
	function() {
		NamespaceManager.addOutputNamespace("xf","http://www.w3.org/2002/xforms");
		//Assert.areEqual(expected, actual, message)
		Assert.areEqual("xf|quirkafleeg", CSSManager.translateCSSSelector("xf\:quirkafleeg"));
	},
	testHeterographousNamespaceSelector:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("x","http://www.w3.org/2002/xforms");
		Assert.areEqual("x|quirkafleeg", CSSManager.translateCSSSelector("y\:quirkafleeg"));
	},
	testSelectorWithMultipleInstances:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("xf","http://www.w3.org/2002/xforms");
		Assert.areEqual("xf|quirkafleeg xf|performance", CSSManager.translateCSSSelector("xf\:quirkafleeg xf\:performance"));
	},
	testSelectorWithAnotherNamespace:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("x","urn:someNamespace");
		CSSManager.setOutputNamespace("urn:someNamespace");
		Assert.areEqual("x|quirkafleeg x|performance", CSSManager.translateCSSSelector("x\:quirkafleeg x\:performance"));
	},
	testSelectorWithClassInstance:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("xf","http://www.w3.org/2002/xforms");
		CSSManager.setOutputNamespace("http://www.w3.org/2002/xforms");
		Assert.areEqual('xf|quirkafleeg*[class~="className"] xf|performance*[class~="nextClass"]', CSSManager.translateCSSSelector("xf\:quirkafleeg.className xf\:performance.nextClass"));
	},
	testSelectorWithWildCardClassInstance:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("xf","http://www.w3.org/2002/xforms");
		Assert.areEqual('*[class~="invalid"]', CSSManager.translateCSSSelector(".invalid"));
	},
	testSelectorValidAlert:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("xf","http://www.w3.org/2002/xforms");
		Assert.areEqual( '*[class~="valid"] xf|alert', CSSManager.translateCSSSelector(".valid xf\:alert"));
	},
	testSelectorNoChange:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("xf","http://www.w3.org/2002/xforms");
		Assert.areEqual('*[class~="company_name"]', CSSManager.translateCSSSelector('*[class~="company_name"]'));
	},
	testSelectorOutputWithClass:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("xforms","http://www.w3.org/2002/xforms");
		Assert.areEqual('xforms|output*[class~="regular"]', CSSManager.translateCSSSelector('xforms|output.regular'));
	},
	testSelectorXFormsWithWildCardClass:
	function() {
	    NamespaceManager.clean();
		NamespaceManager.addOutputNamespace("xforms","http://www.w3.org/2002/xforms");
		Assert.areEqual('xforms|**[class~="disabled"]', CSSManager.translateCSSSelector('xforms|*.disabled'));
	}
});


var suiteCSSManager = new YAHOO.tool.TestSuite("Test CSS Manager");

suiteCSSManager.add(oTestTranslateCSS);