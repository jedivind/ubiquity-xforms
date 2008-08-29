var ctx = new ExprContext(
  xmlParse(
    "<test> \
      <numbers> \
         <number>1</number> \
         <number>2</number> \
         <number>3</number> \
         <number>4</number> \
         <number></number> \
         <Number>5</Number> \
      </numbers> \
      <numbers2> \
         <number>0</number> \
         <number>1</number> \
         <number>invalid</number> \
         <number>3</number> \
         <number>4</number> \
         <number></number> \
         <number></number> \
      </numbers2> \
      <numbers3> \
         <number>0</number> \
         <number>-1</number> \
         <number>-2</number> \
         <number>-3</number> \
         <number>6</number> \
         <number>12</number> \
      </numbers3> \
    </test>"
  )
);

// This is simiar to the function that makes the xpath case insensitive or not.
// The real function is in lib/xforms/ajaxslt-improvements.js.
function xpathDomEval(expr, node) {
	var expr1 = xpathParse(expr);
	var oExpr = node;
	if (!g_bIsInXHTMLMode) {
		oExpr.setCaseInsensitive(true);
	}
	var ret = expr1.evaluate(oExpr);
	return ret;
};

var Assert = YAHOO.util.Assert; 

var suiteXPathCase = new YAHOO.tool.TestSuite({
	name : "Test XPathCase",
	setUp		: 	function()
	{
	}
});

var caseXPathCase = new YAHOO.tool.TestCase({
	name  :	"Test XPathCase",
	setUp : function () {
    this.Assert = YAHOO.util.Assert;

  },
  
	_should: { 
		error: { 
		
		} 
	},
	
	testEvaluateXPathWhenCaseIsSensitive:
	function() {
    g_bIsInXHTMLMode = true;
    var val = xpathDomEval("/test/numbers/Number", ctx);
    this.Assert.areSame(val.stringValue(),"5");
    val = xpathDomEval("/test/numbers/number", ctx);
    this.Assert.areSame(val.stringValue(),"1");
	},
	
	testEvaluateXPathWhenCaseIsInsensitive:
	function() {
    g_bIsInXHTMLMode = false;
    var val = xpathDomEval("/test/numbers/Number", ctx);
    this.Assert.areSame(val.stringValue(),"1");
    val = xpathDomEval("/test/numbers/number", ctx);
    this.Assert.areSame(val.stringValue(),"1");
	}
	
});

suiteXPathCase.add(caseXPathCase);