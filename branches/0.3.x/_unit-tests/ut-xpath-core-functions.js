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

// Get some XML data to test with
//
var ctx = new ExprContext(
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

function evalXPath(expr) {
  var expr1 = xpathParse(expr);

  return expr1.evaluate(ctx);
};

var suiteXPathCoreFunctions = new YAHOO.tool.TestSuite("Test XPath Core Functions");

// Test boolean-from-string().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test boolean-from-string",

    testBooleanFromStringExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["boolean-from-string"], "boolean-from-string() is not defined.");
    },

    testBooleanFromStringTrue : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isTrue(evalXPath('boolean-from-string("true")').booleanValue(), "boolean-from-string() failed to return true from a string literal of 'true'");
      Assert.isTrue(evalXPath('boolean-from-string("TRUE")').booleanValue(), "boolean-from-string() failed to return true from a string literal of 'TRUE'");
      Assert.isTrue(evalXPath('boolean-from-string("TrUe")').booleanValue(), "boolean-from-string() failed to return true from a string literal of 'TrUe'");
      Assert.isTrue(evalXPath('boolean-from-string("1")').booleanValue(), "boolean-from-string() failed to return true from a string literal of '1'");
      Assert.isTrue(evalXPath('boolean-from-string(1)').booleanValue(), "boolean-from-string() failed to return true from a number of '1'");
      Assert.isTrue(evalXPath('boolean-from-string(true())').booleanValue(), "boolean-from-string() failed to return true from true()");
      Assert.isTrue(evalXPath('boolean-from-string(/test/true[1])').booleanValue(), "boolean-from-string() failed to return true from true[1]");
      Assert.isTrue(evalXPath('boolean-from-string(/test/true[2])').booleanValue(), "boolean-from-string() failed to return true from true[2]");
      Assert.isTrue(evalXPath('boolean-from-string(/test/true[3])').booleanValue(), "boolean-from-string() failed to return true from true[3]");
      Assert.isTrue(evalXPath('boolean-from-string(/test/true[4])').booleanValue(), "boolean-from-string() failed to return true from true[4]");
    },

    testBooleanFromStringFalse : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFalse(evalXPath('boolean-from-string("false")').booleanValue(), "boolean-from-string() failed to return false from a string literal of 'false'");
      Assert.isFalse(evalXPath('boolean-from-string("FALSE")').booleanValue(), "boolean-from-string() failed to return false from a string literal of 'FALSE'");
      Assert.isFalse(evalXPath('boolean-from-string("FaLsE")').booleanValue(), "boolean-from-string() failed to return false from a string literal of 'FaLsE'");
      Assert.isFalse(evalXPath('boolean-from-string("0")').booleanValue(), "boolean-from-string() failed to return false from a string literal of '0'");
      Assert.isFalse(evalXPath('boolean-from-string(0)').booleanValue(), "boolean-from-string() failed to return false from a number of '0'");
      Assert.isFalse(evalXPath('boolean-from-string(1.0)').booleanValue(), "boolean-from-string() failed to return false from a number of '1.0'");
      Assert.isFalse(evalXPath('boolean-from-string(89.2)').booleanValue(), "boolean-from-string() failed to return false from a number of '89.2'");
      Assert.isFalse(evalXPath('boolean-from-string(false())').booleanValue(), "boolean-from-string() failed to return false from false()");
      Assert.isFalse(evalXPath('boolean-from-string(/test/false[1])').booleanValue(), "boolean-from-string() failed to return true from false[1]");
      Assert.isFalse(evalXPath('boolean-from-string(/test/false[2])').booleanValue(), "boolean-from-string() failed to return true from false[2]");
      Assert.isFalse(evalXPath('boolean-from-string(/test/false[3])').booleanValue(), "boolean-from-string() failed to return true from false[3]");
      Assert.isFalse(evalXPath('boolean-from-string(/test/false[4])').booleanValue(), "boolean-from-string() failed to return true from false[4]");
      Assert.isFalse(evalXPath('boolean-from-string("ubiquity")').booleanValue(), "boolean-from-string() failed to return false from a string literal of 'ubiquity'");
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test power()",

    testPowerExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["power"], "power() is not defined.");
    },

    testPowerSuccess : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(8, evalXPath('power(2, 3)').numberValue());
      Assert.areEqual(1048576, evalXPath('power(2, 20)').numberValue());
      Assert.areEqual(10, evalXPath('power(100, 0.5)').numberValue());
    },

    testPowerFail : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isNaN(evalXPath('power(-1, 0.5)').numberValue());
      Assert.isNaN(evalXPath('power("ubiquity", 2)').numberValue());
      Assert.isNaN(evalXPath('power()').numberValue());
      Assert.isNaN(evalXPath('power(1)').numberValue());
      Assert.isNaN(evalXPath('power(1, 2, 3)').numberValue());
    }
  })//new TestCase
);
