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

function DojoSelfWidget(elmnt)
{
	
  	this.element = elmnt;
  	this.currValue = "";
  	this.m_bFirstSetValue = true;
  	this.widgetCreated = false;
}

DojoSelfWidget.prototype.onDocumentReady = function()
{
	if (this.element.ownerDocument.media != "print" && !this.widgetCreated)
	{ 
	    this.widgetCreated = true;
		var oDiv = document.createElement("div");
		
		oDiv.setAttribute( "dojoType", "dijit.layout.ContentPane" );
		
		// see if we have a nested xf:label element to preset our dojo title (right idea???)
		
		var oLabel = null;
		var found = false;
		for ( var i=0; i < this.element.childNodes.length && !found; i++) {
		  var nextChild = this.element.childNodes[i];
		  found = NamespaceManager.compareFullName(nextChild,"label","http://www.w3.org/2002/xforms");
		  if ( found )
		      oLabel = nextChild;
		};
		if ( found )
		  oDiv.setAttribute( "title", oLabel.textContent );  // safe???
		
        this.element.parentNode.insertBefore( oDiv, this.element );
		oDiv.appendChild( this.element );

		UX.addStyle(oDiv, "backgroundColor", "transparent");
		UX.addStyle(oDiv, "padding", "0");
		UX.addStyle(oDiv, "margin", "0");
		UX.addStyle(oDiv, "border", "0");
	}
};


