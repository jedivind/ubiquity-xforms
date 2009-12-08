
loader = {
		
		 modulesList:  {},
		 requires: [],
		 currLoading: null,
		 loaded: false,
		
		/* registering the module that needs to be loaded
		 * accepts as param a module and stores it in module arrray
		 * Type, name, and path are specified,
		 * Option param: requires which is the dependencies
		 */
		addModule: function (module){
			 if(!module || !module.name || !module.type || !module.fullpath){
				 return false;
			 }
			 module.requires = module.requires || [];
			 module.loaded = false;
			 module._callback = function(){
				 alert("loaded" + module.fullpath);
			 };
			 this.modulesList[module.name] = module;
		 },
		 
		 /*
		  * Add a module as a requirement to load before proceeding
		  * accepts a string representing the module to load
		  */
		 require: function(moduleName){
			 if(!moduleName || !this.modulesList[moduleName]){
				 ///log error
				 return false;
			 }
			 this.requires.push(moduleName); 
		 },
		 
		 /*
		  * Main function that will insert the js and css scripts using 
		  * either addScript or AddStyle from UX, cycles through the modules
		  * that have been added to the loader and attempts to insert them
		  * failures are ignored and logged.
		  */
		 insert: function(){
			 var module,i,tempModule;
				 for(module in this.modulesList){
					 tempModule = this.modulesList[module];
					if(this._dependenciesLoaded(tempModule)){
						this._loadModule(tempModule);
					}
				 }
		},
		
		
		 
		 /*
		  * Loads a script using dynamic creation
		  * does not support AJAX right now needs to be re-factored to use DOJO Async call
		  */
		 _loadModule: function(module){
			 if(module.type == "js"){
				 UX.preloader.addScript(module.fullpath, module._callBack);
			 }
			 else if(module.type == "css"){
				 UX.preloader.addStyle(module.fullpath);
			 }
		 },
		 
		 /*
		  * Accepts a module and returns a boolean as to whether or not 
		  * the required modules that are precursors are loaded in the doc
		  */
		 _dependenciesLoaded: function(module){
			 var modTemp;
			 for (modTemp in module.requires){
				 if(this.modulesList[modTemp] && this.modulesList[modTemp].loaded === false){
					 return false;
				 }
			 }
			 module.loaded = true;
			 
			 return true;
		 },
		 _loaded: function(){
			 var module, i;
			 for(module in this.modulesList){
				 if(module.loaded === false){
					 this.notLoaded = false;
					 return false;
				 }
			 }
			 this.notLoaded = true;
			 return true;
		 }
	
};




/*
loader.onFailure = function(msg, xhrobj) {
  window.status = "Failed to load Ubiquity XForms: ";
};

var sBars = "";
loader.onProgress = function(o) {
  sBars += ("|");
  window.status = ("Loading Ubiquity modules: " + sBars + " [" + o.name + "]");
};

loader.onSuccess = function(o) {
   window.status = "Successfully loaded Ubiquity XForms";
  spawn(InsertElementForOnloadXBL);
};

*/
