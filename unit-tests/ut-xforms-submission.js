// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity XForms module adds XForms 1.1 support to the Ubiquity
// library.
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


var suiteXFormsSubmission = new YAHOO.tool.TestSuite({
	name : "Test xforms-submission module"
});

suiteXFormsSubmission.add(
	new YAHOO.tool.TestCase(
		{
			name: "Test xf:submission @method",
			
			setUp: function() {

				this.model = document.createElement("xf:model");
				
				this.instance = document.createElement("xf:instance");
				this.model.appendChild(this.instance);
				
				this.submission = document.createElement("xf:submission");
				this.submission.setAttribute("replace", "none");
				this.submission.setAttribute("resource", ".");
				this.model.appendChild(this.submission);

				DECORATOR.extend(this.model, new EventTarget(this.model), false);
				DECORATOR.extend(this.model, new Model(this.model), false);
				DECORATOR.extend(this.instance, new EventTarget(this.instance), false);
				DECORATOR.extend(this.instance, new Instance(this.instance), false);
				DECORATOR.extend(this.submission, new EventTarget(this.submission), false);
				DECORATOR.extend(this.submission, new Context(this.submission), false);
				DECORATOR.extend(this.submission, new Submission(this.submission), false);

				this.instance.replaceDocument(xmlParse("<car><make>Ford</make><color>blue</color></car>"));
				this.model.addInstance(this.instance);

			},
			
			tearDown: function() {
				delete this.submission;
				delete this.instance;
				delete this.model;
			},
			
			testPostMethod: function() {
				var Assert = YAHOO.util.Assert;
				
				this.submission.setAttribute("method", "post");
				document.submission.submit(this.submission);
				Assert.areEqual("POST", document.submission.method);
			}
		}));


suiteXFormsSubmission.add(
	new YAHOO.tool.TestCase(
		{
			name: "Test Submission application/x-www-url-encoded",
			
			setUp: function() {
				this.model = document.createElement("xf:model");
				this.instance = document.createElement("xf:instance");
				this.model.appendChild(this.instance);

				DECORATOR.extend(this.model, new EventTarget(this.model), false);
				DECORATOR.extend(this.model, new Model(this.model), false);
				DECORATOR.extend(this.instance, new EventTarget(this.instance), false);
				DECORATOR.extend(this.instance, new Instance(this.instance), false);

				this.instance.replaceDocument(xmlParse("<car><make>Ford</make><color>blue</color></car>"));
				this.model.addInstance(this.instance);
			},
			
			tearDown: function() {
				delete this.model;
				delete this.instance;
			},
			
			testSerializeWhenRefIsLeafNode: function() {
				
				var Assert = YAHOO.util.Assert;
				var node = getFirstNode(this.model.EvaluateXPath("/car/color"));
				var string = document.submission.buildGetUrl("", document.submission.serializeURLEncoded(node));
				
				Assert.areEqual("?color=blue", string);
			},
			
			testSerializeWhenRefIsNotLeafNode: function() {
				
				var Assert = YAHOO.util.Assert;
				var node = getFirstNode(this.model.EvaluateXPath("/car"));
				var string = document.submission.buildGetUrl("", document.submission.serializeURLEncoded(node));
				
				Assert.areEqual("?make=Ford&color=blue", string);
			},
			
			testSerializeWithTrailingURLParams: function() {
				
				var Assert = YAHOO.util.Assert;
				var node = getFirstNode(this.model.EvaluateXPath("/car"));
				var string = document.submission.buildGetUrl("http://www.example.org/servlet?", document.submission.serializeURLEncoded(node));

				// Test case of having query divider but zero query params
				Assert.areEqual("http://www.example.org/servlet?make=Ford&color=blue", string);

				// Combine 2 params from URL with 2 from data
				string = document.submission.buildGetUrl("http://www.example.org/servlet?p1=x&p2=y", document.submission.serializeURLEncoded(node));
				Assert.areEqual("http://www.example.org/servlet?p1=x&p2=y&make=Ford&color=blue", string);

				// Combine 2 params from URL with 2 from data, in presence of fragment identifier
				string = document.submission.buildGetUrl("http://www.example.org/servlet?p1=x&p2=y#z", document.submission.serializeURLEncoded(node));
				Assert.areEqual("http://www.example.org/servlet?p1=x&p2=y&make=Ford&color=blue#z", string);

				// Combine params from URL having semicolon separator when required separator is ampersand
				string = document.submission.buildGetUrl("http://www.example.org/servlet?p1=x;p2=y", document.submission.serializeURLEncoded(node));
				Assert.areEqual("http://www.example.org/servlet?p1=x&p2=y&make=Ford&color=blue", string);

				// Combine params from URL having ampersand separator when semicolon is required separator
				string = document.submission.buildGetUrl("http://www.example.org/servlet?p1=x&p2=y#z", document.submission.serializeURLEncoded(node), ";");
				Assert.areEqual("http://www.example.org/servlet?p1=x;p2=y;make=Ford;color=blue#z", string);
			},
			
			testBuildSubmissionForm: function() {
				
				var Assert = YAHOO.util.Assert;
				var node = getFirstNode(this.model.EvaluateXPath("/car"));
				var form = document.submission.buildSubmissionForm("GET",
						"application/x-www-form-urlencoded",
						"http://www.example.org/servlet?p1=x&p2=y",
						"&",
						document.submission.serializeURLEncoded(node));
				
				Assert.areEqual(4, form.childNodes.length, "Should be 4 children");
				Assert.areEqual("p1=x", form.childNodes[0].name+"="+form.childNodes[0].value, "1st GET param should be p1=x");
				Assert.areEqual("p2=y", form.childNodes[1].name+"="+form.childNodes[1].value, "2nd GET param should be p2=y");
				Assert.areEqual("make=Ford", form.childNodes[2].name+"="+form.childNodes[2].value, "3rd GET param should be make=Ford");
				Assert.areEqual("color=blue", form.childNodes[3].name+"="+form.childNodes[3].value, "4th GET param should be color=blue");
			},
			
			testNoSerializationData: function() {
				
				var Assert = YAHOO.util.Assert;
				var node = getFirstNode(this.model.EvaluateXPath("/car"));
				var string = document.submission.buildGetUrl("http://www.example.org/servlet", {});
				
				Assert.areEqual("http://www.example.org/servlet", string);
			}
			
		}));
