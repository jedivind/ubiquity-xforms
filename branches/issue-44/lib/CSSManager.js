/*
 * Copyright (C) 2008 IBM
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
 	Manages the XML Parsing differences for  CSS selectors.  For example, '\:' which is appropriate on IE and Firefox (HTML)
 	should be translated to this symbol: '|'.  Another difference is the XML parser does not recognize the 
 	a CSS classname for an XML element by default. In CSSese, the .className syntax is shorthand for 
 	*[class="classname"].  And since these can be additive, it is better to use the space delination selector
 	"~" (i.e. *[class~="className"]).
    
    With the NamespaceManager and CSSManager, the style selectors in default.css (and in fact other user
    defined stylesheets can be dynamically altered for the browser of execution. Basically, the default.css
    file can be simplified by ONLY defining the "xf\:" prefix, and during runtime the style selector prefix/symbol
    will be changed.
 	
  */
 
var CSSManager  = function() {
    var m_outputNamespace = "http://www.w3.org/2002/xforms";
    var m_outputPrefixes = ["xf"];
    
    /** convenience method to change the namespace which is defaulted to xforms 
    */
    function setOutputNamespace(sNamespace) {
       m_outputNamespace = sNamespace;
    }

    /** convenience method to match prefixes declared in namespace and in xforms document 
    */
    function setOutputPrefixes(oStylesheet) {
       var cssRules;
       var stylePrefixes = new Array();;
       var allPrefixes;
       // get the prefixes from the document
       m_outputPrefixes = NamespaceManager.getOutputPrefixesFromURI(m_outputNamespace);
       //make sure they are also declared in default.css
       // look for types '0' -- namespace declarations
       cssRules = (document.styleSheets[0].rules) ? oStylesheet.rules : oStylesheet.cssRules;
       for (var k = 0; k < cssRules.length; k++) {
	      if (cssRules[k].type == 0) {
	        // is the prefix defined in a namespace rule?
	        // add to tmp array
	        if (cssRules[k].cssText.indexOf("url(http://www.w3.org/2002/xforms)") != -1) {
		      stylePrefixes.push(cssRules[k].cssText.split(" ", 2)[1]);
		    }
	      }
	   }
	   
	   allPrefixes = stylePrefixes.join(" ").toLowerCase()+" ";
	   for (var i = 0; i < m_outputPrefixes.length; i++) {	           
	       if (allPrefixes.indexOf(m_outputPrefixes[i] +" ") === -1 ) {
	          oStylesheet.insertRule("@namespace " + m_outputPrefixes[i] + " url(http://www.w3.org/2002/xforms);", 0);
	       }	         
	    }
    }
    


    /** Change the prefix and selectors of default.css, but can be used on user defined
        stylesheets.
        This could be extended for User defined stylesheets, but for now
        we will only modify the default for UX
     */       
	function setupCSSSelectors(sStyleSheet) { 
        // Collect the output namespace URIs and prefixes from the document
        NamespaceManager.readOutputNamespacesFromDocument();
        var stylesheets = document.styleSheets;
        var cssRules;
        
        // Get the stylesheet of interest, in this case using default.css 
        var stylesheetOfInterest = null;
        for (var i=0; i < stylesheets.length; i++) {
           if (stylesheets[i].href.indexOf("/"+sStyleSheet) > -1) {
             stylesheetOfInterest = stylesheets[i];
             break;
           }  
        }        
       
        // go thru the defaults.css selectors and update them for this document ....
        if (stylesheetOfInterest !== null) {
            setOutputPrefixes(stylesheetOfInterest);
        
            // built for both IE and Firefox CSS API, tho IE should not go this path                   
	        cssRules = (document.styleSheets[0].rules) ? stylesheetOfInterest.rules : stylesheetOfInterest.cssRules;
			for (var k = cssRules.length-1 ; k >=0; k--) {
			   if (cssRules[k].type === 1) {
			     // try IE way first
			     if (document.styleSheets[0].rules) {
	  		       stylesheetOfInterest.addRule( translateCSSSelector(cssRules[k].selectorText), cssRules[k].style.cssText, cssRules.length);
	  		       stylesheetOfInterest.removeRule(k);
	  		     } else { 
			        stylesheetOfInterest.insertRule(translateCSSSelector(cssRules[k].selectorText) + "  {" + cssRules[k].style.cssText + "}", cssRules.length);
			        stylesheetOfInterest.deleteRule(k);
			     }
			   }	
			}
		}
	}
	
	/*  look for and modify the selector prefix symbol and update the
	    class selector for XML class styles
	 */
	function translateCSSSelector (selector) {
	    var newSelector = selector;
        // Firefox adds '*|' at the beginning of each selector
        // Changing the Selector to remove this to prevent invalid character on insertRule
        var match = /\*\|/g;
        var matchSpace = /\s*\*\|/g;
		newSelector = newSelector.replace(match, "");
		newSelector = newSelector.replace(matchSpace, " ");	
	    //transform \:  to | 
	    newSelector = searchAndTranslateForPrefixes(newSelector);
	    // transforms .className to *[class="className"]
	    newSelector = searchAndTranslateForClasses(newSelector);

	    return newSelector;
	}
	
	
	// This translates the IE/Firefox HTML CSS Selectors to XML CSS Selector
	// from \: to |, assuming IE uses the default.css as is
	function searchAndTranslateForPrefixes (newSelector) {	
	    // Process each prefix	
	    // The following matches on xforms|submit:hover, so gotta fix that
        var matchNamespacePrefix = /(?:^|\s)(\w+):\w+/;
		var result = matchNamespacePrefix.exec(newSelector);
     	m_outputPrefixes = NamespaceManager.getOutputPrefixesFromURI(m_outputNamespace);
		var l;
		
		while(result)  {		
			l = result.length;
			if(l > 1) {
				newSelector = translateCSSSelectorForPrefix(newSelector, result[1]);				
			}
			result = matchNamespacePrefix.exec(newSelector);
		}
		return newSelector;
	}	
	
	/* Changes the selector for each prefix
	 */	
	function translateCSSSelectorForPrefix(selector, prefix) {
			var sMatchThisPrefix =  prefix + ":";
			var matchGivenPrefix =  new RegExp(sMatchThisPrefix,"g");
			var alternativesForThisURI = [];
			var css1NamespacePrefix;

           
			if(! m_outputPrefixes ||  m_outputPrefixes === 0) {
			  throw ("No output prefixes found for selection namespace prefix '" + prefix + "'");
			}
			else {
			// are the outputprefixes declared in the stylesheet?		
			
  			for(var i = 0;i < m_outputPrefixes.length;++i) {
  				css1NamespacePrefix = m_outputPrefixes[i] + "|";
  				alternativesForThisURI.push(selector.replace(matchGivenPrefix, css1NamespacePrefix)); 
  			}
		}
		return alternativesForThisURI.join(", ");
	}
	
	// This translates the IE/Firefox HTML CSS className Selectors to XML CSS className Selectors
	// from .className to *.[class~="className"] 
	function searchAndTranslateForClasses (newSelector) {	
	    // Process each class selector
        var matchNamespacePrefix = /(?:^|\s*|\w+)(\.\S+)/;
		var result = matchNamespacePrefix.exec(newSelector);
		var l;
		
		while(result)  {		
			l = result.length;
			if(l > 1) {
				newSelector = translateCSSSelectorForClass(newSelector, result[1]);				
			}
			result = matchNamespacePrefix.exec(newSelector);
		}
		return newSelector;
	}	
	
	function translateCSSSelectorForClass(selector, sClassName) {
		//lookup the URI based on the prefix
		var matchClassName = new RegExp(sClassName,"g");
		return selector.replace(matchClassName, '*[class~="' + sClassName.substr(1) + '"]');	 
    }
	
	var itself = function(){};
	itself.setOutputNamespace = setOutputNamespace;
	itself.translateCSSSelector = translateCSSSelector;
	itself.setupCSSSelectors = setupCSSSelectors;
	
	return itself;			
}();	
