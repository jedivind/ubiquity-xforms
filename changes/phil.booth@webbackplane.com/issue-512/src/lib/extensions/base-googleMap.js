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

function GMapControl(element) {
	this.element = element;
	this.element.parentNode.setMapInfo = function(infoElement) {
		element.setMapInfo(infoElement);
	};
}

GMapControl.prototype.createMap = function() {
	this.mapContainer = document.createElement('div');
	this.element.appendChild(this.mapContainer);

	this.setMapDimensionUnlessParentIsSet('width', '300px');
	this.setMapDimensionUnlessParentIsSet('height', '200px');

	this.map = new GMap2(this.mapContainer);
	this.map.setCenter(new GLatLng(51.523811, -0.107878), this.estimateInitialZoom());

	this.addMapControls();
};

GMapControl.prototype.setValue = function(value) {
	value.match(/([\-+]?\d*\.?\d+)[\,\s\;]*([\-+]?\d*\.?\d+)/);

	this.latitude = Number(RegExp.$1);
	this.longitude = Number(RegExp.$2);

	if (this.mapMarker) {
		this.moveMapMarker();
	} else {
		this.addMapMarker();
	}
};

GMapControl.prototype.setMapInfo = function(infoElement) {
	this.mapInfo = infoElement;
};

GMapControl.prototype.setMapDimensionUnlessParentIsSet = function(dimension, value) {
	if (this.element.parentNode.style[dimension] === '') {
		UX.addStyle(this.mapContainer, dimension, value);
	} else {
		UX.addStyle(this.mapContainer, dimension, this.element.parentNode.style[dimension]);
	}
};

GMapControl.prototype.estimateInitialZoom = function() {
	if (this.mapContainer.clientWidth < 120 || this.mapContainer.clientHeight < 120) {
		return 8;
	}

	if (this.mapContainer.clientWidth < 160 || this.mapContainer.clientHeight < 160) {
		return 13;
	}

	if (this.mapContainer.clientWidth < 200 || this.mapContainer.clientHeight < 200) {
		return 14;
	}

	return 16;
};

GMapControl.prototype.addMapControls = function() {
	this.addCommonMapControls();

	if (typeof this.addMapNavigationControl === 'function') {
		this.addMapNavigationControl();
	}
};

GMapControl.prototype.addCommonMapControls = function() {
	this.addMapTypeControl();
	this.addMapScaleControl();
	this.addMapOverviewControl();
};

GMapControl.prototype.addMapTypeControl = function() {
	if (this.mapContainer.clientWidth >= 260 && this.mapContainer.clientHeight >= 100) {
		this.map.addControl(new GMapTypeControl());
	} else if (this.mapContainer.clientWidth >= 190 && this.mapContainer.clientHeight >= 120) {
		this.map.addControl(new GHierarchicalMapTypeControl());
	} else if (this.mapContainer.clientWidth >= 140 && this.mapContainer.clientHeight >= 140) {
		this.map.addControl(new GMenuMapTypeControl());
	}
};

GMapControl.prototype.addMapScaleControl = function() {
	if (this.mapContainer.clientWidth >= 500 && this.mapContainer.clientHeight >= 200) {
		this.map.addControl(new GScaleControl());
	}
};

GMapControl.prototype.addMapOverviewControl = function() {
	if (this.mapContainer.clientWidth >= 620 && this.mapContainer.clientHeight >= 200) {
		this.map.addControl(new GOverviewMapControl());
	}
};

GMapControl.prototype.addMapMarker = function() {
	var self = this;
	if (this.latitude && this.longitude) {
		this.mapMarker = new GMarker(new GLatLng(parseFloat(this.latitude), parseFloat(this.longitude)), { clickable: true, draggable: false });
		GEvent.addListener(this.mapMarker, 'click', function () { self.onClickMapMarker(); });
		GEvent.addListener(this.mapMarker, 'infowindowclose', function () { self.onMapInfoDismissed(); });
		this.map.addOverlay(this.mapMarker);
	}
};

GMapControl.prototype.moveMapMarker = function() {
	this.mapMarker.setLatLng(new GLatLng(this.latitude, this.longitude));
	this.map.panTo(new GLatLng(this.latitude, this.longitude));
};

GMapControl.prototype.onClickMapMarker = function() {
	if (this.mapInfo) {
		if (this.mapInfoIsVisible) {
			this.mapMarker.closeInfoWindow();
		} else {
			this.mapInfoIsVisible = true;
			FormsProcessor.refreshDescendents(this.mapInfo.childNodes);
			this.mapMarker.openInfoWindowHtml(this.mapInfo.getValue(), { maxWidth: this.mapContainer.clientWidth >= 200 ? this.mapContainer.clientWidth - 80 : 120 });
		}
	}
};

GMapControl.prototype.onMapInfoDismissed = function() {
	this.mapInfoIsVisible = false;
	this.map.panTo(new GLatLng(this.latitude, this.longitude));
};
