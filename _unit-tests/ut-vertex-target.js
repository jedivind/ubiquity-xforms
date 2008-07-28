

var suiteVertexTarget = new YAHOO.tool.TestSuite({
	name : "Test VertexTargets.js"
});

var caseGetProxyNode = new YAHOO.tool.TestCase({
	name		:	"Test VertexTarget",
  setUp   : function() {
    this.Assert = YAHOO.util.Assert
  },
  
	_should: { 
		error: { 
		  testGetProxyNodeFromNothing: true
		} 
	}, 
	
	testGetVirginProxyNode: function() {
	  var obj = {};
	  var proxyNode = getProxyNode(obj);
	  this.Assert.isObject(proxyNode);
	  this.Assert.areSame(proxyNode,obj.m_proxy);
	},
	
	testGetProxyNodeFromProxyNode: function() {
	  var obj = {};
	  var proxyNode = getProxyNode(obj);
	  var otherProxyNode = getProxyNode(proxyNode);
	  this.Assert.areSame(otherProxyNode,proxyNode)
	},
	
	testGetProxyNodeFromObjectWithProxyNode: function() {
	  var obj = {};
	  var proxyNode = getProxyNode(obj);
	  var otherProxyNode = getProxyNode(obj);
	  this.Assert.areSame(otherProxyNode,proxyNode)
	  proxyNode.someTestValue = "hello";
	  this.Assert.areSame(otherProxyNode.someTestValue,"hello")
	},

	testGetDifferentProxyNodes: function() {
	  var obj0 = {};
	  var obj1 = {};
	  var proxyNode0 = getProxyNode(obj0);
	  proxyNode1 = getProxyNode(obj1);
	  this.Assert.areNotSame(proxyNode0, proxyNode1);
	},

	
	testGetProxyNodeFromNothing: function() {
	  var proxyNode = getProxyNode();
	}
	
	
});


var caseGetElementValueOrContent = new YAHOO.tool.TestCase({
	name		:	"Test getElementValueOrContent",
  setUp   : function() {
    this.Assert = YAHOO.util.Assert
  },
  
	_should: { 
		error: { 
		  testGetProxyNodeFromNothing: true
		} 
	},
	
	testGetInnerHTMLInThePresenceOfEmptyValueAttribute: function() {
	  var obj = {
	    getAttribute: function(attrName) {
	        return "";
	    },
	    innerHTML: "goodbye"
	  };
	  this.Assert.areSame(getElementValueOrContent(null, obj),"goodbye");
	},
	
	testGetInnerHTMLInThePresenceOfNullValueAttribute: function() {
	  var obj = {
	    getAttribute: function(attrName) {
	        return null;
	    },
	    innerHTML: "goodbye"
	  };
	  this.Assert.areSame(getElementValueOrContent(null, obj),"goodbye");
	}, 
	
	testGetValueAttribute: function() {

    var modelElement = document.createElement("div");
    var instanceElement = document.createElement("div");
    new EventTarget(instanceElement);
    new EventTarget(modelElement);
		var M = new Model(modelElement);
	  var I = new Instance(instanceElement);
	  I.replaceDocument(xmlParse("<x><y>hello</y></x>"));
	  M.addInstance(I);
	  var obj = {
	    getAttribute: function(attrName) {
	      if(attrName === "value") {
	        return "/x/y";
	      }
	      else {
	        return "";
	      }
	    }
	  };
	  
	  this.Assert.areSame(getElementValueOrContent({model:M},obj),"hello");
	},
	
	testGetValueAttributeInThePresenceOfInnerHTML: function() {
    var modelElement = document.createElement("div");
    var instanceElement = document.createElement("div");
    new EventTarget(instanceElement);
    new EventTarget(modelElement);
		var M = new Model(modelElement);
	  var I = new  Instance(instanceElement);
	  I.replaceDocument(xmlParse("<x><y>hello</y></x>"))
	  M.addInstance(I);
	  var obj = {
	    getAttribute: function(attrName) {
	      if(attrName === "value") {
	        return "/x/y";
	      }
	      else {
	        return "";
	      }
	    },
	    innerHTML: "goodbye"
	  };
	  this.Assert.areSame(getElementValueOrContent({model:M},obj),"hello");
	}

});


var caseGetFirstNode = new YAHOO.tool.TestCase({
  name: "Test getFirstNode",
 
  testGetFirstNodeFromNodeSetWithOneNodeInIt: function() {
    var objN = {type:"node"}
    var objNS = {type:"node-set",nodeSetValue:function(){return [objN];}};
    YAHOO.util.Assert.areSame(getFirstNode(objNS),objN);
  },
  
  testGetFirstNodeFromNodeSetWithMoreThanOneNodeInIt: function() {
    var objN0 = {type:"node"}
    var objN1 = {type:"node"}
    var objNS = {type:"node-set",nodeSetValue:function(){return [objN0,objN1];}};
    YAHOO.util.Assert.areSame(getFirstNode(objNS),objN0);
    YAHOO.util.Assert.areNotSame(getFirstNode(objNS),objN1);
  },
  
  testGetFirstNodeWithEmptyNodeset: function() {
    var objNS = {type:"node-set",nodeSetValue:function(){return [];}};
    YAHOO.util.Assert.isNull(getFirstNode(objNS));
  },
  
   testGetFirstNodeWithNotNodeset: function() {
    var objNS = {type:"banana",nodeSetValue:function(){return ["hello", "sailor"];}};
    YAHOO.util.Assert.isNull(getFirstNode(objNS));
  }

});

var caseGetFirstTextNode = new YAHOO.tool.TestCase({
  name: "Test getFirstTextNode",

  testGetTextNodeFromTextNode : function() {
  },
  testGetTextNodeFromAttribute : function() {
  },
  testGetTextNodeFromDocument : function() {
  },
  testGetTextNodeFromComment : function() {
  },

  testGetExistingTextNodeFromElement : function() {
  },
  testGetNewTextNodeElement : function() {
  }
   
});

var caseGetStringValue = new YAHOO.tool.TestCase({
  name: "Test getStringValue"
});

var caseProxyExpression = new YAHOO.tool.TestCase({
  name: "Test ProxyExpression"
});


var caseProxyNode = new YAHOO.tool.TestCase({
  name: "Test ProxyNode"
});

var caseSingleNodeExpression = new YAHOO.tool.TestCase({
  name: "Test SingleNodeExpression"
});

var caseNodesetExpression = new YAHOO.tool.TestCase({
  name: "Test NodesetExpression"
});

var caseComputedXPathExpression = new YAHOO.tool.TestCase({
  name: "Test ComputedXPathExpression"
});

var caseMIPExpression = new YAHOO.tool.TestCase({
  name: "Test MIPExpression"
});

var caseSubExpression = new YAHOO.tool.TestCase({
  name: "Test SubExpression"
});





suiteVertexTarget.add(caseGetProxyNode);
suiteVertexTarget.add(caseGetElementValueOrContent);
suiteVertexTarget.add(caseGetFirstNode);
suiteVertexTarget.add(caseGetFirstTextNode);
suiteVertexTarget.add(caseGetStringValue);

suiteVertexTarget.add(caseProxyExpression);
suiteVertexTarget.add(caseProxyNode);
suiteVertexTarget.add(caseSingleNodeExpression);
suiteVertexTarget.add(caseNodesetExpression);
suiteVertexTarget.add(caseComputedXPathExpression);
suiteVertexTarget.add(caseMIPExpression);
suiteVertexTarget.add(caseSubExpression);





