/*
 * Copyright © 2009 Backplane Ltd.
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

function XFormsOutputValueGMap(element) {
	this.element = element;

	this.mapContainer = document.createElement("div");
	this.element.appendChild(this.mapContainer);

	this.setMapDimensionUnlessParentIsSet('width', '250px');
	this.setMapDimensionUnlessParentIsSet('height', '150px');
}

XFormsOutputValueGMap.prototype.onDocumentReady = function() {
	var listener = {
		control: this,
		handleEvent: function(evt) {
			if (evt.type === "fp-putvalue" && this.currentValue != evt.newValue) {
				alert("fp-putvalue");
				this.setValue(evt.newValue);
			}
		}
	};
	this.element.parentNode.addEventListener("fp-putvalue", listener, false);

	this.map = new GMap2(this.mapContainer);
};

XFormsOutputValueGMap.prototype.setValue = function(value) {
	var lat, long;

	value.match(/([\-+]?\d*\.?\d+)[\,\s\;]*([\-+]?\d*\.?\d+)/);
	lat = Number(RegExp.$1);
	long = Number(RegExp.$2);

	if (this.currentValue) {
		this.map.panTo(new GLatLng(lat, long));
	} else {
		this.map.setCenter(new GLatLng(lat, long), 6);
		this.map.disableDragging();
	}

	this.currentValue = value;
};

XFormsOutputValueGMap.prototype.setMapDimensionUnlessParentIsSet = function(dimension, value) {
	if (this.element.parentNode.style[dimension] === '') {
		UX.addStyle(this.mapContainer, dimension, value);
	} else {
		UX.addStyle(this.mapContainer, dimension, '100%');
	}
};
