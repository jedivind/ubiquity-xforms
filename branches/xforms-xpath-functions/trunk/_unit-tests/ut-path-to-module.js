var Assert = YAHOO.util.Assert; 

var oSuitePathToModule = new YAHOO.tool.TestSuite({
	name : "Test getPathToModule",
	setUp		: 	function()
	{
    var arrScripts = [
      "../somescript0.js",
      "../../../../somescript1.js",
      "/scripts/somescript2.js",
      "http://www.example2.com/somescript3.js",
      "/somescripts.js/somescripts.js",
      "xy/absomescript4.js",
      "http://www.example.com/somescript4.js",
      "C:\\somedir\\somescript5.js"
    ];
    var i, l = arrScripts.length;

    for (i = 0 ; i < l ; ++i) {
      el = document.createElement("script");
      el.setAttribute("src", arrScripts[i]);
      document.firstChild.firstChild.appendChild(el);
    }
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