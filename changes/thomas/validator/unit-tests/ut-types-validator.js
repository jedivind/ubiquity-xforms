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
 * Test case to test the addEventListener and removeEventListener of EventTarget object  
 */
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
    name        : "",
    setUp       :   function() {
    },  
    tearDown : function() {
    }, // tearDown()
    test:  
    function() {
    } 
});

var oXFormsDayTimeDurationTypeTest = new YAHOO.tool.TestCase({
    name        : "Test xf:dayTimeDuration validation",
    setUp       :   function() {
	this.validator = new Validator();
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
    	var oContext = this.testInstance.m_oDOM.documentElement;
    	Assert.isTrue(this.validator.validateValue("xf:dayTimeDuration", "P5DT3H4M2S", oContext), "dayTimeDuration P5DT3H4M2S failed to return true");
    	Assert.isFalse(this.validator.validateValue("xf:dayTimeDuration", "Y2M30DSS", oContext), "dayTimeDuration Y2M30DSS failed to return true");
    	Assert.isTrue(this.validator.validateValue("xf:dayTimeDuration", "P1Y2M", oContext), "dayTimeDuration P1Y2M failed to return true");
    	Assert.isFalse(this.validator.validateValue("xf:dayTimeDuration", "P1Y2MD", oContext), "dayTimeDuration P1Y2MD failed to return true");
    }    
});

var oXFormsYearMonthDurationTypeTest = new YAHOO.tool.TestCase({
    name        : "Test xf:yearMonthDuration validation",
    setUp       :   function() {
	this.validator = new Validator();
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
    	var oContext = this.testInstance.m_oDOM.documentElement;
    	Assert.isTrue(this.validator.validateValue("xf:yearMonthDuration", "P1Y2M", oContext), "yearMonthDuration P1Y2M failed to return true");
    	Assert.isFalse(this.validator.validateValue("xf:yearMonthDuration", "P34MX689Y", oContext), "yearMonthDuration P34MX689Y failed to return false");
    	Assert.isTrue(this.validator.validateValue("xf:yearMonthDuration", "PT1H1M6S", oContext), "yearMonthDuration PT1H1M6S failed to return true");
    	Assert.isFalse(this.validator.validateValue("xf:yearMonthDuration", "KT10H2M9S900", oContext), "yearMonthDuration KT10H2M9S900 failed to return false");
    }    
});

var oXFormsEmailTypeTest = new YAHOO.tool.TestCase({
    name        : "Test xf:email validation",
    setUp       :   function() {
	this.validator = new Validator();
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
    
    testEmailType:  
    function() {
    	var oContext = this.testInstance.m_oDOM.documentElement;
    	Assert.isTrue(this.validator.validateValue("xf:email", "editors@example.com", oContext), "email editors@example.com failed to return true");
    	Assert.isFalse(this.validator.validateValue("xf:email", "editors{at}example{dot}info", oContext), "email editors{at}example{dot}info failed to return false");
    	Assert.isTrue(this.validator.validateValue("xf:email", "~my_mail+{nospam}$?@sub-domain.example.info", oContext), "email ~my_mail+{nospam}$?@sub-domain.example.info failed to return true");
    	Assert.isFalse(this.validator.validateValue("xf:email", "editors@(this is a comment)example.info", oContext), "email editors@(this is a comment)example.info failed to return false");
    }
});

var oXFormsCardNumberTypeTest = new YAHOO.tool.TestCase({
    name        : "Test xf:card-number validation",
    setUp       :   function() {
	this.validator = new Validator();
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
    
    testCardNumberType:  
    function() {
    	var oContext = this.testInstance.m_oDOM.documentElement;
    	Assert.isTrue(this.validator.validateValue("xf:card-number", "012345678910", oContext), "card-number 012345678910 failed to return true");
    	Assert.isTrue(this.validator.validateValue("xf:card-number", "1234567891011121314", oContext), "card-number 1234567891011121314 failed to return true");
    	Assert.isFalse(this.validator.validateValue("xf:card-number", "0II23581321", oContext), "card-number 0II23581321 failed to return false");
    	Assert.isFalse(this.validator.validateValue("xf:card-number", "0112E581321345589144", oContext), "card-number 0112E581321345589144 failed to return false");
    	Assert.isTrue(this.validator.validateValue("xf:card-number", "4111111111111111", oContext), "card-number 4111111111111111 failed to return true");
    }    
});


var suiteTypeValidator = new YAHOO.tool.TestSuite("Test Type Validator");
// suiteTypeValidator.add(oXMLSchemaTypeTest);
// suiteTypeValidator.add(oXFormsBultinPrimitiveTypeTest);
// suiteTypeValidator.add(oXFormsBultinDerivedTypeTest);
suiteTypeValidator.add(oXFormsDayTimeDurationTypeTest);
suiteTypeValidator.add(oXFormsYearMonthDurationTypeTest);
suiteTypeValidator.add(oXFormsEmailTypeTest);
suiteTypeValidator.add(oXFormsCardNumberTypeTest);
