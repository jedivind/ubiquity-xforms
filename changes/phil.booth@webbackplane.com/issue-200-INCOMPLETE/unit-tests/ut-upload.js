// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity XForms module adds XForms 1.1 support to the Ubiquity
// library.
//
// Copyright © 2009 Backplane Ltd.
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

var suiteUpload = new YAHOO.tool.TestSuite({
	name : "Test the XForms upload element"
});

suiteUpload.add(
	new YAHOO.tool.TestCase({
		name: "Test UploadValue",

		setUp: function() {
			this.upload = this.createElement("xf:upload", "http://www.w3.org/2002/xforms", document.body);
//			DECORATOR.extend(this.upload, new EventTarget(this.upload), true);
//			DECORATOR.extend(this.upload, new MIPHandler(this.upload), true);
//			DECORATOR.extend(this.upload, new Context(this.upload), true);
//			DECORATOR.extend(this.upload, new Control(this.upload), true);
//			this.upload.AddValuePseudoElement();
			this.peValue = new UploadValue(this.upload/*.m_value*/);
			this.peValue.onDocumentReady();
		},

		tearDown: function() {
			this.destroyElement(this.upload, "upload", document.body);
		},

		testConstruction: function () {
			YAHOO.util.Assert.isObject(this.peValue);
			YAHOO.util.Assert.isFunction(this.peValue.setValue);
			YAHOO.util.Assert.areSame(this.peValue.element, this.upload);
			YAHOO.util.Assert.isTrue(this.upload.contains(this.peValue.impl));
		},

		createElement: function(name, ns, parent) {
			var element;

			if (ns) {
				element = document.createElementNS(ns, name);
			} else {
				element = document.createElement(name);
			}

			if (parent) {
				parent.appendChild(element);
			}

			return element;
		},

		destroyElement: function(element, propertyName, parent) {
			if (parent) {
				parent.removeChild(element);
			}

			delete this[propertyName];
		}
	}));
