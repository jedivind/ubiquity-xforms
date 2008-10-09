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
(function() {
    var Assert = YAHOO.util.Assert;

    var suite = new YAHOO.tool.TestSuite({
        name : "Test calendar input date parsing functionality",

        // Calendar requires some basic DOM structure
        //
        setUp : function() {
            this.testDIV = document.createElement( "div" );
            this.testDIV.setAttribute("datatype", "xsd:date");
            this.testDIV.setAttribute("appearance", "full");
            this.testDIV.setAttribute("style", "display : none;");
            this.testPEVALUE = document.createElement( "div" );
            this.testDIV.appendChild(this.testPEVALUE);
            document.getElementsByTagName("body")[0].appendChild(this.testDIV);
            this.testCalendar = new InputValueCalendar( this.testPEVALUE );
            this.testCalendar.onDocumentReady();
        },

        // Remove the DOM test ornamentation, delete suite resources
        //
        tearDown : function() {
            document.getElementsByTagName("body")[0].removeChild(this.testDIV);
            delete this.testPEVALUE;
            this.testPEVALUE = null;
            delete this.testDIV;
            this.testDIV = null;
            delete this.testCalendar;
            this.testCalendar = null;
        },

        // Suite utility methods
        //
        throwsException : function(date) {
	        var exception = false;
	        try {
	            this.testCalendar.setValue(date);
	        } catch (e) {
	            exception = true;
	        }
	        return exception;
	    }

    });

    // Add tests for calendar date parsing.
    //
    suite.add(
        new YAHOO.tool.TestCase({
            name : "Test calendar input date parsing",

            testBadDateString : function() {
                var date = "not-a-date";
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
            },

            testBadDateNumber : function() {
                var date = 1234;
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
            },

            testBadDateNaNDay1 : function() {
                var date = "2008-08-nn";
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
            },

            testBadDateNaNDay2 : function() {
                var date = "2008-08-2n";
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
            },

            testBadDateNaNMonth1 : function() {
                var date = "2008-m--08";
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
            },

            testBadDateNaNMonth2 : function() {
                var date = "2008-mm-27";
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
            },

            testBadDateNaNYear1 : function() {
                var date = "200y-08-27";
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
            },

            testBadDateNaNYear2 : function() {
                var date = "year-08-27";
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
            },

            testValidMMDDYYYYDateWithHyphen1 : function() {
                var date = "08-08-2008";
                if (suite.throwsException(date)) {
                    Assert.fail("Calendar rejected this value : " + date);
                }
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testValidMMDDYYYYDateWithHyphen2 : function() {
                var date = "12-31-2048";
                if (suite.throwsException(date)) {
                    Assert.fail("Calendar rejected this value : " + date);
                }
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testValidMMDDYYYYDateWithSlash1 : function() {
                var date = "08/08/2008";
                if (suite.throwsException(date)) {
                    Assert.fail("Calendar rejected this value : " + date);
                }
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testValidMMDDYYYYDateWithSlash2 : function() {
                var date = "12/31/2048";
                if (suite.throwsException(date)) {
                    Assert.fail("Calendar rejected this value : " + date);
                }
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testValidYYYYMMDDateWithHyphen1 : function() {
                var date = "2008-08-08";
                if (suite.throwsException(date)) {
                    Assert.fail("Calendar rejected this value : " + date);
                }
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testValidYYYYMMDDDateWithHyphen2 : function() {
                var date = "2048-12-31";
                if (suite.throwsException(date)) {
                    Assert.fail("Calendar rejected this value : " + date);
                }
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testValidYYYYMMDDDateWithSlash1 : function() {
                var date = "2008/08/08";
                if (suite.throwsException(date)) {
                    Assert.fail("Calendar rejected this value : " + date);
                }
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testValidYYYYMMDDDateWithSlash2 : function() {
                var date = "2048/12/31";
                if (suite.throwsException(date)) {
                    Assert.fail("Calendar rejected this value : " + date);
                }
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testMultipleDifferentValidDates : function() {
                var date = "2008-08-08";
                Assert.isTrue(suite.testCalendar.setValue(date));
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
                date = "2048-12-31"
                Assert.isTrue(suite.testCalendar.setValue(date));
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testMultipleSameValidDates : function() {
                var date = "2008-08-08";
                Assert.isTrue(suite.testCalendar.setValue(date));
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
                Assert.isFalse(suite.testCalendar.setValue(date));
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testInvalidThenValidDates : function() {
                var date = "some-text-string";
                if (!suite.throwsException(date)) {
                    Assert.fail("Calendar accepted this value : " + date);
                }
                date = "2048-12-31"
                Assert.isTrue(suite.testCalendar.setValue(date));
                Assert.areEqual(date, suite.testCalendar.currentCalendarValue());
            },

            testValidThenInvalidDates : function() {
                var validdate = "2008-08-08";
                var invaliddate = "is-no-date";
                Assert.isTrue(suite.testCalendar.setValue(validdate));
                Assert.areEqual(validdate, suite.testCalendar.currentCalendarValue());
                if (!suite.throwsException(invaliddate)) {
                    Assert.fail("Calendar accepted this value : " + invaliddate);
                }
                Assert.areEqual(validdate, suite.testCalendar.currentCalendarValue());
            }

        })//new TestCase
    ); //suite.add( ... )

    YAHOO.tool.TestRunner.add(suite);
}());
