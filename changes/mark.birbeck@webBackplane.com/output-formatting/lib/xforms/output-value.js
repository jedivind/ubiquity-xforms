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

function XFormsOutputValue(elmnt) {
    this.element = elmnt;
    if (this.element.parentNode.m_sValue) {
        this.setValue(this.element.parentNode.m_sValue);
    }
}

if (document.all) {
    XFormsOutputValue.prototype.getValue = function() {
        return this.element.innerText;
    };
} else {    
    XFormsOutputValue.prototype.getValue = function() {
        return this.element.textContent;
    };
}

XFormsOutputValue.prototype.setValue = function(sValue) {
    var format = this.element.parentNode.getAttribute("format");
    var prefix, value, suffix;

    if (format) {
    	format.match( /^([^\#]*)?(\#*)?(\.(\#*))?([^\#]*)?/ );

    	prefix = RegExp.$1 || "";
    	decimalPlaces = (RegExp.$3)
    		? (RegExp.$4 ? RegExp.$4.length : 0)
    		: undefined;
    	suffix = RegExp.$5 || "";

   		value =
   		  prefix +
   		  (
   				( decimalPlaces === undefined || isNaN(parseFloat(sValue)) )
   				  ? sValue
   				  : parseFloat( sValue ).toFixed( decimalPlaces )
   			) +
   			suffix;
    } else {
    	value = sValue;
    }

		if (document.all) {
      this.element.innerText = sValue;
    } else {
			this.element.textContent = value;
		}
    return;
};
