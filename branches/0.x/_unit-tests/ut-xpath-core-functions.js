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

// Test is-card-number().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test is-card-number()",

    testIsCardNumberExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["is-card-number"], "is-card-number() is not defined.");
    },

    testIsCardNumberTrue : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isTrue(evalXPath('is-card-number("541234567890125")').booleanValue(), "is-card-number() failed to return true for card number '541234567890125'");
      Assert.isTrue(evalXPath('is-card-number("1002312234567990000")').booleanValue(), "is-card-number() failed to return true for card number '1002312234567990000'");
      Assert.isTrue(evalXPath('is-card-number("341111111111111")').booleanValue(), "is-card-number() failed to return true for card number '341111111111111'");
    },

    testIsCardNumberFalse : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFalse(evalXPath('is-card-number("123456789012")').booleanValue(), "is-card-number() failed to return false for card number '123456789012'");
      Assert.isFalse(evalXPath('is-card-number("123")').booleanValue(), "is-card-number() failed to return false for card number '123'");
      Assert.isFalse(evalXPath('is-card-number("12345a789012")').booleanValue(), "is-card-number() failed to return false for card number '12345a789012'");
    }
  })//new TestCase
);

// Test local-date().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test local-date()",

    testLocalDateExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["local-date"], "local-date() is not defined.");
    },

    testLocalDate : function () {
      var Assert = YAHOO.util.Assert;

      // We expect an xsd:date with time zone in the following format:
      // yyyy '-' mm '-' dd ('+' | '-') hh ':' mm
      var xpDate = evalXPath('local-date()').stringValue(); 
      Assert.areEqual(16, xpDate.length, "local-date() returned an xsd:date with too few or too many characters.");

      var match = xpDate.match(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}[+-][0-9]{2}\:[0-9]{2}/);
      Assert.isNotNull(match, "local-date() failed to return a properly formatted xsd:date with time zone offset: "+xpDate);
    }
  })//new TestCase
);

// Test local-dateTime().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test local-dateTime()",

    testLocalDateTimeExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["local-dateTime"], "local-dateTime() is not defined.");
    },

    testLocalDateTime : function () {
      var Assert = YAHOO.util.Assert;

      // We expect an xsd:dateTime with time zone in the following format:
      // yyyy '-' mm '-' dd 'T' hh ':' mm ':' ss ('+' | '-') hh ':' mm
      var xpDateTime = evalXPath('local-dateTime()').stringValue(); 
      Assert.areEqual(25, xpDateTime.length, "local-dateTime() returned an xsd:dateTime with too few or too many characters.");

      var match = xpDateTime.match(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}\T[0-9]{2}\:[0-9]{2}\:[0-9]{2}[+-][0-9]{2}\:[0-9]{2}/);
      Assert.isNotNull(match, "local-dateTime() failed to return a properly formatted xsd:dateTime: "+xpDateTime);
    }
  })//new TestCase
);

// Test now().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test now()",

    testNowExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["now"], "now() is not defined.");
    },

    testNow : function () {
      var Assert = YAHOO.util.Assert;

      // We expect an xsd:dateTime representing UTC time in the following format:
      // yyyy '-' mm '-' dd 'T' hh ':' mm ':' ss 'Z'
      var xpDateTime = evalXPath('now()').stringValue(); 
      Assert.areEqual(20, xpDateTime.length, "now() returned an xsd:dateTime with too few or too many characters.");

      var match = xpDateTime.match(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}\T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\Z/);
      Assert.isNotNull(match, "now() failed to return a properly formatted UTC xsd:dateTime: "+xpDateTime);
    }
  })//new TestCase
);

// Test choose().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test choose()",

    testChooseExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["choose"], "choose() is not defined.");
    },

    testChooseParameters : function () {
         // Choose requires 3 parameters.
         Assert.isNull(evalXPath('choose()', "choose() with zero parameters should return null"));
         Assert.isNull(evalXPath('choose(1)', "choose() with one parameter should return null"));
         Assert.isNull(evalXPath('choose(1, 0)', "choose() with two parameters should return null"));
         Assert.isNull(evalXPath('choose(1, 0, "x", "y")', "choose() with four parameters should return null"));
    },

    testChoose : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("Yes", evalXPath('choose(5 > 1, "Yes", "No")').stringValue(), "choose() failed to return correct string value for true evaluation");
      Assert.areEqual(1, evalXPath('choose(5 > 1, 1, 0)').numberValue(), "choose() failed to return correct number value for true evaluation");
      Assert.areEqual(true, evalXPath('choose(5 > 1, "true", "")').booleanValue(), "choose() failed to return correct boolean value for true evaluation");
      Assert.areEqual("No", evalXPath('choose(1 > 5, "Yes", "No")').stringValue(), "choose() failed to return correct string value for false evaluation");
      Assert.areEqual(0, evalXPath('choose(1 > 5, 1, 0)').numberValue(), "choose() failed to return correct number value for false evaluation");
      Assert.areEqual(false, evalXPath('choose(1 > 5, "true", "")').booleanValue(), "choose() failed to return correct boolean value for false evaluation");
    }
  })//new TestCase
);
