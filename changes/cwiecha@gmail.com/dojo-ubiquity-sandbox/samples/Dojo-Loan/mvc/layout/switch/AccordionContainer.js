dojo.provide("mvc.layout.switch.AccordionContainer");
dojo.require("dijit.layout.AccordionContainer");

dojo.declare(
	"mvc.layout.switch.AccordionContainer",
	dijit.layout.AccordionContainer,
	{
		// summary:
		//		An AccordionContainer that understands xf:switch/xf:case blocks and coordinates
		//      toggling cases when the user clicks on accordion buttons.
		//      Also listens to select events on child xf:case elements and initiates accordion selection
		//      when xf:toggle actions are issued elsewhere on the page...

		knownCases : {},
		knownDijits : {},
		
		caseSelect : function( e ) {
		  var targetPage = this.knownDijits[ e.currentTarget.id ];
		  this.selectChild( targetPage, true );
		},
		
		caseDeSelect : function( e ) {
		},
		
		startup : function () {
		  this.inherited( arguments );
		  
		  // set up select/deselect listeners on child cases so we can track toggle actions...
		  
		  for ( var i = 0; i < this.domNode.childNodes.length; i++ ) {
		      var nextChild = this.domNode.childNodes[i];
		          
		      var caseElement = UX.getFirstNodeByName(nextChild, "case", "http://www.w3.org/2002/xforms");
   		      if ( caseElement != null ) {
   		          this.knownCases[ nextChild.id ] = caseElement;
   		          this.knownDijits[ caseElement.id ] = dijit.byId( nextChild.id );
   		          var pThis = this;
                  if ( caseElement.getAttribute( "selected" ) == "true" )
	       	          this.selectChild( dijit.byId( nextChild.id ) );
	       	          
		          dojo.connect( caseElement, "xforms-select", function(e) { 
		              pThis.caseSelect(e); 
		              } );
		          dojo.connect( caseElement, "xforms-deselect", function(e) { 
		              pThis.caseDeSelect(e); 
		              });
		      }
		  }
		},
		
		selectChild : function (/*dijit._Widget|String*/ page, skip) {
            this.inherited( arguments );  // do the dijit selection stuff first...
            if ( skip ) return;
            else {
                // then tell the switch/case to toggle...
            
                page = dijit.byId(page);
            
                // find the nested xf:case element if we don't have it already
            
                var caseElement = this.knownCases[page.id];
                if ( caseElement == null ) return;
                    else caseElement.toggle();
		     }
		  }
	 }

);

