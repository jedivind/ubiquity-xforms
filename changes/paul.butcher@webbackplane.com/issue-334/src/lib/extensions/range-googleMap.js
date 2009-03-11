// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity XForms module adds XForms support to the Ubiquity library.
//
// Copyright (C) 2008 Backplane Ltd.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

function RangeValueGMAP(elmnt) {
	// Store a pointer to the given element, this corresponds to  the "value pseudoelement" within the control. 
	this.element = elmnt;
    var div = document.createElement("div");
    UX.addStyle(div, "height", "100px");
    UX.addStyle(div, "width", "200px");
	this.element.appendChild(div);
}

RangeValueGMAP.prototype.valueChanged = function(sNewValue)
{
	var oEvt = this.element.ownerDocument.createEvent("MutationEvents");
	if(oEvt.initMutationEvent === undefined) {
		oEvt.initMutationEvent = oEvt.initEvent;
	}
		
	oEvt.initMutationEvent("control-value-changed", true, true,
		null, this.currValue, sNewValue, null, null);
    var that = this;
	spawn(function() {
			FormsProcessor.dispatchEvent(that.element, oEvt);
	});
};

RangeValueGMAP.prototype.onDocumentReady = function() {

	
	//Set up the map.
	this.map = new GMap2(this.firstChild);
	
	// Set up a listener for the event within the map that corresponds to a "confirmed change of value"
	var pThis = this;
	GEvent.addListener(
		this.map,
		"moveend",
		function() {
			var center = this.getCenter();
	        var s = center.lat() + ";" + center.lng();
	        
	        if(s !== pThis.currValue) {
	            pThis.valueChanged(center.lat() + ";" + center.lng());
	        }
		}
	);
	
	var theListener = {
    	control: this,
    	handleEvent: function(evt) {
        	if (evt.type === "fp-putvalue") {
                var newVal = evt.newValue;
                
                if (this.currentValue != newVal) {
                      this.setValue(newVal, this.currentValue ? true : false);
                      this.currentValue = newVal;
                }
            }
    	}
	};
	this.parentNode.addEventListener("fp-putvalue", theListener, false);
};

RangeValueGMAP.prototype.setValue = function(newVal) {

  	      newVal.match( /([\-+]?\d*\.?\d+)[\,\s\;]*([\-+]?\d*\.?\d+)/ );
          var pan = this.currentValue ? true : false;        
          var nLat = RegExp.$1;
  	      var nLong = RegExp.$2;
  	      var sWidth;
  	      var sHeight;

  	      var currentStyle = this.parentNode.currentStyle;
  	      if(currentStyle) {
       	      sWidth = currentStyle.width;
  	          sHeight = currentStyle.height;
  	      }
          else {
              currentStyle = window.getComputedStyle(this.element,"");
    	      sWidth  = currentStyle.getPropertyValue("width");
    	      sHeight = currentStyle.getPropertyValue("height");
    	  }
    	  
    	  var nWidth = parseInt(sWidth,10);
    	  var nHeight = parseInt(sHeight,10);
          var ll = new GLatLng(Number(nLat), Number(nLong));

          this.currValue = newVal;
          this.map.setCenter(ll, 7);

};

