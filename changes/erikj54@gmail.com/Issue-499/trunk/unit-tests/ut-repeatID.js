var suiteRepeatCase = function () {

  var retval = new YAHOO.tool.TestSuite({
    name : "Test RepeatID",
    setUp : function() {
    },
    
    tearDown : function(){
    }
  });

var Assert = YAHOO.util.Assert; 

var caseRepeatID = new YAHOO.tool.TestCase({
	name  :	"Test RepeatID",
	
	setUp : function () {
		
	///Create the model
	var modelDiv = document.createElement("div")
	new EventTarget(modelDiv);
	this.testModel = new Model(modelDiv);
	////need to create a repeat
		
	Assert.isObject(NamespaceManager);
	Assert.isTrue(NamespaceManager.addOutputNamespace("xf", "http://www.w3.org/2002/xforms"));
	
	this.repeat = this.createElement("xf:repeat", "http://www.w3.org/2002/xforms", document.body);
	DECORATOR.extend(this.repeat, new EventTarget(this.repeat), false);
	DECORATOR.extend(this.repeat, new Context(this.repeat), false);
	DECORATOR.extend(this.repeat, new Repeat(this.repeat), false);
	
	this.inputWithID = this.createElement("xf:input","http://www.w3.org/2002/xforms", this.repeat);
	this.inputWithID.setAttribute("id", "in"); ///should set the id to id="in"
	this.toggleRefToID = this.createElement("xf:toggle","http://www.w3.org/2002/xforms", this.repeat)
	this.toggleRefToID.setAttribute("case", "in"); ///should set the id to id="in"
	this.repeat.storeTemplate();
	
	this.repeat.m_model = this.testModel;


  },
  
  tearDown: function(){

  	  document.body.removeChild(this.repeat);
  	  this.repeat = null;
  	  this.inputWithID = null;
  	  this.toggleRefToID = null;
    },
	testCreateChildrenRepeatID:
	function() {
		this.repeat.m_nIndex = 0;
		this.repeat_m_offest = 0;       
		this.repeat.putIterations(3);
		
		///Now asser that he ide is some value.....
		Assert.areSame(this.repeat.childNodes[1].childNodes[0].getAttribute("id"),"in1");
		Assert.areSame(this.repeat.childNodes[1].childNodes[1].getAttribute("case"),"in1");
		
		Assert.areSame(this.repeat.childNodes[2].childNodes[0].getAttribute("id"),"in2");
		Assert.areSame(this.repeat.childNodes[2].childNodes[1].getAttribute("case"),"in2");
	},
	
	createElement: function(name, ns, parent) {
      var element;

      if (ns) {
        element = document.createElementNS(ns, name);
      } else {
        element = document.createElement(name);
      }

      if (parent) {
        element = parent.appendChild(element);
      }

      return element;
    }

	
});
retval.add(caseRepeatID);
return retval;
}();
