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
if(!g_sBehaviourDirectory)
{
	g_sBehaviourDirectory = "behaviours/";
}

	var g_bIsInXHTMLMode = false;

	//globals used in non-IE browsers.
	var g_arrHandlersToCallOnLoad = new Array();

	//Set up CallDocumentReadyHandlers for non-IE browsers
	if(!document.all)
		window.addEventListener("load",CallDocumentReadyHandlers,false);

	/**
		Called by implementations that do not natively support a documentReady event.
			on document load, this function calls any documentready handlers that have 
			been registered so far, then sets the g_bDocumentLoaded flag to true, so that 
			any documentready handlers that attempt to register later can execute immediately.	
		Now that all the scripts are loaded after the rest of the document, this is also required
		by IE, to call the handlers at the end of processing.
	*/
	function CallDocumentReadyHandlers()
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

	function RegisterForOnloadOrCallNow(obj,arr)
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
/**
	Adds a function (func) to a named list of functions within an object (dest)
	If a list with that name does not exist, creates the list.
	The purpose of this mechanism of extension, is for functions such as constructors and
	event handlers, which are cumulative, rather than overriding.
	@param {Object} dest object that contains the named list
	@param {String} name of the list property within dest that func should be appended to.
	@param {Object} func function to add to the list
	
*/		
	function AddFunction(dest,name,func)
	{
		if(!dest[name])
		{
			dest[name] = new Array();
		}
		dest[name].push(func);
	}
/**
	Extends the functionality of the destination object with the members of source
	@param {Object} destination object to be extended
	@param {Object} source source of new members for destination.
	
*/		
	function extend(destination, source) 
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
				case "onDocumentReady":
					AddFunction(destination,property, source[property]);
				break;
				default:
				//	Otherwise, create this member anew, or override any existing homonymous member.
					destination[property] = source[property];
			}

		}
		return destination;
	}
	
/**
	Creates an object of type sBehaviour and extends elmnt with it.
	@param {Object} elmnt element to decorate with the members of sBehaviour
	@param {String} sBehaviour name of the objecy to create in order ot decorate elmnt
*/
	function AddObjectBehaviour(elmnt,sBehaviour)
	{
		try{
			eval("var o = new "+sBehaviour+"(elmnt);extend(elmnt,o);");
		}catch(e){debugger;}

	}
	
/**
	creates a CSS style declaration that causes the decoration of its referent with the objects in objs
	@param {Array} objs array of strings specifying the names of objects to be used in decorating an element.
	@returns String representation of the appropriate -moz-binding declaration.
*/		
	function generateMozBindingStyle(objs)
	{
		return "-moz-binding: url(\""+g_sBehaviourDirectory+"decorator.xml?" + objs.join("&") + "#decorator\");";
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
		for(var i = 0;defs.length > i;++i)
		{
		
			var sRule = generateMozBindingStyle(defs[i].objects) +  " behavior: url("+g_sBehaviourDirectory+"applicator.htc);"
			//strip out child selectors, (replacing with the inferior descendent selectors)
			//	These do not work in IE and even sometimes cause IE to close without warning
			defs[i].selector = defs[i].selector.replace(/>/g,'');
			oStyleSheet.addRule(defs[i].selector,sRule);
		}
		
		g_bDocumentLoaded = bDocumentAlreadyLoaded;
		if(bDocumentAlreadyLoaded)
		{
			CallDocumentReadyHandlers();
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
	    /* old version
	     *

		for(var i = 0;defs.length > i;++i)
		{
			if(g_bIsInXHTMLMode)
				defs[i].selector = defs[i].selector.replace(/\\:/g,"|");
			var sRule = defs[i].selector + "{"+generateMozBindingStyle(defs[i].objects)+"}";
			sCurrRule = sRule;
			document.styleSheets[0].insertRule(sRule,document.styleSheets[0].length);
		}

         */

        /* new version */
 
        var oHead = document.getElementsByTagName("head")[0];
        var oStyle = document.createElement('style');
        var s = "";

        oStyle.setAttribute("type", "text/css");

        if (g_bIsInXHTMLMode)
        {
            s += "@namespace xf url(http://www.w3.org/2002/xforms);";
            s += "@namespace smil url(http://www.w3.org/2005/SMIL21/BasicAnimation);";
            s += "@namespace h url(http://www.w3.org/1999/xhtml);";
        }

        for (var i = 0; defs.length > i; ++i)
        {
            if (g_bIsInXHTMLMode)
                defs[i].selector = defs[i].selector.replace(/\\:/g,"|");

            sRule = defs[i].selector + "{" + generateMozBindingStyle(defs[i].objects) + "}";
            //oStyle.sheet.insertRule(sRule, oStyle.sheet.length);
            s += sRule;
        }
        oStyle.innerHTML = s;
        oHead.insertBefore(oStyle, null);
		

        return;
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
			if(g_bIsInXHTMLMode)
				defs[i].selector = defs[i].selector.replace(/\\:/g,"|");
			var sRule = defs[i].selector + "{"+generateMozBindingStyle(defs[i].objects)+"}";
			s += sRule;			
//			oStyle.sheet.insertRule(sRule,oStyle.sheet.length);
		}
		oStyle.innerHTML = s;
		oHead.insertBefore(oStyle,null);

		
	}


/**
	Adds rules to the document's stylesheet cascade that cause the decoration of elements in the appropriate browser.
	@param {Array} defs decorator definitions 
	@see (somewhere else)
*/	
	var InnerSetupDecorator = null;
	function setupDecorator(defs)
	{
		var bDocumentAlreadyLoaded = g_bDocumentLoaded;
		g_bDocumentLoaded = false;
		InnerSetupDecorator(defs);
		if(bDocumentAlreadyLoaded)
		{
			spawn(CallDocumentReadyHandlers);
		}
		//g_bDocumentLoaded = bDocumentAlreadyLoaded;
	}
	if(document.all)
		InnerSetupDecorator = ieSetupDecorator;
	else if(g_bIsInXHTMLMode)
		InnerSetupDecorator = ffXHTMLSetupDecorator;
	else
		InnerSetupDecorator = ffSetupDecorator;


//for debugging
function SomeObject(elmnt)
{
	//this.banana = "This object has been decorated with SomeObject";
}
		