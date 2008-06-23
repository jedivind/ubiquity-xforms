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

var suiteXPathCoreFunctions = new YAHOO.tool.TestSuite("Test XPath Core Functions");

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test XPath Core Functions",

    evalXPath : function (expr) {
      var expr1 = xpathParse(expr);
    
      return expr1.evaluate(this.ctx);
    },

    // Get some XML data to test with
    //
    setUp : function () {
      this.ctx = new ExprContext(
        xmlParse(
          "<test> \
            <true>true</true> \
            <true>TRUE</true> \
            <true>TrUe</true> \
            <true>1</true> \
            <false>false</false> \
            <false>FALSE</false> \
            <false>FaLsE</false> \
            <false>0</false> \
            <false>ubiquity</false> \
          </test>"
        )
      );
    },

    // Test boolean-from-string().
    //
    testBooleanFromString : function () {
      var Assert = YAHOO.util.Assert;

      // First check that the function actually exists.
      //
      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["boolean-from-string"], "boolean-from-string is not defined.");

      // Now test some of the different ways to get a true value.
      //
      Assert.isTrue(this.evalXPath('boolean-from-string("true")').booleanValue(), "boolean-from-string() failed to return true from a string literal of 'true'");
      Assert.isTrue(this.evalXPath('boolean-from-string("TRUE")').booleanValue(), "boolean-from-string() failed to return true from a string literal of 'TRUE'");
      Assert.isTrue(this.evalXPath('boolean-from-string("TrUe")').booleanValue(), "boolean-from-string() failed to return true from a string literal of 'TrUe'");
      Assert.isTrue(this.evalXPath('boolean-from-string("1")').booleanValue(), "boolean-from-string() failed to return true from a string literal of '1'");
      Assert.isTrue(this.evalXPath('boolean-from-string(1)').booleanValue(), "boolean-from-string() failed to return true from a number of '1'");
      Assert.isTrue(this.evalXPath('boolean-from-string(true())').booleanValue(), "boolean-from-string() failed to return true from true()");
      Assert.isTrue(this.evalXPath('boolean-from-string(/test/true[1])').booleanValue(), "boolean-from-string() failed to return true from true[1]");
      Assert.isTrue(this.evalXPath('boolean-from-string(/test/true[2])').booleanValue(), "boolean-from-string() failed to return true from true[2]");
      Assert.isTrue(this.evalXPath('boolean-from-string(/test/true[3])').booleanValue(), "boolean-from-string() failed to return true from true[3]");
      Assert.isTrue(this.evalXPath('boolean-from-string(/test/true[4])').booleanValue(), "boolean-from-string() failed to return true from true[4]");

      // Finally, test some of the various ways to get a false value.
      //
      Assert.isFalse(this.evalXPath('boolean-from-string("false")').booleanValue(), "boolean-from-string() failed to return false from a string literal of 'false'");
      Assert.isFalse(this.evalXPath('boolean-from-string("FALSE")').booleanValue(), "boolean-from-string() failed to return false from a string literal of 'FALSE'");
      Assert.isFalse(this.evalXPath('boolean-from-string("FaLsE")').booleanValue(), "boolean-from-string() failed to return false from a string literal of 'FaLsE'");
      Assert.isFalse(this.evalXPath('boolean-from-string("0")').booleanValue(), "boolean-from-string() failed to return false from a string literal of '0'");
      Assert.isFalse(this.evalXPath('boolean-from-string(0)').booleanValue(), "boolean-from-string() failed to return false from a number of '0'");
      Assert.isFalse(this.evalXPath('boolean-from-string(1.0)').booleanValue(), "boolean-from-string() failed to return false from a number of '1.0'");
      Assert.isFalse(this.evalXPath('boolean-from-string(89.2)').booleanValue(), "boolean-from-string() failed to return false from a number of '89.2'");
      Assert.isFalse(this.evalXPath('boolean-from-string(false())').booleanValue(), "boolean-from-string() failed to return false from false()");
      Assert.isFalse(this.evalXPath('boolean-from-string(/test/false[1])').booleanValue(), "boolean-from-string() failed to return true from false[1]");
      Assert.isFalse(this.evalXPath('boolean-from-string(/test/false[2])').booleanValue(), "boolean-from-string() failed to return true from false[2]");
      Assert.isFalse(this.evalXPath('boolean-from-string(/test/false[3])').booleanValue(), "boolean-from-string() failed to return true from false[3]");
      Assert.isFalse(this.evalXPath('boolean-from-string(/test/false[4])').booleanValue(), "boolean-from-string() failed to return true from false[4]");
      Assert.isFalse(this.evalXPath('boolean-from-string("ubiquity")').booleanValue(), "boolean-from-string() failed to return false from a string literal of 'ubiquity'");
    }
  })//new TestCase
);
