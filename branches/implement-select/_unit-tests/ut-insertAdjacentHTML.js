
var suiteInsertAdjacentHTML = function () {
  var testDIV;

  var retval = new YAHOO.tool.TestSuite({
    name : "Test insertAdjacentHTML file",
    setUp : function() {
      testDIV = document.createElement("div");
      document.body.appendChild(testDIV);
    },
    
    tearDown : function(){
      testDIV.parentNode.removeChild(testDIV);
    }
  });
  var testSpan;
  var caseInsertHTML = new YAHOO.tool.TestCase({
    name		:	"Test InsertHTML",
    setUp   : function() {
      testSpan =  document.createElement("span"); 
      testDIV.appendChild(testSpan);

    },
    tearDown : function(){
      testDIV.innerHTML = "";
    },
    
    testInsertHTMLBeforeBegin : function() {
      testSpan.insertAdjacentHTML("beforeBegin","<p id='insertedP'>hello</p>");
      YAHOO.util.Assert.areSame(testSpan.previousSibling,document.getElementById("insertedP"));
    },
    testInsertHTMLAfterEnd : function() {
      testSpan.insertAdjacentHTML("afterEnd","<p id='insertedP'>hello</p>");
      YAHOO.util.Assert.areSame(testSpan.nextSibling,document.getElementById("insertedP"));
    },
    testInsertHTMLAfterBegin : function() {
      testSpan.innerHTML = "<b>boogaloo</b>";
      testSpan.insertAdjacentHTML("afterBegin","<p id='insertedP'>hello</p>");
      YAHOO.util.Assert.areNotSame(testSpan.lastChild,document.getElementById("insertedP"));
      YAHOO.util.Assert.areSame(testSpan.firstChild,document.getElementById("insertedP"));
    },
    testInsertHTMLBeforeEnd : function() {
      testSpan.innerHTML = "<b>boogaloo</b>";
      testSpan.insertAdjacentHTML("beforeEnd","<p id='insertedP'>hello</p>");
      YAHOO.util.Assert.areNotSame(testSpan.firstChild,document.getElementById("insertedP"));
      YAHOO.util.Assert.areSame(testSpan.lastChild,document.getElementById("insertedP"));
    }    
  }); 
  
  var caseInsertNode = new YAHOO.tool.TestCase({
    name		:	"Test InsertHTML",
    setUp   : function() {
      testSpan =  document.createElement("span"); 
      testDIV.appendChild(testSpan);
    
    },
    tearDown : function(){
      testDIV.innerHTML = "";
    },
    
    testInsertNodeBeforeBegin : function() {
      var theNode =  document.createElement("p"); 
      testSpan.insertAdjacentElement("beforeBegin",theNode);
      YAHOO.util.Assert.areSame(testSpan.previousSibling,theNode);
    },
    testInsertNodeAfterEnd : function() {
      var theNode =  document.createElement("p"); 
      testSpan.insertAdjacentElement("afterEnd",theNode);
      YAHOO.util.Assert.areSame(testSpan.nextSibling,theNode);
    },
    testInsertNodeAfterBegin : function() {
      var theNode =  document.createElement("p"); 
      testSpan.innerHTML = "<b>boogaloo</b>";
      testSpan.insertAdjacentElement("afterBegin",theNode);
      YAHOO.util.Assert.areNotSame(testSpan.lastChild,theNode);
      YAHOO.util.Assert.areSame(testSpan.firstChild,theNode);
    },
    testInsertNodeBeforeEnd : function() {
      var theNode =  document.createElement("p"); 
      testSpan.innerHTML = "<b>boogaloo</b>";
      testSpan.insertAdjacentElement("beforeEnd",theNode);
      YAHOO.util.Assert.areNotSame(testSpan.firstChild,theNode);
      YAHOO.util.Assert.areSame(testSpan.lastChild,theNode);
    }    
  }); 
  
  var caseInsertText = new YAHOO.tool.TestCase({
    name		:	"Test Insert Text",
    setUp   : function() {
      testSpan =  document.createElement("span"); 
      testDIV.appendChild(testSpan);

    },
    tearDown : function(){
      testDIV.innerHTML = "";
    },
    
    testInsertTextBeforeBegin : function() {
      testSpan.insertAdjacentText("beforeBegin","<p id='insertedP'>hello</p>");
      YAHOO.util.Assert.areNotSame(testSpan.previousSibling,document.getElementById("insertedP"));
      YAHOO.util.Assert.areSame(testSpan.previousSibling.nodeValue,"<p id='insertedP'>hello</p>");
    },
    testInsertTextAfterEnd : function() {
      testSpan.insertAdjacentText("afterEnd","<p id='insertedP'>hello</p>");
      YAHOO.util.Assert.areNotSame(testSpan.nextSibling,document.getElementById("insertedP"));
      YAHOO.util.Assert.areSame(testSpan.nextSibling.nodeValue,"<p id='insertedP'>hello</p>");
    },
    testInsertTextAfterBegin : function() {
      testSpan.innerHTML = "<b>boogaloo</b>";
      testSpan.insertAdjacentText("afterBegin","<p id='insertedP'>hello</p>");
      YAHOO.util.Assert.areNotSame(testSpan.firstChild,document.getElementById("insertedP"));
      YAHOO.util.Assert.areSame(testSpan.firstChild.nodeValue,"<p id='insertedP'>hello</p>");
    },
    testInsertTextBeforeEnd : function() {
      testSpan.innerHTML = "<b>boogaloo</b>";
      testSpan.insertAdjacentText("beforeEnd","<p id='insertedP'>hello</p>");
      YAHOO.util.Assert.areNotSame(testSpan.lastChild,document.getElementById("insertedP"));
      YAHOO.util.Assert.areSame(testSpan.lastChild.nodeValue,"<p id='insertedP'>hello</p>");
    }    
  });
  
  
  
  var suiteContains = new YAHOO.tool.TestSuite({
    name : "Test contains function",
    setUp : function() {
    },
    
    tearDown : function(){
    }
  });

  var caseContains = new YAHOO.tool.TestCase({
    setUp   : function() {
        testDIV.innerHTML = "<p id='someParagraph'><a id='someAnchor'></a></p>";
    },
    tearDown : function(){
    },
    
    testElementContainSelf : function() {
      YAHOO.util.Assert.areSame(document.body.contains(document.body),true);
    },
    testElementContainsChild : function() {
      YAHOO.util.Assert.areSame(document.body.contains(testDIV),true);
    },
    testChildDoesNotContainParent : function() {
      YAHOO.util.Assert.areSame(testDIV.contains(document.body),false);
    },
    testElementContainsDeeperDescendent : function() {
      YAHOO.util.Assert.areSame(document.body.contains(document.getElementById('someAnchor')),true);
    },
    testMemberAppliedToInsertedElements : function() {
      YAHOO.util.Assert.areSame(testDIV.contains(document.getElementById('someAnchor')),true);
    },
    testRemovedItemNoLongerContained : function() {
      var theP = document.getElementById("someParagraph");
      testDIV.removeChild(theP);
      YAHOO.util.Assert.areSame(testDIV.contains(document.getElementById('someAnchor')),false);
      testDIV.appendChild(theP);
    },
    testBlankedItemNoLongerContained : function() {
      var theP = document.getElementById("someParagraph");
      testDIV.innerHTML = "";
      YAHOO.util.Assert.areSame(testDIV.contains(document.getElementById('someAnchor')),false);
      testDIV.appendChild(theP);
    }

    
  
  });
  retval.add(caseInsertHTML);
  retval.add(caseInsertText);
  retval.add(caseInsertNode);
  suiteContains.add(caseContains);
  retval.add(suiteContains);
  return retval;
}();