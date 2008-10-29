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
      <numbers> \
         <number>1</number> \
         <number>2</number> \
         <number>3</number> \
         <number>4</number> \
         <number></number> \
      </numbers> \
      <numbers2> \
         <number>0</number> \
         <number>1</number> \
         <number>invalid</number> \
         <number>3</number> \
         <number>4</number> \
         <number></number> \
         <number></number> \
      </numbers2> \
      <numbers3> \
         <number>0</number> \
         <number>-1</number> \
         <number>-2</number> \
         <number>-3</number> \
         <number>6</number> \
         <number>12</number> \
      </numbers3> \
      <numbers4> \
         <number>-1</number> \
         <number>-2</number> \
         <number>-3</number> \
      </numbers4> \
      <numbers5> \
         <number>3</number> \
         <number>6</number> \
         <number>12</number> \
      </numbers5> \
    </test>"
  )
);

var reXsdDate = /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})\T([0-9]{2})\:([0-9]{2})\:([0-9]{2})(((([+-])([0-9]{2})\:([0-9]{2}))|(\Z))?)$/;

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
      var jsDate = new Date();

      xpDate.match( /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})([+-][0-9]{2}\:[0-9]{2})$/ );

      Assert.areEqual(jsDate.getFullYear(), RegExp.$1, "local-date() returned an incorrect year.");
      Assert.areEqual(jsDate.getMonth() + 1, RegExp.$2, "local-date() returned an incorrect month.");
      Assert.areEqual(jsDate.getDate(), RegExp.$3, "local-date() returned an incorrect day of the month.");
      Assert.areEqual(getTZOffset(jsDate), RegExp.$4, "local-date() returned an incorrect time zone.");
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
      var xpDate = evalXPath('local-dateTime()').stringValue();
      var jsDate = new Date();

      reXsdDate.exec( xpDate );

      Assert.areEqual(jsDate.getFullYear(), RegExp.$1, "local-datetime() returned an incorrect year.");
      Assert.areEqual(jsDate.getMonth() + 1, RegExp.$2, "local-datetime() returned an incorrect month.");
      Assert.areEqual(jsDate.getDate(), RegExp.$3, "local-datetime() returned an incorrect day of the month.");
      Assert.areEqual(jsDate.getHours(), RegExp.$4, "local-datetime() returned an incorrect hour.");
      Assert.areEqual(jsDate.getMinutes(), RegExp.$5, "local-datetime() returned incorrect minutes.");
      Assert.areEqual(jsDate.getSeconds(), RegExp.$6, "local-datetime() returned incorrect seconds.");
      Assert.areEqual(getTZOffset(jsDate), RegExp.$7, "local-dateTime() returned an incorrect time zone.");
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
      var xpDate = evalXPath('now()').stringValue();

      // Get the current time, in the current timezone.
      //
      var jsDate = new Date();

      // Unfortunately, we can't use getUTCHours(), etc., to test this time, because
      // the date may be wrong. For example, running this test just after midnight
      // in the UK, in BST, will have now() showing a day of the month that is one
      // day *after* the one from JavaScript. Similarly, running the test in the
      // afternoon in PST will have JavaScript giving a day of the month that is
      // one day *earlier* than the one from now().
      //
      // So we adjust for the timezone part and ignore the fact that the 'real'
      // time this object represents is incorrect.
      //
      jsDate.setMinutes( jsDate.getMinutes() + jsDate.getTimezoneOffset() );

      xpDate.match( /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})\T([0-9]{2})\:([0-9]{2})\:([0-9]{2})Z$/ );

      Assert.areEqual(jsDate.getFullYear(), RegExp.$1, "now() returned an incorrect year.");
      Assert.areEqual(jsDate.getMonth() + 1, RegExp.$2, "now() returned an incorrect month.");
      Assert.areEqual(jsDate.getDate(), RegExp.$3, "now() returned an incorrect day of the month.");
      Assert.areEqual(jsDate.getHours(), RegExp.$4, "now() returned an incorrect hour.");
      Assert.areEqual(jsDate.getMinutes(), RegExp.$5, "now() returned incorrect minutes.");
      Assert.areEqual(jsDate.getSeconds(), RegExp.$6, "now() returned incorrect seconds.");
    }
  })//new TestCase
);

// Test count().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test count()",

  	_should: {
  		error: {
  			testCountNoParameter: true
  		} 
  	},

    testCountExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["count"], "count() is not defined.");
    },

    testCountSuccess : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(5, evalXPath('count(/test/numbers/number)').numberValue());
      Assert.areEqual(7, evalXPath('count(/test/numbers2/number)').numberValue());
      Assert.areEqual(6, evalXPath('count(/test/numbers3/number)').numberValue());
    },

    testCountEmptyNodeset : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(0, evalXPath('count(empty)').numberValue());
    },

    // Throws an error.
    //
    testCountNoParameter : function () {
      var Assert = YAHOO.util.Assert;

      var a = evalXPath('count()').numberValue();
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
       Assert.isNull(evalXPath('choose()'), "choose() with zero parameters should return null");
       Assert.isNull(evalXPath('choose(1)'), "choose() with one parameter should return null");
       Assert.isNull(evalXPath('choose(1, 0)'), "choose() with two parameters should return null");
       Assert.isNull(evalXPath('choose(1, 0, "x", "y")'), "choose() with four parameters should return null");
    },

    testChooseReturnsString : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("Yes", evalXPath('choose(true(), "Yes", "No")').stringValue());
      Assert.areEqual("No", evalXPath('choose(false(), "Yes", "No")').stringValue());
    },

    testChooseReturnsNumber : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(1, evalXPath('choose(true(), 1, 0)').numberValue());
      Assert.areEqual(0, evalXPath('choose(false(), 1, 0)').numberValue());
    },

    testChooseReturnsBoolean : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(true, evalXPath('choose(true(), true(), false())').booleanValue());
      Assert.areEqual(false, evalXPath('choose(false(), true(), false())').booleanValue());
    },

    testChooseReturnsNodeSet : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(7, evalXPath('count(choose(true(), /test/numbers2/number, /test/numbers3/number))').numberValue());
      Assert.areEqual(6, evalXPath('count(choose(false(), /test/numbers2/number, /test/numbers3/number))').numberValue());
    }
  })//new TestCase
);

// Test avg().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test avg()",

    testAvgExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["avg"], "avg() is not defined.");
    },

    testAvgParameters : function () {
         // Avg requires 1 parameter
         Assert.isNaN(evalXPath('avg()').numberValue(), "avg() with zero parameters should return NaN");
         Assert.isNaN(evalXPath('avg(empty)').numberValue(), "avg() with an empty nodeset parameter should return NaN");
    },

    testAvg : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(2, evalXPath('avg(/test/numbers/number)').numberValue());
      Assert.isNaN(evalXPath('avg(/test/numbers2/number)').numberValue(), "avg() failed to return NaN when nodeset contains a non-number");
      Assert.areEqual(2, evalXPath('avg(/test/numbers3/number)').numberValue());
    }
  })//new TestCase
);

// Test min().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test min()",

    testMinExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["min"], "min() is not defined.");
    },

    testMinParameters : function () {
         // Min requires 1 parameter
         Assert.isNaN(evalXPath('min()').numberValue(), "min() with zero parameters should return NaN");
         Assert.isNaN(evalXPath('min(empty)').numberValue(), "min() with an empty nodeset parameter should return NaN");
    },

    testMin : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(0, evalXPath('min(/test/numbers/number)').numberValue());
      Assert.isNaN(evalXPath('min(/test/numbers2/number)').numberValue(), "min() failed to return NaN when nodeset contains a non-number");
      Assert.areEqual(-3, evalXPath('min(/test/numbers3/number)').numberValue());
      Assert.areEqual(-3, evalXPath('min(/test/numbers4/number)').numberValue());
      Assert.areEqual(3, evalXPath('min(/test/numbers5/number)').numberValue());
    }
  })//new TestCase
);

// Test max().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test max()",

    testMaxExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["max"], "max() is not defined.");
    },

    testMaxParameters : function () {
         // Max requires 1 parameter
         Assert.isNaN(evalXPath('max()').numberValue(), "max() with zero parameters should return NaN");
         Assert.isNaN(evalXPath('max(empty)').numberValue(), "max() with an empty nodeset parameter should return NaN");
    },

    testMax : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(4, evalXPath('max(/test/numbers/number)').numberValue());
      Assert.isNaN(evalXPath('max(/test/numbers2/number)').numberValue(), "max() failed to return NaN when nodeset contains a non-number");
      Assert.areEqual(12, evalXPath('max(/test/numbers3/number)').numberValue());
      Assert.areEqual(-1, evalXPath('max(/test/numbers4/number)').numberValue());
      Assert.areEqual(12, evalXPath('max(/test/numbers5/number)').numberValue());
    }
  })//new TestCase
);

// Test count-non-empty().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test count-non-empty()",

    testCountNonEmptyExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["count-non-empty"], "count-non-empty() is not defined.");
    },

    testCountNonEmptyParameters : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(0, evalXPath('count-non-empty()').numberValue(), "count-non-empty() with zero parameters should return 0");
      Assert.areEqual(0, evalXPath('count-non-empty(empty)').numberValue(), "count-non-empty() with an empty nodeset parameter should return 0");
    },

    testCountNonEmpty : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(4, evalXPath('count-non-empty(/test/numbers/number)').numberValue());
      Assert.areEqual(5, evalXPath('count-non-empty(/test/numbers2/number)').numberValue());
      Assert.areEqual(6, evalXPath('count-non-empty(/test/numbers3/number)').numberValue());
    }
  })//new TestCase
);

// Test random().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test random()",

    testRandomExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["random"], "random() is not defined.");
    },

    testRandom : function () {
      var Assert = YAHOO.util.Assert;

      var rand = evalXPath('random()').numberValue() ;
      var valid = rand >= 0 && rand < 1;
      Assert.isTrue(valid, "random() should return a random number >= 0 and < 1");

      Assert.areNotEqual(evalXPath('random()').numberValue(), evalXPath('random()').numberValue());
    }
  })//new TestCase
);

// Test compare().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test compare()",

    testCompareExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["compare"], "compare() is not defined.");
    },

    testCompare : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isNaN(evalXPath('compare()').stringValue(), "compare() with zero parameters should return NaN");
      Assert.isNaN(evalXPath('compare("apple")').stringValue(), "compare() with one parameter should return NaN");
      Assert.areEqual(0, evalXPath('compare("apple", "apple")').stringValue(), "compare() should return 0 when comparing 'apple' to 'apple'");
      Assert.areEqual(-1, evalXPath('compare("apple", "orange")').stringValue(), "compare() should return -1 when comparing 'apple' to 'orange'");
      Assert.areEqual(1, evalXPath('compare("orange", "apple")').stringValue(), "compare() should return 1 when comparing 'orange' to 'apple'");
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test days-from-date()",

    testDaysFromDateExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["days-from-date"], "days-from-date() is not defined.");
    },
    
    testDaysFromDateBase : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(0, evalXPath('days-from-date("1970-01-01")').numberValue());
    },
    
    testDaysFromDateXsdDate : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(11688, evalXPath('days-from-date("2002-01-01")').numberValue());
    },
    
    testDaysFromDateXsdDateWithTimezone : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(11688, evalXPath('days-from-date("2002-01-01-07:00")').numberValue());
    },
    
    testDaysFromDateXsdDateTime : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(11688, evalXPath('days-from-date("2002-01-01T00:00:00+01:00")').numberValue());
    },

    testDaysFromDateNegative : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(-1, evalXPath('days-from-date("1969-12-31")').numberValue());
    },

    testDaysFromDateFail : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isNaN(evalXPath('days-from-date()').numberValue());
      Assert.isNaN(evalXPath('days-from-date("1970-01-01", "1970-01-01")').numberValue());
      Assert.isNaN(evalXPath('days-from-date("NaN")').numberValue());
      Assert.isNaN(evalXPath('days-from-date("error")').numberValue());
      Assert.isNaN(evalXPath('days-from-date("AA1970-01-01ZZ")').numberValue());
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test days-to-date()",

    testDaysToDateExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["days-to-date"], "days-to-date() is not defined.");
    },

    testDaysToDateBase : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("1970-01-01", evalXPath('days-to-date(0)').stringValue());
    },

    testDaysToDateInteger : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("2002-01-01", evalXPath('days-to-date(11688)').stringValue());
    },

    testDaysToDateRounding : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("2002-01-01", evalXPath('days-to-date(11687.5)').stringValue());
      Assert.areEqual("2001-12-31", evalXPath('days-to-date(11687.49999)').stringValue());
    },

    testDaysToDateNegative : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("1969-12-31", evalXPath('days-to-date(-1)').stringValue());
    },

    testDaysToDateString : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("2002-01-01", evalXPath('days-to-date("11688")').stringValue());
    },

    testDaysToDateFail : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("", evalXPath('days-to-date()').stringValue());
      Assert.areEqual("", evalXPath('days-to-date(11688, 11688)').stringValue());
      Assert.areEqual("", evalXPath('days-to-date("NaN")').stringValue());
      Assert.areEqual("", evalXPath('days-to-date("error")').stringValue());
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test seconds-from-dateTime()",

    testSecondsFromDateTimeExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["seconds-from-dateTime"], "seconds-from-dateTime() is not defined.");
    },

    testSecondsFromDateTimeBase : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(0, evalXPath('seconds-from-dateTime("1970-01-01T00:00:00Z")').numberValue());
    },

    testSecondsFromDateTimeNoTimeZone : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(3600, evalXPath('seconds-from-dateTime("1970-01-01T01:00:00")').numberValue());
    },

    testSecondsFromDateTimeZuluTimeZone : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(3600, evalXPath('seconds-from-dateTime("1970-01-01T01:00:00Z")').numberValue());
    },

    testSecondsFromDateTimeNumericTimezone : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(-28800, evalXPath('seconds-from-dateTime("1970-01-01T00:00:00-08:00")').numberValue()); /* from spec */
    },

    testSecondsFromDateTimeFail : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isNaN(evalXPath('seconds-from-dateTime()').numberValue());
      Assert.isNaN(evalXPath('seconds-from-dateTime("1970-01-01T00:00:00Z", "1970-01-01T00:00:00Z")').numberValue());
      Assert.isNaN(evalXPath('seconds-from-dateTime("NaN")').numberValue());
      Assert.isNaN(evalXPath('seconds-from-dateTime("error")').numberValue());
      Assert.isNaN(evalXPath('seconds-from-dateTime("AA1970-01-01T00:00:00ZZZ")').numberValue());
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test seconds-to-dateTime()",

    testSecondsToDateTimeExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["seconds-to-dateTime"]);
    },

    testSecondsToDateTimeBase : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("1970-01-01T00:00:00Z", evalXPath('seconds-to-dateTime(0)').stringValue());
    },

    testSecondsToDateTimePositiveNumber : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("1970-01-01T08:00:00Z", evalXPath('seconds-to-dateTime(28800)').stringValue());
    },
    
    testSecondsToDateTimeNegativeNumber : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("1969-12-31T16:00:00Z", evalXPath('seconds-to-dateTime(-28800)').stringValue());
    },
    
    testSecondsToDateTimeString : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("1970-01-01T00:00:00Z", evalXPath('seconds-to-dateTime("0")').stringValue());
      Assert.areEqual("1970-01-01T08:00:00Z", evalXPath('seconds-to-dateTime("28800")').stringValue());
      Assert.areEqual("1970-01-01T00:01:06Z", evalXPath('seconds-to-dateTime("66")').stringValue());
      Assert.areEqual("1970-01-01T11:11:11Z", evalXPath('seconds-to-dateTime("40271")').stringValue());
      Assert.areEqual("1970-01-11T00:00:00Z", evalXPath('seconds-to-dateTime("864000")').stringValue());
      Assert.areEqual("1969-12-31T23:59:59Z", evalXPath('seconds-to-dateTime("-1")').stringValue());
    },

    testSecondsToDateTimeFail : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("", evalXPath('seconds-to-dateTime()').stringValue());
      Assert.areEqual("", evalXPath('seconds-to-dateTime("0", "0")').stringValue());
      Assert.areEqual("", evalXPath('seconds-to-dateTime("NaN")').stringValue());
      Assert.areEqual("", evalXPath('seconds-to-dateTime("error")').stringValue());
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test adjust-dateTime-to-timezone()",

    testAdjustToTimezoneExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["adjust-dateTime-to-timezone"]);
    },

    testAdjustTimeWithNoTimezoneToLocalTimezone : function () {
      var Assert = YAHOO.util.Assert;

      // If no timezone information is provided, then the local timezone should be used. This means
      // we need to make the comparison against a localised JavaScript date.
      //
      var xpDate = evalXPath("adjust-dateTime-to-timezone('2007-10-07T02:22:00')").stringValue();
      var jsDate = new Date(2007, 9, 7, 2, 22, 0);

      reXsdDate.exec( xpDate );

      Assert.areEqual(jsDate.getFullYear(), RegExp.$1, "adjust-dateTime-to-timezone() returned an incorrect year.");
      Assert.areEqual(jsDate.getMonth() + 1, RegExp.$2, "adjust-dateTime-to-timezone() returned an incorrect month.");
      Assert.areEqual(jsDate.getDate(), RegExp.$3, "adjust-dateTime-to-timezone() returned an incorrect day of the month.");
      Assert.areEqual(jsDate.getHours(), RegExp.$4, "adjust-dateTime-to-timezone() returned an incorrect hour.");
      Assert.areEqual(jsDate.getMinutes(), RegExp.$5, "adjust-dateTime-to-timezone() returned incorrect minutes.");
      Assert.areEqual(jsDate.getSeconds(), RegExp.$6, "adjust-dateTime-to-timezone() returned incorrect seconds.");
    },

    testAdjustTimeWithZuluTimezoneToLocalTimezone : function () {
      var Assert = YAHOO.util.Assert;

      // If 'Z' is provided, then the offset is zero.
      //
      var xpDate = evalXPath("adjust-dateTime-to-timezone('2007-10-02T21:26:43Z')").stringValue();

      // We can't test directly against "2007-10-02T21:26:43Z", because there is no way in JavaScript
      // to create a date object in a different timezone. However, we can create "2007-10-02T21:26:43"
      // in our local timezone, and then adjust the minutes, to give us our specific date and time,
      // but normalised.
      //
      var jsDate = new Date( 2007, 9, 2, 21, 26, 43 );

      jsDate.setMinutes( jsDate.getMinutes() - jsDate.getTimezoneOffset() );

      reXsdDate.exec( xpDate );

      Assert.areEqual(jsDate.getFullYear(), RegExp.$1, "adjust-dateTime-to-timezone() returned an incorrect year.");
      Assert.areEqual(jsDate.getMonth() + 1, RegExp.$2, "adjust-dateTime-to-timezone() returned an incorrect month.");
      Assert.areEqual(jsDate.getDate(), RegExp.$3, "adjust-dateTime-to-timezone() returned an incorrect day of the month.");
      Assert.areEqual(jsDate.getHours(), RegExp.$4, "adjust-dateTime-to-timezone() returned an incorrect hour.");
      Assert.areEqual(jsDate.getMinutes(), RegExp.$5, "adjust-dateTime-to-timezone() returned incorrect minutes.");
      Assert.areEqual(jsDate.getSeconds(), RegExp.$6, "adjust-dateTime-to-timezone() returned incorrect seconds.");
    },

    testAdjustTimeWithNumericTimezoneToLocalTimezone : function () {
      var Assert = YAHOO.util.Assert;

      // If an offset is provided, that must be used.
      //
      var xpDate = evalXPath("adjust-dateTime-to-timezone('2007-10-02T14:26:43-07:00')").stringValue();

      // We can't test directly against "2007-10-02T14:26:43-07:00", because there is no way in
      // JavaScript to create a date object in a different timezone. However, we can create
      // "2007-10-02T14:26:43" in our local timezone, and then adjust the minutes, to give us
      // our specific date and time, but normalised.
      //
      var jsDate = new Date( 2007, 9, 2, 14, 26, 43 );

      jsDate.setMinutes( jsDate.getMinutes() - jsDate.getTimezoneOffset() ); // Normalise our date
      jsDate.setHours( jsDate.getHours() + 7 ); // Put it into Pacific time, with daylight savings

      xpDate.match( /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})\T([0-9]{2})\:([0-9]{2})\:([0-9]{2})([+-])([0-9]{2})\:([0-9]{2})$/ );

      Assert.areEqual(jsDate.getFullYear(), RegExp.$1, "adjust-dateTime-to-timezone() returned an incorrect year.");
      Assert.areEqual(jsDate.getMonth() + 1, RegExp.$2, "adjust-dateTime-to-timezone() returned an incorrect month.");
      Assert.areEqual(jsDate.getDate(), RegExp.$3, "adjust-dateTime-to-timezone() returned an incorrect day of the month.");
      Assert.areEqual(jsDate.getHours(), RegExp.$4, "adjust-dateTime-to-timezone() returned an incorrect hour.");
      Assert.areEqual(jsDate.getMinutes(), RegExp.$5, "adjust-dateTime-to-timezone() returned incorrect minutes.");
      Assert.areEqual(jsDate.getSeconds(), RegExp.$6, "adjust-dateTime-to-timezone() returned incorrect seconds.");
    },

    testAdjustToTimeZoneFail : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("", evalXPath('adjust-dateTime-to-timezone()').stringValue());
      Assert.areEqual("", evalXPath('adjust-dateTime-to-timezone("0", "0")').stringValue());
      Assert.areEqual("", evalXPath('adjust-dateTime-to-timezone("NaN")').stringValue());
      Assert.areEqual("", evalXPath('adjust-dateTime-to-timezone("error")').stringValue());
      Assert.areEqual("", evalXPath('adjust-dateTime-to-timezone("AA2008-07-17T12:00:00-05:00ZZ")').stringValue());
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test seconds()",

    testSecondsExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["seconds"], "seconds() is not defined.");
    },
    
    testSecondsSuccess : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(297001.5, evalXPath('seconds("P3DT10H30M1.5S")').numberValue());
      Assert.areEqual(0, evalXPath('seconds("P1Y2M")').numberValue());
      Assert.areEqual(0, evalXPath('seconds("P3")').numberValue());
      Assert.areEqual(259200, evalXPath('seconds("P3D")').numberValue());
      Assert.areEqual(259200, evalXPath('seconds("P1Y2M3D")').numberValue());
      Assert.areEqual(-297001.5, evalXPath('seconds("-P3DT10H30M1.5S")').numberValue());
      Assert.areEqual(-259200, evalXPath('seconds("-P3D")').numberValue());
      Assert.areEqual(3666, evalXPath('seconds("PT1H1M6S")').numberValue());
      Assert.areEqual(0, evalXPath('seconds("P1Y2MT")').numberValue());
    },

    testSecondsFail : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isNaN(evalXPath('seconds()').numberValue());
      Assert.isNaN(evalXPath('seconds("P1Y2M", "P1Y2M")').numberValue());
      Assert.isNaN(evalXPath('seconds("NaN")').numberValue());
      Assert.isNaN(evalXPath('seconds("error")').numberValue());
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test months()",

    testMonthsExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["months"], "months() is not defined.");
    },
    
    testMonthsSuccess : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(0, evalXPath('months("P3DT10H30M1.5S")').numberValue());
      Assert.areEqual(14, evalXPath('months("P1Y2M")').numberValue());
      Assert.areEqual(0, evalXPath('months("P3")').numberValue());
      Assert.areEqual(3, evalXPath('months("P3MT4M")').numberValue());
      Assert.areEqual(14, evalXPath('months("P1Y2M3D")').numberValue());
      Assert.areEqual(0, evalXPath('months("-P3DT10H30M1.5S")').numberValue());
      Assert.areEqual(-19, evalXPath('months("-P19M")').numberValue());
      Assert.areEqual(0, evalXPath('months("PT1H1M6S")').numberValue());
      Assert.areEqual(14, evalXPath('months("P1Y2MT")').numberValue());
    },

    testMonthsFail : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isNaN(evalXPath('months()').numberValue());
      Assert.isNaN(evalXPath('months("P1Y2M", "P1Y2M")').numberValue());
      Assert.isNaN(evalXPath('months("NaN")').numberValue());
      Assert.isNaN(evalXPath('months("error")').numberValue());
    }
  })//new TestCase
);

suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test property()",

    testPropertyExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["property"], "property() is not defined.");
    },
    
    testPropertySuccess : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("1.1", evalXPath('property("version")').stringValue());
      Assert.areEqual("basic", evalXPath('property("conformance-level")').stringValue());
    },

    testPropertyReturnEmptyString : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("", evalXPath('property()').stringValue());
      Assert.areEqual("", evalXPath('property("version", "version")').stringValue());
      Assert.areEqual("", evalXPath('property("in:valid")').stringValue());
      Assert.areEqual("", evalXPath('property("invalid")').stringValue());
    }
  })//new TestCase
);

// Test now().
//
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test combinations of functions",

    // This test corresponds to the example given in the description of now() about how to calculate
    // the time two hours from now.
    //
    testNowCalculateTwoHoursFromNow : function () {
      var Assert = YAHOO.util.Assert;

      var xpDate = evalXPath('seconds-to-dateTime(seconds-from-dateTime(now()) + 7200)').stringValue();
      var jsDate = new Date();

      // Since we're only going to compare the date and time, we can adjust for the
      // timezone part and ignore the fact that the 'real' time this object represents
      // is incorrect.
      //
      jsDate.setMinutes( jsDate.getMinutes() + jsDate.getTimezoneOffset() );

      // Set the time two hours from now.
      //
      jsDate.setHours( jsDate.getHours() + 2 );

      xpDate.match( /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})\T([0-9]{2})\:([0-9]{2})\:([0-9]{2})Z$/ );

      Assert.areEqual(jsDate.getFullYear(), RegExp.$1, "Incorrect year.");
      Assert.areEqual(jsDate.getMonth() + 1, RegExp.$2, "Incorrect month.");
      Assert.areEqual(jsDate.getDate(), RegExp.$3, "Incorrect day of the month.");
      Assert.areEqual(jsDate.getHours(), RegExp.$4, "Incorrect hour.");
      Assert.areEqual(jsDate.getMinutes(), RegExp.$5, "Incorrect minutes.");
      Assert.areEqual(jsDate.getSeconds(), RegExp.$6, "Incorrect seconds.");
    },

    // This test corresponds to the example given in the description of adjust-dateTime-to-timezone()
    // about how to calculate the time two hours from now.
    //
    testAdjustDateTimeToTimezoneCalculateTwoHoursFromNow : function () {
      var Assert = YAHOO.util.Assert;

      var xpDate = evalXPath('adjust-dateTime-to-timezone(seconds-to-dateTime(seconds-from-dateTime(now()) + 7200))').stringValue();
      var jsDate = new Date();

      // Set the time two hours from now.
      //
      jsDate.setHours( jsDate.getHours() + 2 );

      // Since we're only going to compare the date and time, we can adjust for the
      // timezone part and ignore the fact that the 'real' time this object represents
      // is incorrect.
      //
      jsDate.setMinutes( jsDate.getMinutes() + jsDate.getTimezoneOffset() );

      xpDate.match( /^([0-9]{4})\-([0-9]{2})\-([0-9]{2})\T([0-9]{2})\:([0-9]{2})\:([0-9]{2})Z$/ );

      Assert.areEqual(jsDate.getFullYear(), RegExp.$1, "Incorrect year.");
      Assert.areEqual(jsDate.getMonth() + 1, RegExp.$2, "Incorrect month.");
      Assert.areEqual(jsDate.getDate(), RegExp.$3, "Incorrect day of the month.");
      Assert.areEqual(jsDate.getHours(), RegExp.$4, "Incorrect hour.");
      Assert.areEqual(jsDate.getMinutes(), RegExp.$5, "Incorrect minutes.");
      Assert.areEqual(jsDate.getSeconds(), RegExp.$6, "Incorrect seconds.");
    },

    testAdjustNowToTimezoneAndCompareToLocalDateTime : function () {
      var Assert = YAHOO.util.Assert;

      // now() should return the current date and time in UTC format and localTime() should
      // return the current local date and time with timezone, so the result of adjusting now()
      // to the local timezone should be equal to the result of local-dateTime().
      //
      Assert.areEqual(
        evalXPath('local-dateTime()').stringValue(),
        evalXPath('adjust-dateTime-to-timezone(now())').stringValue()
      );
    },

    testSecondsToAndFromDateTime : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual(-28800, evalXPath('seconds-from-dateTime(seconds-to-dateTime(-28800))').numberValue());
    }
  })//new TestCase
);

// Test digest()
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test digest()",

    testDigestExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["digest"], "digest() is not defined.");
    },
    
    testDigestMD5Base64 : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("kAFQmDzST7DWlj99KOF/cg==", evalXPath('digest("abc", "MD5", "base64")').stringValue());
    },

    testDigestMD5Hex : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("900150983cd24fb0d6963f7d28e17f72", evalXPath('digest("abc", "MD5", "hex")').stringValue());
    },

    testDigestSHA1Base64 : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("qZk+NkcGgWq6PiVxeFDCbJzQ2J0=", evalXPath('digest("abc", "SHA-1", "base64")').stringValue());
    },

    testDigestSHA1Hex : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("a9993e364706816aba3e25717850c26c9cd0d89d", evalXPath('digest("abc", "SHA-1", "hex")').stringValue());
    }

  })//new TestCase
);

// Test hmac()
suiteXPathCoreFunctions.add(
  new YAHOO.tool.TestCase({
    name: "Test hmac()",

    testHmacExists : function () {
      var Assert = YAHOO.util.Assert;

      Assert.isFunction(FunctionCallExpr.prototype.xpathfunctions["hmac"], "hmac() is not defined.");
    },
    
    testHmacMD5Base64 : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("0v6YBj+HawMZOvtJtJeVkQ==", evalXPath('hmac("key", "abc", "MD5", "base64")').stringValue());
    },

    testHmacMD5Hex : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("d2fe98063f876b03193afb49b4979591", evalXPath('hmac("key", "abc", "MD5", "hex")').stringValue());
    },

    testHmacSHA1Base64 : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("T9CyFSdu8S8rPkyOysKBFJi2Vvw=", evalXPath('hmac("key", "abc", "SHA-1", "base64")').stringValue());
    },

    testHmacSHA1Hex : function () {
      var Assert = YAHOO.util.Assert;

      Assert.areEqual("4fd0b215276ef12f2b3e4c8ecac2811498b656fc", evalXPath('hmac("key", "abc", "SHA-1", "hex")').stringValue());
    }

  })//new TestCase
);
