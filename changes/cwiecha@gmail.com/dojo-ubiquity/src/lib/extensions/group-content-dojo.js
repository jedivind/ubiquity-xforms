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

function DojoGroupContent(elmnt)
{
	
  	this.element = elmnt;
  	this.currValue = "";
  	this.m_bFirstSetValue = true;
  	this.widgetInstance = null;
}

DojoGroupContent.prototype.onDocumentReady = function()
{
	if (this.element.ownerDocument.media != "print")
	{ 
		var oDiv = document.createElement("div");
        var widgetName = this.element.getAttribute("widget");
		dojo.require(widgetName);
		
		oDiv.setAttribute( "dojoType", widgetName );
		
		while ( this.element.childNodes.length > 0 ) {
		  // wrap each ELEMENT type child in a dojo content pane so it can be managed by the parent layout container
		  
		  var nextChild = this.element.childNodes[0];
		  if ( nextChild.nodeType == 1 /* ELEMENT node */ ) {
		  
    		  var oChildDiv = document.createElement("div");
              oChildDiv.setAttribute( "dojoType", "dijit.layout.ContentPane" ); 
              // oChildDiv.setAttribute( "style", "width:300px; height:100px" );
              
              oChildDiv.setAttribute( "selected", nextChild.getAttribute( "selected" ) );  // sync up on defaults
		
              // see if we have a nested xf:label element to preset our dojo title (right idea???)
		
              var oLabel = null;
              var found = false;
              for ( var i=0; i < nextChild.childNodes.length && !found; i++) {
                  var nextGrandChild = nextChild.childNodes[i];
            	  found = NamespaceManager.compareFullName(nextGrandChild,"label","http://www.w3.org/2002/xforms");
            	  if ( found )
            	      oLabel = nextGrandChild;
                  };
            	  if ( found ) {
            	      oChildDiv.setAttribute( "title", oLabel.textContent );
            	      oLabel.setAttribute( "style", "display:none" );
            	  }
		
		        oChildDiv.appendChild( nextChild );
		          oDiv.appendChild(oChildDiv);
		   }
		   else {
		      this.element.removeChild( nextChild );
		   }
		};
		
		this.element.appendChild(oDiv);

		UX.addStyle(oDiv, "backgroundColor", "transparent");
		UX.addStyle(oDiv, "padding", "0");
		UX.addStyle(oDiv, "margin", "0");
		UX.addStyle(oDiv, "border", "0");
	}
};


