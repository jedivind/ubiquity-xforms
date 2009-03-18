// Ubiquity provides a standards-based suite of browser enhancements for
// building a new generation of internet-related applications.
//
// The Ubiquity XForms module adds XForms 1.1 support to the Ubiquity
// library.
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
// limitations under the License
var Assert = YAHOO.util.Assert;

/*
 * Test case to test the XForms Validator
 */

var XML_SCHEMA_NS = "http://www.w3.org/2001/XMLSchema";
var XFORMS_NS = "http://www.w3.org/2002/xforms";

function validateXFormsData(datatype, value) {
	return Validator.validateValue(XFORMS_NS, datatype, value);
};

function validateSchemaData(datatype, value) {
	return Validator.validateValue(XML_SCHEMA_NS, datatype, value);
};


var oXMLSchemaTypeTest = new YAHOO.tool.TestCase({
    name        : "",
    setUp       :   function() {
    },  
    tearDown : function() {
    }, // tearDown()
    test:  
    function() {
    } 
});

var oXFormsBultinPrimitiveTypeTest = new YAHOO.tool.TestCase({
    name        : "",
    setUp       :   function() {
    },  
    tearDown : function() {
    }, // tearDown()
    test:  
    function() {
    } 
});

var oXFormsBultinDerivedTypeTest = new YAHOO.tool.TestCase({
    name        : "Test XForms built-in derived types validation",
    setUp       :   function() {
    },  
    tearDown : function() {
    }, // tearDown()
    test:  
    function() {
         Assert.isTrue(validateXFormsData("normalizedString", "AString"), "normalizedString 'AString' failed to return true");
         Assert.isFalse(validateXFormsData("normalizedString", "A String"), "normalizedString 'A String' failed to return false");
         Assert.isTrue(validateXFormsData("listItem", "Red"), "listItem 'Red' failed to return true");
         Assert.isFalse(validateXFormsData("listItem", "R\te\td"), "listItem 'R\te\td' failed to return false");
         Assert.isTrue(validateXFormsData("listItems", "Red Blue Green"), "listItems 'Red Blue Green' failed to return true");
         Assert.isFalse(validateXFormsData("listItems", "Red\tBlue\tGreen"), "listItems 'Red\tBlue\tGreen' failed to return false");
    } 
});

var oXFormsDayTimeDurationTypeTest = new YAHOO.tool.TestCase({
    name        : "Test xf:dayTimeDuration validation",
    setUp       :   function() {
	this.testDIV = document.createElement( "div" );
	this.testInstance = new Instance( this.testDIV );
	this.testInstance.replaceDocument(
		xmlParse(
			"<ID xmlns=''></ID>"
		)
	);
    },
    
    tearDown : function() {
		delete this.testDIV;
		this.testDIV = null;
		delete this.testInstance;
		this.testInstance = null;	
		return;
    }, // tearDown()
    
    testDayTimeDurationType:  
    function() {
    	Assert.isTrue(validateXFormsData("dayTimeDuration", "P5DT3H4M2S"), "dayTimeDuration P5DT3H4M2S failed to return true");
    	Assert.isFalse(validateXFormsData("dayTimeDuration", "Y2M30DSS"), "dayTimeDuration Y2M30DSS failed to return true");
    	Assert.isTrue(validateXFormsData("dayTimeDuration", "P1Y2M"), "dayTimeDuration P1Y2M failed to return true");
    	Assert.isFalse(validateXFormsData("dayTimeDuration", "P1Y2MD"), "dayTimeDuration P1Y2MD failed to return true");
    }    
});

var oXFormsYearMonthDurationTypeTest = new YAHOO.tool.TestCase({
    name        : "Test xf:yearMonthDuration validation",
    setUp       :   function() {
	this.testDIV = document.createElement( "div" );
	this.testInstance = new Instance( this.testDIV );
	this.testInstance.replaceDocument(
		xmlParse(
			"<ID xmlns=''></ID>"
		)
	);

    },
    
    tearDown : function() {
		delete this.testDIV;
		this.testDIV = null;
		delete this.testInstance;
		this.testInstance = null;		
		return;
    }, // tearDown()
    
    testYearMonthDurationType:  
    function() {
    	Assert.isTrue(validateXFormsData("yearMonthDuration", "P1Y2M"), "yearMonthDuration P1Y2M failed to return true");
    	Assert.isFalse(validateXFormsData("yearMonthDuration", "P34MX689Y"), "yearMonthDuration P34MX689Y failed to return false");
    	Assert.isTrue(validateXFormsData("yearMonthDuration", "PT1H1M6S"), "yearMonthDuration PT1H1M6S failed to return true");
    	Assert.isFalse(validateXFormsData("yearMonthDuration", "KT10H2M9S900"), "yearMonthDuration KT10H2M9S900 failed to return false");
    }    
});

var oXFormsEmailTypeTest = new YAHOO.tool.TestCase({
    name        : "Test xf:email validation",
    setUp       :   function() {
    },  
    tearDown : function() {
		return;
    }, // tearDown()    
    testEmailType:  
    function() {
    	Assert.isTrue(validateXFormsData("email", "editors@example.com"), "email editors@example.com failed to return true");
    	Assert.isFalse(validateXFormsData("email", "editors{at}example{dot}info"), "email editors{at}example{dot}info failed to return false");
    	Assert.isTrue(validateXFormsData("email", "~my_mail+{nospam}$?@sub-domain.example.info"), "email ~my_mail+{nospam}$?@sub-domain.example.info failed to return true");
    	Assert.isFalse(validateXFormsData("email", "editors@(this is a comment)example.info"), "email editors@(this is a comment)example.info failed to return false");
    }
});

var oXFormsCardNumberTypeTest = new YAHOO.tool.TestCase({
    name        : "Test xf:card-number validation",
    setUp       :   function() {
    },  
    tearDown : function() {
		return;
    }, // tearDown() 
    testCardNumberType:
    function() {
    	Assert.isTrue(validateXFormsData("card-number", "012345678910"), "card-number 012345678910 failed to return true");
    	Assert.isTrue(validateXFormsData("card-number", "1234567891011121314"), "card-number 1234567891011121314 failed to return true");
    	Assert.isFalse(validateXFormsData("card-number", "0II23581321"), "card-number 0II23581321 failed to return false");
    	Assert.isFalse(validateXFormsData("card-number", "0112E581321345589144"), "card-number 0112E581321345589144 failed to return false");
    	Assert.isTrue(validateXFormsData("card-number", "4111111111111111"), "card-number 4111111111111111 failed to return true");
    }    
});


var suiteTypeValidator = new YAHOO.tool.TestSuite("Test Type Validator");
// suiteTypeValidator.add(oXMLSchemaTypeTest);
// suiteTypeValidator.add(oXFormsBultinPrimitiveTypeTest);
suiteTypeValidator.add(oXFormsBultinDerivedTypeTest);
suiteTypeValidator.add(oXFormsDayTimeDurationTypeTest);
suiteTypeValidator.add(oXFormsYearMonthDurationTypeTest);
suiteTypeValidator.add(oXFormsEmailTypeTest);
suiteTypeValidator.add(oXFormsCardNumberTypeTest);
