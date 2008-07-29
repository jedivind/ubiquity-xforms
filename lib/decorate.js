/*
 * Copyright (C) 2008 Backplane Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
	@fileoverview
	Contains functions used in the decoration of elements and objects. Along with the mechanism for 
		setting up decoration.
	
*/

/**
	path to the directory that contains decorator.xml and applicator.htc
*/

if (typeof g_sBehaviourDirectory === "undefined") {
  g_sBehaviourDirectory = "http://ubiquity-xforms.googlecode.com/svn/branches/0.3/behaviours/";
}

var g_bIsInXHTMLMode = false;

var DECORATOR = function()
{
	/**
		runs through a list of functions and calls them in the context of obj as this
		@param {Object} obj object in whose context the functions in handlers should be executed.
		@param {Array} handlers list of functions that should be executed with obj as this
	*/
	function callHandlers(obj,handlers)
	{
		if(handlers)
		{
			obj.oHandler = handlers.pop();
			while(obj.oHandler)
			{
				obj.oHandler();
				obj.oHandler = handlers.pop();
			}
		}
	}

	//globals used in non-IE browsers.
	var g_arrHandlersToCallOnLoad = [];

	/**
		Called by implementations that do not natively support a documentReady event.
			on document load, this function calls any documentready handlers that have 
			been registered so far, then sets the g_bDocumentLoaded flag to true, so that 
			any documentready handlers that attempt to register later can execute immediately.	
		Now that all the scripts are loaded after the rest of the document, this is also required
		by IE, to call the handlers at the end of processing.
	*/
	function callDocumentReadyHandlers()
	{
		var o = g_arrHandlersToCallOnLoad.pop();
		while(o)
		{
			callHandlers(o[0],o[1]);
			o = g_arrHandlersToCallOnLoad.pop();
		}
		
		g_bDocumentLoaded = true;
	}

		
	/**
		Called by implementations that do not natively support a documentReady event.
			If the document has already loaded, handlers passed into this function 
			will execute immediately, otherwise, they will be appended to the list of 
			handlers waiting to be called on load.
	*/
	function registerForOnloadOrCallNow(obj,arr)
	{
		if(g_bDocumentLoaded)
		{
			callHandlers(obj,arr);
		}
		else
		{
			g_arrHandlersToCallOnLoad.push([obj,arr]);
		}
	}

	/**
		Adds a function (func) to a named list of functions within an object (dest)
		If a list with that name does not exist, creates the list.
		The purpose of this mechanism of extension, is for functions such as constructors and
		event handlers, which are cumulative, rather than overriding.
		@param {Object} dest object that contains the named list
		@param {String} name of the list property within dest that func should be appended to.
		@param {Object} func function to add to the list
		
	*/		
	function addFunction(dest,name,func)
	{
		if(!dest[name])
		{
			dest[name] = [];
		}
		return dest[name].push(func);
	}

	
/**
	creates a CSS style declaration that causes the decoration of its referent with the objects in objs
	@param {Array} objs array of strings specifying the names of objects to be used in decorating an element.
	@returns String representation of the appropriate -moz-binding declaration.
*/		
	function generateMozBindingStyle(objs)
	{
		if(objs !== undefined) {
			return "-moz-binding: url(\""+g_sBehaviourDirectory+"decorator.xml?" + objs.join("&") + "#decorator\");";
		}
		else {
			return "";
		}
	}

/**
	Adds rules to the document's stylesheet cascade that cause the decoration of elements in IE. 
	Do not call directly, Call setupDecorator(defs)
	@param {Array} defs decorator definitions 
	@see (somewhere else)
*/	
	function ieSetupDecorator(defs)
	{
        		var bDocumentAlreadyLoaded = g_bDocumentLoaded;
		g_bDocumentLoaded = false;
		var oStyleSheet = document.createStyleSheet("",0);
		//non-htc method
		var sBehaviourRule = "\n behavior: expression(DECORATOR.decorate(this)); ";
		//htc method
		//var sBehaviourRule = ";\n behavior: url("+g_sBehaviourDirectory+"applicator.htc);";
		

		for(var i = 0;defs.length > i;++i)
		{
			var sRule = "";
			if(defs[i].objects !== undefined)
			{ 
				sRule += generateMozBindingStyle(defs[i].objects) + sBehaviourRule;
			}
			sRule += (defs[i].cssText || "");
			
			//strip out child selectors, (replacing with the inferior descendent selectors)
			//	These do not work in IE and even sometimes cause IE to close without warning
			defs[i].selector = defs[i].selector.replace(/>/g,'');
			var alternateSelectors = defs[i].selector.split(",");
			//IE doesn't like multiple selectors to be inserted at once.
			//	Split them on "," and do it one-at-a time
			for(var j = 0;j < alternateSelectors.length; ++j) {
				oStyleSheet.addRule(alternateSelectors[j],sRule);
			}
		}
		g_bDocumentLoaded = bDocumentAlreadyLoaded;
		if(bDocumentAlreadyLoaded)
		{
			callDocumentReadyHandlers();
		}

	}
	
/**
	Adds rules to the document's stylesheet cascade that cause the decoration of elements in Firefox.
	Do not call directly, Call setupDecorator(defs)
	@param {Array} defs decorator definitions 
	@see (somewhere else)
*/	
	function ffSetupDecorator(defs)
	{
	    try{
        var cssNode = document.createElement('link');
        cssNode.type = 'text/css';
        cssNode.rel = 'stylesheet';
        cssNode.href = g_sBehaviourDirectory +"generated-css.css";
        cssNode.media = 'screen';
        cssNode.title = 'dynamicLoadedSheet';
        document.getElementsByTagName("head")[0].appendChild(cssNode);
      }catch(e)
      {
        alert(e);  
      }
	}//ffSetupDecorator
	
	function ffXHTMLSetupDecorator(defs)
	{
		var oHead =document.getElementsByTagName("head")[0];

		var oStyle = document.createElement('style');
		oStyle.setAttribute("type","text/css");
		var s = "@namespace xf url(http://www.w3.org/2002/xforms);";
		s += "@namespace smil url(http://www.w3.org/2005/SMIL21/BasicAnimation);";
		s += "@namespace h url(http://www.w3.org/1999/xhtml);";

		for(var i = 0;defs.length > i;++i)
		{
			if(g_bIsInXHTMLMode) {
				defs[i].selector = defs[i].selector.replace(/\\:/g,"|");
			}
			var sRule = defs[i].selector + "{"+generateMozBindingStyle(defs[i].objects)+ (defs[i].cssText || "") +"}";
			s += sRule;			
			//oStyle.sheet.insertRule(sRule,oStyle.sheet.length);
		}
		oStyle.innerHTML = s;
		oHead.insertBefore(oStyle,null);

		
	}

	
/**
	Extends the functionality of the destination object with the members of source
	@param {Object} destination object to be extended
	@param {Object} source source of new members for destination.
	
*/		
	function extend(destination, source, bExecuteConstructorsImmediately) 
	{
		for (property in source) {
			switch(property)
			{	
				//In the case of these known named functions, add this member to the cumulative list
				//	of members with that name, rather than overriding.
				//	(this member should be a function, but, since we are using Javascript which is far superior
				//	to any typed language, this can only be constrained by hoping that authors read and obey
				//	this comment)
				case "ctor":
				case "onContentReady":
					var ix = addFunction(destination,property, source[property]);
					if(bExecuteConstructorsImmediately)
					{
						destination[property][ix]();
					}
				break;
				case "onDocumentReady":
					
					var ix = addFunction(destination,property, source[property]);
					if( g_bDocumentLoaded && bExecuteConstructorsImmediately)
					{
						destination[property][ix]();
					}

				break;
				default:
				//	Otherwise, create this member anew, or override any existing homonymous member.
					destination[property] = source[property];
			}
			

		}
		return destination;
	}

	

/**
	Adds rules to the document's stylesheet cascade that cause the decoration of elements in the appropriate browser.
	@param {Array} defs decorator definitions 
	@see (somewhere else)
*/	
	var innerSetupDecorator = null;
	function setupDecorator(defs)
	{
		var bDocumentAlreadyLoaded = g_bDocumentLoaded;
		g_bDocumentLoaded = false;
		NamespaceManager.readOutputNamespacesFromDocument();
		for(var i = 0 ; i < defs.length; ++i) {
			defs[i].selector = NamespaceManager.translateCSSSelector(defs[i].selector);	
		}
		
		innerSetupDecorator(defs);
		if(bDocumentAlreadyLoaded)
		{
			spawn(callDocumentReadyHandlers);
		}
		//g_bDocumentLoaded = bDocumentAlreadyLoaded;
	}
	
	if(document.all) {
		innerSetupDecorator = ieSetupDecorator;
	}
	else if(g_bIsInXHTMLMode) {
		innerSetupDecorator = ffXHTMLSetupDecorator;
	}
	else {
		innerSetupDecorator = ffSetupDecorator;
	}

	
	function getDecorationObjectNames(element)
	{
		var sBehaviours = getCustomCSSProperty(element,"-moz-binding");
		if(sBehaviours !== undefined && sBehaviours.indexOf('?') !== -1)
		{
			sBehaviours = sBehaviours.substring(sBehaviours.indexOf('?')+1,sBehaviours.lastIndexOf('#') );
		}
		else
		{
			sBehaviours = "";
		}
		return sBehaviours.split("&");
	}


	function attachDecoration(element,handleContentReady, handleDocumentReady)
	{
		//window.status = "decorating: " + element.nodeName; 
		var bReturn = false;
		var tIndex = element.getAttribute("tabindex");
		if(tIndex === 0){
			element.tabIndex = 1;
		}
		
		element.constructors = [];
		element.contentReadyHandlers = [];
		element.documentReadyHandlers = [];
		//add capability to 
		element.attachSingleBehaviour = attachSingleBehaviour;

		var arrBehaviours = getDecorationObjectNames(element);				
		if(arrBehaviours.length  > 0){
			for(var i = 0;i < arrBehaviours.length;++i){
				addObjectBehaviour(element,arrBehaviours[i],false);
			}
			callHandlers(element,element.ctor);

			//If the caller has requested that this function shoudl sort out 
			//	contentReady and documentReady, sort them out now.
			if(handleContentReady){
				callHandlers(element,element.onContentReady);
			}
			
			if(handleDocumentReady){
				registerForOnloadOrCallNow(element,element.onDocumentReady);
			}

			bReturn =  true;
		}
		return bReturn;
	}
	
	function attachSingleBehaviour(sBehaviour)
	{
		addObjectBehaviour(this,sBehaviour,false);
	}

	/**
		Creates an object of type sBehaviour and extends elmnt with it.
		@param {Object} elmnt element to decorate with the members of sBehaviour
		@param {String} sBehaviour name of the objecy to create in order ot decorate elmnt
	*/
	function addObjectBehaviour(elmnt,sBehaviour,bExecuteConstructorsImmediately)
	{
		try{
		//TODO: eval is evil, use a factory instead.
			eval("var o = new "+sBehaviour+"(elmnt);DECORATOR.extend(elmnt,o," +bExecuteConstructorsImmediately+ ");");
		}
		catch(e)
		{
			debugger;
		}

	}	
	
	
	/**
		Retrieves the computed style value of a given non-standard CSS property.
		non-standard CSS properties begin with "-".
		For retrieval, IE6 and earlier removes preceding "-", IE7 leaves it in.
		@param {Element} element The element whose custom property is desired.
		@param {String} propertyName The name of the property, with or without preceding "-"
		@returns The computed value of the property, if neither "property", nor "-property" exist, this function will return undefined.
	*/
	function getCustomCSSPropertyIE(element,propertyName)
	{
		//first try to get the property as originally requested.
		//Rather than checking the version of IE being used, here, it is preferable
		//	to operate on a features-available mechanism.
		var propertyValue = element.currentStyle[propertyName];
		if(propertyValue  === undefined)
		{
			//Since the property value as requested was not found, try the other way.
			if(propertyName.charAt(0) === '-')
			{
				//if the requested property name begins with '-', chop it off
				propertyName = propertyName.slice(1);
			}
			else
			{
				// if '-' was omitted, prepend it.
				propertyName = "-" + propertyName;
			}
			propertyValue =  element.currentStyle[propertyName];
		}
		return propertyValue;
	}
	
	
	function getCustomCSSPropertyFF(element,propertyName)
	{
		var currentStyle = window.getComputedStyle(element,"");
		return currentStyle.getPropertyValue(propertyName);
	}
	
	var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
	var getCustomCSSProperty = isIE?getCustomCSSPropertyIE:getCustomCSSPropertyFF;
	
	
	
	//Once the decorator has been set up, in IE, this function wil be called to decorate the elements.
	function decorate(e)
	{
		//Don't decorate a second time.
		if(e.decorated)
		{
			//During development, it may be handy to provide visual feedback
			//	 that excess decorations are occurring.
			//window.status += "|";
		}
		else 
		{
			// ignore binding request, if binding-ignore is true;
			var s = getCustomCSSProperty(e,"-binding-ignore");
			
			if(s === undefined || s == "false")
			{
				//Now that the elemnt is being decorated, switch off the behaviour expression
				//	to prevent it continually trying to get decorated.
				e.style.behavior = ("url()");
				e.decorated = true;
				//Do the decoration.
				DECORATOR.attachDecoration(e,true,true);					
				//window.status = "decorating: " + e.tagName;
			}
		}
		return;
	}
	

	
	var itself = function(){
	};
	itself.extend = extend;
	itself.setupDecorator = setupDecorator;
	itself.attachDecoration = attachDecoration;
	itself.decorate = decorate;
	itself.callDocumentReadyHandlers = callDocumentReadyHandlers;
	return itself;
}();

	

//for debugging
function SomeObject(elmnt)
{
	//this.banana = "This object has been decorated with SomeObject";
}
		
