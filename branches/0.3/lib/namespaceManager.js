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
 	Manages the potential disparity between namespaces referred to in a library, and their occurrence in a real
 	world application.
 	see: http://ubiquity-xforms.googlecode.com/svn/branches/0.3/_testsuite/units/NamespaceManager.html
 */
 
var NamespaceManager  = function(){
	var m_selectionNamespaces = {};
	var m_outputNamespaces = {};
	
	/**
		returns the lists of namespaces to an uninitialised state.
	*/
	function clean()
	{
		m_selectionNamespaces = {};
		m_outputNamespaces = {};
	}
	
	/**
		Binds a namespace prefix to a URI for selection purposes.
		@param {String} prefix The prefix used to select the given URI
		@param {String} uri  The URI to which the prefix is to be bound
		@returns true, if the prefix is successfully bound to the URI, or false, if it is already bound to the same URI. 
		@throws String if the prefix is already bound to a different URI
  	*/
	function addSelectionNamespace (prefix, uri) {
		var retVal;
		if(m_selectionNamespaces[prefix]) {
			retVal = false;
			if(m_selectionNamespaces[prefix] !== uri) {
				throw "selection namespace prefix '"+prefix +"' being added to URI '"+uri+"' is already bound to URI '"+ m_selectionNamespaces[prefix] + "'";
			}
		}
		else {
			m_selectionNamespaces[prefix] = uri;
			retVal = true;
		}
		return retVal;
	}

	/**
		Binds a namespace URI to a prefix  for output purposes.
		@param {String} prefix The prefix to be output for the given URI
		@param {String} uri  The URI for prefix
  	*/
	function addOutputNamespace(prefix,uri)
	{
		if(m_outputNamespaces[uri] === undefined) {
			m_outputNamespaces[uri] = [];
		}
		m_outputNamespaces[uri].push(prefix);
		return true;
	}

	/**
		populates the list of output namespaces if the document has a namespaces property
	*/
	function readOutputNamespacesFromNamespaceAwareDocument () {
		var nsList = document.namespaces;
		for(var i = 0; i < nsList.length; ++i) {
			this.addOutputNamespace(nsList[i].name, nsList[i].urn); 		
		}
	}
	
	/**
		populates the list of output namespaces by treating  xml namespace declarations on the documentElement
		as attributes
	*/
	function readOutputNamespacesFromDocumentElementAtrributeList () {
		var attrMap =document.documentElement.attributes;
		var l = attrMap.length;
		for(var i = 0;i < l;++i) {
			var thisAttr = attrMap.item(i);
			//see if this is an xml namespace declaration.
			if(thisAttr.name.indexOf('xmlns:') ===0) {
				var prefix = thisAttr.name.slice(6);
				this.addOutputNamespace(prefix,thisAttr.value);
			}
		}
	}

	/**
		Retrieves the list of output prefixes that represent the given namespace.
		@param {String} uri  The URI to look up.
		@returns {Array} An array of prefixes that represent the given URI in the current output context.
  	*/
	function getOutputPrefixesFromURI(uri)
	{
		return m_outputNamespaces[uri];
	}
	
	/**
		Removes all instances of namespace-aware CSS selectors for the given prefix from a selector,
			replacing them with appropriate CSS1 selectors, based on the current output context.
		@param {String} selector, the selector to translate
		@param {String} The prefix to eradicate
		@returns {String} selector, with prefix eradicated.
	*/
	function translateCSSSelectorForPrefix(selector,prefix) {
		//lookup the URI based on the prefix 
		var selectionURI = m_selectionNamespaces[prefix];
		if(selectionURI === undefined) {
			throw "Unknown Prefix: '" + prefix + "' in CSS selector '" + selector+ "'";
		}
		else {
			var sMatchThisPrefix =  prefix + "\\|";
			var matchGivenPrefix =  new RegExp(sMatchThisPrefix,"g");
			var outputprefixes = m_outputNamespaces[selectionURI];
			var alternativesForThisURI = [];
			for(var i = 0;i < outputprefixes.length;++i) {
				var css1NamespacePrefix = outputprefixes[i] + "\\:";
				alternativesForThisURI.push(selector.replace(matchGivenPrefix, css1NamespacePrefix)); 
			}
		}
		return alternativesForThisURI.join(", ");
	}
	
	/**
		Translates a given namespace-aware CSS selector, into an "escaped colon" style selector.
		@param {String} a namespace-aware CSS selector - e.g. x|banana
		@returns String the selector parameter, translated into an "escaped colon" style selector
	*/
	function translateCSSSelector (selector) {
		//match ( token + |  ) anotherToken.
		var newSelector = selector;
		var matchNamespacePrefix = /(\w+)\|\w+/;
		var result = matchNamespacePrefix.exec(newSelector);
		
		while(result)  {
			var l = result.length;
			if(l > 1) {
				newSelector = translateCSSSelectorForPrefix(newSelector, result[1]);
			}
			result = matchNamespacePrefix.exec(newSelector);
		}
		return newSelector;
	}
	
	var itself = function () {};
	itself.translateCSSSelector = translateCSSSelector;
	itself.getOutputPrefixesFromURI = getOutputPrefixesFromURI;
	itself.addSelectionNamespace = addSelectionNamespace;
	itself.addOutputNamespace = addOutputNamespace;
	itself.clean = clean;
	if(document.namespaces) {
		itself.readOutputNamespacesFromDocument = readOutputNamespacesFromNamespaceAwareDocument;
	}
	else {
		itself.readOutputNamespacesFromDocument = readOutputNamespacesFromDocumentElementAtrributeList;
	}
	return itself;
}();
