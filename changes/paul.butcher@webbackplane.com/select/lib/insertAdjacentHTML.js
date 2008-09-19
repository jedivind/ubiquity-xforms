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
(
  function(){
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
  /**
    Checks whether o is a descendent of the current element
    @param {Node} o The candidate descendent node to investigate
    @returns true if o is within "this", otherwise false.
  */
    function contains(o) {
      
      var parent = o;
      var retval = false;
      while(parent) {
        if(parent === this) {
          retval = true;
          break;
        }
        else {
          parent = parent.parentNode;
        }
      }
      return retval;
    }
    
    //Add the functions to the HTMLElement prototype, if absent
    if(typeof HTMLElement!="undefined") {
      HTMLElement.prototype.insertAdjacentElement = HTMLElement.prototype.insertAdjacentElement || insertAdjacentElement;
      HTMLElement.prototype.insertAdjacentText = HTMLElement.prototype.insertAdjacentText || insertAdjacentText;
      HTMLElement.prototype.insertAdjacentHTML = HTMLElement.prototype.insertAdjacentHTML || insertAdjacentHTML;
      HTMLElement.prototype.contains = HTMLElement.prototype.contains || contains;
    }
    
    
    //Add the functions to the Element prototype, if absent
    if(typeof Element!="undefined" && !Element.prototype.insertAdjacentElement)
    {
      Element.prototype.insertAdjacentElement = Element.prototype.insertAdjacentElement || insertAdjacentElement;
      Element.prototype.insertAdjacentText = Element.prototype.insertAdjacentText || insertAdjacentText;
      Element.prototype.insertAdjacentHTML = Element.prototype.insertAdjacentHTML || insertAdjacentHTML;
      Element.prototype.contains = Element.prototype.contains || contains;
    }
  }
)();
