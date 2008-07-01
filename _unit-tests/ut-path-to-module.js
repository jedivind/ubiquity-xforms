var Assert = YAHOO.util.Assert; 

var oSuitePathToModule = new YAHOO.tool.TestSuite({
	name : "Test getPathToModule",
	setUp		: 	function()
	{
		this.testElement = document.createElement("div");
		var sInner = 'XXX<script src="../somescript0.js"></script>';
		sInner += '<script src="../../../../somescript1.js"></script>';
		sInner += '<script src="/scripts/somescript2.js"></script>';
		sInner += '<script src="http://www.example2.com/somescript3.js"></script>';
		sInner += '<script src="/somescripts.js/somescripts.js"></script>';
		sInner += '<script src="xy/absomescript4.js"></script>';
		sInner += '<script src="http://www.example.com/somescript4.js"></script>';
		sInner += '<script src="C:\\somedir\\somescript5.js"></script>';
		
		this.testElement.innerHTML =  sInner;
		document.body.appendChild(this.testElement);
	},
	tearDown	:	function()
	{
		this.testElement.parentNode.removeChild(this.testElement);
		delete this.testElement;
	}

});

var oTestGetPathToModule = new YAHOO.tool.TestCase({
	name		:	"Test oTestGetPathToModule",
	
	_should: { 
		error: { 
			testGetPathToModuleThatDoesNotExist : true,
			testGetPathToModuleWithNoArg : true,
	    testGetPathToModuleWithNullArg : true
		} 
	}, 
	testGetPathToModuleRelative:
	function() {
		Assert.areEqual(pathToModule("somescript0"), "../");
		Assert.areEqual(pathToModule("somescript1"), "../../../../");
		Assert.areEqual(pathToModule("somescript2"), "/scripts/");
	},

	testGetPathToModuleAbsolute:
	function() {
		Assert.areEqual(pathToModule("somescript3"), "http://www.example2.com/");
	},
	
	testGetPathToModuleWithDuplicateNameInPath:
	function() {
		Assert.areEqual(pathToModule("somescripts"), "/somescripts.js/");
	},
	
	testGetPathToModuleWithPrecedingSimilarlyNamedScript:
	function() {
		Assert.areEqual(pathToModule("absomescript4"), "xy/");
		Assert.areNotEqual(pathToModule("somescript4"), "xy/");
		Assert.areEqual(pathToModule("somescript4"), "http://www.example.com/");
	},
	
	testGetPathToModuleOnFileSystem:
	function() {
		Assert.areEqual(pathToModule("somescript5"), "c:\\somedir\\");
	},
	

	testGetPathToModuleThatDoesNotExist:
	function() {
	  pathToModule("Quirkafleeg");
	},

	testGetPathToModuleWithNoArg:
	function() {
	  pathToModule();
	},
	
	testGetPathToModuleWithNullArg:
	function() {
	  pathToModule(null);
	}

	
});

oSuitePathToModule.add(oTestGetPathToModule);