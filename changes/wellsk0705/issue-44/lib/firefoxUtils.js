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
	For browsers such as Firefox, that do not support IE's rather handy bonus functions
 		insertAdjacentHTML, and insertAdjacentElement.
 */

/**
	XML Parsing in FIrefox does not support getELementById by default (except on XHTML and XUL elements_
	To work around this problem, the xpath evaluation is done to returnh the element with the specified id.
 */

    function _getElementById(sID) {
       /* try to get the element by the default getElementById */
       var oElement = document.nativeGetElementById(sID);
       /* if it doesn't work, try to find by different route */
       if (oElement === null) {
          var oRes = xpathDomEval( '//*[@id="'+sID+'"]' , document.documentElement);
          if (oRes && oRes.nodeSetValue()) {
            oElement = oRes.nodeSetValue()[0];
          }
  	   }
  	   return oElement;	   
    }

/* override the getElementById on the document object */
document.nativeGetElementById = document.getElementById;
document.getElementById = _getElementById;

/**
	Inserts an element into the DOM at a given location.  This is an addon applied to Elements
		in the target environment.  Nodes must be of compatible types in the target DOM, i.e.
		this will not be able to insert an XML Element into an HTML tree unless the underlying
		DOMs allow it.  To mix incompatible DOMs, serialise the inserted node, and use insertAdjacentHTML
	@param {String} where One of beforeBegin, afterBegin, beforeEnd, or afterEnd
	@param {Node} parsedNode a node to insert into this element
	@addon
*/
	function insertAdjacentElement(where,parsedNode)
	{
		switch (where)
		{
			case 'beforeBegin':
				this.parentNode.insertBefore(parsedNode,this);
				break;
			case 'afterBegin':
				this.insertBefore(parsedNode,this.firstChild);
				break;
			case 'beforeEnd':
				this.appendChild(parsedNode);
				break;
			case 'afterEnd':
				if (this.nextSibling) 
				{
					this.parentNode.insertBefore(parsedNode,this.nextSibling);
				}
				else
				{
					this.parentNode.appendChild(parsedNode);
				}
				break;
		}
	}

/**
	Inserts some markup into the DOM at a given location.  This is an addon applied to Elements
		in the target environment. 
	@param {String} where One of beforeBegin, afterBegin, beforeEnd, or afterEnd
	@param {String} htmlStr markup to insert into this element
	@addon
*/
	function insertAdjacentHTML(where,htmlStr)
	{
		var r = this.ownerDocument.createRange();
		r.setStartBefore(this);
		var parsedHTML = r.createContextualFragment(htmlStr);
		this.insertAdjacentElement(where,parsedHTML);
	}


/**
	Inserts some text into the DOM at a given location, ignoring markup.
		This is an addon applied to Elements in the target environment. 
		If parseable (or poorly-formed) markup is present in txtStr it will 
		be escaped and inserted into the target element as text.
	@param {String} where One of beforeBegin, afterBegin, beforeEnd, or afterEnd
	@param {String} txtStr text to insert into this element
	@addon
*/
	function insertAdjacentText(where,txtStr)
	{
		var parsedText = document.createTextNode(txtStr);
		this.insertAdjacentElement(where,parsedText);
	}


//Add the functions to the HTMLElement prototype, if absent
if(typeof HTMLElement!="undefined" && !HTMLElement.prototype.insertAdjacentElement)
{
	HTMLElement.prototype.insertAdjacentElement = insertAdjacentElement;
	HTMLElement.prototype.insertAdjacentText = insertAdjacentText;
	HTMLElement.prototype.insertAdjacentHTML =insertAdjacentHTML;
}

//Add the functions to the Element prototype, if absent
if(typeof Element!="undefined" && !Element.prototype.insertAdjacentElement)
{
	Element.prototype.insertAdjacentElement = insertAdjacentElement;
	Element.prototype.insertAdjacentText = insertAdjacentText;
	Element.prototype.insertAdjacentHTML =insertAdjacentHTML;
}

/**
	Utility to append to the class attribute. 
	With the XML Parser in Firefox, the className property is not supported, instead the class attribute is used.
	This utility centralizes the Yahoo addClass to one location to accumulate the classes,
	which is what happens in IE and Firefox (HTML), and for Firefox( XML) the class is added as
	an attribute to the element.
*/
	function addClassName(oElement, classString){
	   //HACK: is there a better place to initialize the className from the class attribute?
	   //Synchronize with any class attribute predefines
	    if (g_bIsInXHTMLMode && oElement.className === "") {
	      oElement.className = oElement.getAttribute("class");
	    }	   
		YAHOO.util.Dom.addClass(oElement, classString);
		if (g_bIsInXHTMLMode && oElement.setAttribute) {		   
		   oElement.setAttribute("class", oElement.className);
		}	    
	}

/**
	Utility to remove a class attribute. 
	With the XML Parser in Firefox, the className property is not supported, instead the class attribute is used.
	This utility centralizes the Yahoo removeClass to one location to removes a class,
	which is what happens in IE and Firefox (HTML), and for Firefox( XML) the class is removed from the class
	attribute of the element.
*/
    function removeClassName(oElement, classString) {
        YAHOO.util.Dom.removeClass(oElement, classString);
        if (g_bIsInXHTMLMode && oElement.setAttribute) {
		   oElement.setAttribute("class", oElement.className);
		}
	}
	
/**
	Utility to add a className property for Firefox (XML), this alone doesn't affect how classNames are interpreted.  
  */ 
if (typeof Element!="undefined" && !Element.prototype.className) {   
      Element.prototype.className = "";         
}

/**
	Utility to add a style to elements.   
	With the XML Parser in Firefox, the style property is not supported, instead styles are set with the stylesheet
	objects. This utility centralizes setting the style on an Element to one location.
*/
    function addStyle(oElement, styleName, value) {
       var stylesheet = null;
       if (oElement.style)	{
	      oElement.style[styleName] = value;
	   } else {
	      // At this point, you are not IE or Firefox with HTML parsing
	      // There is not a .style property for the XML Parser on Firefox
	      // Instead, the style will have to be added using the CSS DOM model
	      if (g_bIsInXHTMLMode) {
	         // get the computed style and see if it is already set to the value
	         if (document.defaultView.getComputedStyle(oElement, null)[styleName] !== value) {
  	  	  	    stylesheet = oElement.ownerDocument.styleSheets[0];
	  		    // make sure prefix has namespace declared in stylesheet
	  		    stylesheet.insertRule("@namespace " + oElement.prefix + " url(http://www.w3.org/2002/xforms);", 0);
 	    	    stylesheet.insertRule(oElement.prefix + "|" + oElement.localName + " {" + styleName + ":" + value + ";}", (stylesheet.cssRules.length === 0)? 1:stylesheet.cssRules.length);
 	         }
 	      }
	   }
    }	