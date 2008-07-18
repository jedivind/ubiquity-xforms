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

/**@fileoverview
	implements the xforms-core function library as defined in http://www.w3.org/TR/xforms11/#expr-lib
	for Ubiquity XForms using the Google AJAXSLT XPath processor
	@requires FunctionCallExpr  defined in ajaxslt/xpath.js
*/


/**@addon
	trim is required by some of these XPath functions to produce a correct response.
*/
String.prototype.trim=function() {
    return this.replace(/^\s*|\s*$/g,'');
};

function ThrowNotImpl(ctx) {
	throw "Not Implemented";
}

/**
	Retrieves the current date and time.
	
	@param {Object} oDate, a Javascript Date object.
	@param {boolean} bUTC, if true use UTC time; otherwise, local time.
	@returns {string} Date and time in xsd:dateTime format.
*/
function getDateTime(oDate, bUTC) {
	var s = "";
	var year, month, day, hours, minutes, seconds;

    if (bUTC) {
        year = oDate.getUTCFullYear();
        month = oDate.getUTCMonth() + 1;
        day = oDate.getUTCDate();
        hours = oDate.getUTCHours();
        minutes = oDate.getUTCMinutes();
        seconds = oDate.getUTCSeconds();
    } else {
        year = oDate.getFullYear();
        month = oDate.getMonth() + 1;
        day = oDate.getDate();
        hours = oDate.getHours();
        minutes = oDate.getMinutes();
        seconds = oDate.getSeconds();
    }

    /*
	 * Put the year first.
	 */
	s += year + "-";

	// If the month is less than ten give it a leading zero.	
	if (month < 10)
		month = "0" + month;
	s += month + "-";

	// Similarly, if the date is less than ten give it a leading zero.
	if (day < 10)
		day = "0" + day;
	s += day;
	
	// The date is separate from the time with a 'T'.
	
	s += "T"

	// Get the hours, minutes, and seconds, again adding leading zeros if necessary.	 
	if (hours < 10) {
		hours = "0" + hours;
	}
	s += hours + ":";

	if (minutes < 10){
		minutes = "0" + minutes;
	}
	s += minutes + ":";

	if (seconds < 10){
		seconds = "0" + seconds;
	}
	s += seconds;

    if (bUTC) {
        s += "Z";
    }

    return s;
}

/**
	Calculates the local time zone offset from UTC time.
	
	@param {Object} oDate, a Javascript Date object.
	@returns {string} Time zone offset in (('+' | '-') hh ':' mm) format.
*/
function getTZOffset(oDate) {
    var s = "";
    var tz = oDate.getTimezoneOffset();

    if (tz < 0) {
        s += "+";
        tz *= -1;
    } else {
        s += "-";
    }

    var hours = tz / 60;
    if (hours < 10) {
        hours = "0" + hours;
    }
    s += hours + ":";

    var minutes = tz % 60;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    s += minutes;

    return s;
}

/**
	Determine if a given string is a valid xsd:date.
	
	@param {string} sDate, the date to validate.
	@returns {boolean} True if valid xsd:date, otherwise false.
*/
function isValidDate(sDate) {
    if (sDate.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/) ||
        sDate.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}[+-][0-9]{2}\:[0-9]{2}$/)) {
        return true;
    }

    return false;
}

/**
	Determine if a given string is a valid xsd:dateTime.
	
	@param {string} sDateTime, the dateTime to validate.
	@returns {boolean} True if valid xsd:dateTime, otherwise false.
*/
function isValidDateTime(sDateTime) {
    if (sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/) ||
        sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}Z$/) ||
        sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}[+-][0-9]{2}\:[0-9]{2}$/)) {
        return true;
    }

    return false;
}

//	http://www.w3.org/TR/xforms11/#expr-lib-bool

/**@addon
	http://www.w3.org/TR/xforms11/#fn-boolean-from-string
*/
FunctionCallExpr.prototype.xpathfunctions["boolean-from-string"] = function(ctx) {
	var s = this.args[0].evaluate(ctx).stringValue();

	s = s.trim();
	return new BooleanValue((s.toLowerCase() === "true") || (s === "1"));
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-is-card-number
*/
FunctionCallExpr.prototype.xpathfunctions["is-card-number"] = function(ctx) {
    var sCardNum = "";
    if (!this.args || this.args.length == 0) {
        // default to the string value of the current context node.
        sCardNum = xmlValue(ctx.node);
    } else {
        sCardNum = this.args[0].evaluate(ctx).stringValue();
    }
    sCardNum = sCardNum.trim();

    // Check if the card number is a valid Luhn number.
    var sum = 0;
    var alt = false;

    for (var i = sCardNum.length - 1; i >= 0; --i) {
      var currentChar = sCardNum.charAt(i);
      if (currentChar < '0' || currentChar > '9') {
          return new BooleanValue(false);
      }
      var digit = currentChar - '0';

      if (alt) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      alt = !alt;
    }

    return new BooleanValue(sum % 10 == 0);
};

//	http://www.w3.org/TR/xforms11/#expr-lib-num

/**@addon
	http://www.w3.org/TR/xforms11/#fn-avg
*/
FunctionCallExpr.prototype.xpathfunctions["avg"] = function(ctx) {
    if (!this.args || this.args.length == 0) {
        return new NumberValue(NaN);
    }

    var n = this.args[0].evaluate(ctx).nodeSetValue();
    if (n.length == 0) {
        // Empty nodeset.
        return new NumberValue(NaN);
    }

    var sum = 0;
    for (var i = 0; i < n.length; ++i) {
        // Note that an empty string evaluates to zero.
        var num = xmlValue(n[i]) - 0;
        // If any node evaluates to NaN, the result is NaN.
        if (isNaN(num)) {
            return new NumberValue(NaN);
        }
        sum += num;
    }
    return new NumberValue(sum / n.length);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-min
*/
FunctionCallExpr.prototype.xpathfunctions["min"] = function(ctx) {
    if (!this.args || this.args.length == 0) {
        return new NumberValue(NaN);
    }

    var n = this.args[0].evaluate(ctx).nodeSetValue();
    if (n.length == 0) {
        // Empty nodeset.
        return new NumberValue(NaN);
    }

    var min = 0;
    for (var i = 0; i < n.length; ++i) {
        // Note that an empty string evaluates to zero.
        var num = xmlValue(n[i]) - 0;
        // If any node evaluates to NaN, the result is NaN.
        if (isNaN(num)) {
            return new NumberValue(NaN);
        }

        if (num < min) {
            min = num;
        }
    }
    return new NumberValue(min);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-max
*/
FunctionCallExpr.prototype.xpathfunctions["max"] = function(ctx) {
    if (!this.args || this.args.length == 0) {
        return new NumberValue(NaN);
    }

    var n = this.args[0].evaluate(ctx).nodeSetValue();
    if (n.length == 0) {
        // Empty nodeset.
        return new NumberValue(NaN);
    }

    var max = 0;
    for (var i = 0; i < n.length; ++i) {
        // Note that an empty string evaluates to zero.
        var num = xmlValue(n[i]) - 0;
        // If any node evaluates to NaN, the result is NaN.
        if (isNaN(num)) {
            return new NumberValue(NaN);
        }

        if (max < num) {
            max = num;
        }
    }
    return new NumberValue(max);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-count-non-empty
*/
FunctionCallExpr.prototype.xpathfunctions["count-non-empty"] = function(ctx) {
    if (!this.args || this.args.length == 0) {
        return new NumberValue(0);
    }

    var n = this.args[0].evaluate(ctx).nodeSetValue();
    if (n.length == 0) {
        // Empty nodeset.
        return new NumberValue(0);
    }

    var count = 0;
    for (var i = 0; i < n.length; ++i) {
        // A node is considered non-empty if it is convertible into a string
        // with a greater-than zero length. 
        var value = xmlValue(n[i]);
        if (value.length > 0) {
            count++;
        }
    }
    return new NumberValue(count);

};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-index
*/
FunctionCallExpr.prototype.xpathfunctions["index"] = function(ctx) {
	var s =  this.args[0].evaluate(ctx).stringValue();
	var oRpt = document.getElementById(s);

  return new NumberValue(oRpt.getIndex());
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-power
*/
FunctionCallExpr.prototype.xpathfunctions["power"] = function(ctx) {
  if (!this.args || (this.args.length != 2)) {
    return new NumberValue(NaN);
  }

  return new NumberValue(
    Math.pow(
      this.args[0].evaluate(ctx).numberValue(),
      this.args[1].evaluate(ctx).numberValue()
    )
  );
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-random
*/
FunctionCallExpr.prototype.xpathfunctions["random"] = function(ctx) {
    // Random() takes an optional boolean to specify whether or not the
    // random number generator should be seeded first, but javascript
    // will always seed the random number generator and doesn't allow one
    // to specify a seed.
    return new NumberValue(Math.random());
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-compare
*/
FunctionCallExpr.prototype.xpathfunctions["compare"] = function(ctx) {
    var result = NaN;
    if (this.args.length == 2) {
        var s1 = this.args[0].evaluate(ctx).stringValue();
        var s2 = this.args[1].evaluate(ctx).stringValue();

        if (s1 == s2) {
            result = 0;
        } else if (s1 > s2) {
            result = 1;
        } else {
            result = -1;
        }
    }
    return new NumberValue(result);
};

//	http://www.w3.org/TR/xforms11/#expr-lib-string

/**@addon
	http://www.w3.org/TR/xforms11/#fn-if
*/
FunctionCallExpr.prototype.xpathfunctions["if"] = function(ctx) {
	var bIf = this.args[0].evaluate(ctx).booleanValue();
	if (bIf)	{
		return new StringValue(this.args[1].evaluate(ctx).stringValue());
	}	else {
		return new StringValue(this.args[2].evaluate(ctx).stringValue());
	}
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-property
*/
FunctionCallExpr.prototype.xpathfunctions["property"] = function(ctx) {
	// This function can only have 1 parameter.
	if (!this.args || (this.args.length != 1)) {
    	return new StringValue("");
	}
	
	var property = this.args[0].evaluate(ctx).stringValue();

	// Check for common properties.
    var ret = "";
	if(property == "version") {
		ret = "1.1";
    } else if(property == "conformance-level") {
		ret = "basic";
    } else {
        // If the property is a valid NCName other than the common properties above we throw an exception.
        // NCName           ::=    NCNameStartChar NCNameChar* /* An XML Name, minus the ":" */ 
        // NCNameChar       ::=    NameChar - ':' 
        // NCNameStartChar  ::=    Letter | '_'  
        // NameChar         ::=    Letter | Digit | '.' | '-' | '_' | ':' | CombiningChar | Extender  

        var match = property.match(/^[_a-z][\w\.\-]*/i);
        if (match && match[0] == property) {
            // Matched the whole property string so it is a valid NCName.
            var evt = document.createEvent("Events");
            evt.initEvent("xforms-compute-exception", true, false);
            FormsProcessor.dispatchEvent(document.defaultModel,evt);
        }
    }

	return new StringValue(ret);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-digest
*/
FunctionCallExpr.prototype.xpathfunctions["digest"] = ThrowNotImpl;

/**@addon
	http://www.w3.org/TR/xforms11/#fn-hmac
*/
FunctionCallExpr.prototype.xpathfunctions["hmac"] = ThrowNotImpl;

//	http://www.w3.org/TR/xforms11/#expr-lib-date

/**@addon
	http://www.w3.org/TR/xforms11/#fn-local-date
*/
FunctionCallExpr.prototype.xpathfunctions["local-date"] = function(ctx) {
    var d = new Date();
    var s = getDateTime(d, false);

    // Strip off the time information and add the time zone offset to the date.
    s = s.substring(0, 10);
    s += getTZOffset(d);

	// Return the result as a string.
    return new StringValue(s);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-local-dateTime
*/
FunctionCallExpr.prototype.xpathfunctions["local-dateTime"] = function(ctx) {
    var d = new Date();
    var s = getDateTime(d, false);

    // Add the time zone offset to the dateTime.
    s += getTZOffset(d);

	// Return the result as a string.
    return new StringValue(s);
};

/**@addon*/
FunctionCallExpr.prototype.xpathfunctions["now"] = function(ctx) {
    var d = new Date();
	var s = getDateTime(d, true);

	// Return the result as a string.
	return new StringValue(s);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-days-from-date
*/
FunctionCallExpr.prototype.xpathfunctions["days-from-date"] = function(ctx) {
	if (!this.args || (this.args.length != 1)) {
    	return new NumberValue(NaN);
	}
	
    var sDate = this.args[0].evaluate(ctx).stringValue();

    // The return value is equal to the number of days difference between the specified date
    //  or dateTime (normalized to UTC) and 1970-01-01. Hour, minute, and second components
    //  are ignored after normalization. 
    var dDate = null;
    if (isValidDateTime(sDate)) {
        // Replace '-' with ',', and eval a constructor of the form Date(yearNum,MonthNum,DayNum);
        var sCommaDate = sDate.replace(/\-/g,",").substr(0,10);
        dDate = eval("new Date("+ sCommaDate  +")");

        // If a time zone is present, normalize the dateTime to UTC.
        if (sDate.length == 25) {
            var hours = parseInt(sDate.substr(11,2), 10);
            var minutes = parseInt(sDate.substr(14,2), 10);
            var seconds = parseInt(sDate.substr(17,2), 10);
            var tzSign = sDate.substr(19, 1);
            var tzHours = parseInt(sDate.substr(20,2), 10);
            var tzMinutes = parseInt(sDate.substr(23,2), 10);

            if (tzSign == "-") {
                hours += tzHours;
                minutes += tzMinutes;
            } else {
                hours -= tzHours;
                minutes -= tzMinutes;
            }
            dDate.setHours(hours, minutes, seconds);
        }
    } else if (isValidDate(sDate)) {
        // Replace '-' with ',', and eval a constructor of the form Date(yearNum,MonthNum,DayNum);
        var sCommaDate = sDate.replace(/\-/g,",").substr(0,10);
        dDate = eval("new Date("+ sCommaDate  +")");
    } else {
        return new NumberValue(NaN);
    }

	var dOrigin = new Date(1970,1,1);
	var diff = dDate - dOrigin;
	
	return new NumberValue(Math.floor(diff/86400000));
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-days-to-date
*/
FunctionCallExpr.prototype.xpathfunctions["days-to-date"] = function(ctx) {
	// This function can only have 1 parameter.
	if (!this.args || (this.args.length != 1)) {
    	return new StringValue("NaN");
	}

	// The parameter must be a number.
	var number = this.args[0].evaluate(ctx).numberValue();
	if(isNaN(number))
		return new StringValue("NaN");

	var days = Math.round(number) + 1;
	// Set the date the correct number of days away from 1970-01-01.
	var dOrigin = new Date();
	dOrigin.setTime(days * 86400000);
	
	// Make sure the date is displayed correctly.
    var month = dOrigin.getMonth() + 1;
	if (month < 10)
		month = "0" + month;

    var date = dOrigin.getDate();
     if (date < 10)
		date = "0" + date;
	
	// Return the date as a string.
	return new StringValue(dOrigin.getFullYear() + "-" + month + "-" + date);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-seconds-from-dateTime
*/
FunctionCallExpr.prototype.xpathfunctions["seconds-from-dateTime"] = function(ctx) {
	// This function can only have 1 parameter.
	if (!this.args || (this.args.length != 1)) {
    	return new NumberValue(NaN);
	}

	var sDate = this.args[0].evaluate(ctx).stringValue();

	// The date must be a valid xsd:dateTime.
    if (!isValidDateTime(sDate)) {
        return new NumberValue(NaN);
    }

    // Replace '-' with ',', and eval a constructor of the form Date(yearNum,MonthNum,DayNum);
    var sCommaDate = sDate.replace(/\-/g,",").substr(0,10);
    var dDate = eval("new Date("+ sCommaDate  +")");

    var hours = parseInt(sDate.substr(11,2), 10);
    var minutes = parseInt(sDate.substr(14,2), 10);
    var seconds = parseInt(sDate.substr(17,2), 10);

    // If a time zone is present, normalize the dateTime to UTC.
    if (sDate.length == 25) {
        var tzSign = sDate.substr(19, 1);
        var tzHours = parseInt(sDate.substr(20,2), 10);
        var tzMinutes = parseInt(sDate.substr(23,2), 10);

        if (tzSign == "-") {
            hours += tzHours;
            minutes += tzMinutes;
        } else {
            hours -= tzHours;
            minutes -= tzMinutes;
        }
    }

    dDate.setHours(hours, minutes, seconds);
    var dOrigin = new Date(1970,1,1);
	var diff = dDate - dOrigin;
	
	// Return the difference between the dates / 1000, which is the number of seconds away from 1970-01-01.
	return new NumberValue(Math.floor(diff/1000));
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-seconds-to-dateTime
*/
FunctionCallExpr.prototype.xpathfunctions["seconds-to-dateTime"] = function(ctx) {
	// This function can only have 1 parameter.
	if (!this.args || (this.args.length != 1)) {
    	return new StringValue("NaN");
	}
	// The parameter must be a number.
	var number = this.args[0].evaluate(ctx).numberValue();
	if(isNaN(number))
		return new StringValue("NaN");

	var seconds = Math.round(number);
	// Set the date the correct number of seconds away from 1970-01-01.
	var d = new Date();
	d.setTime(seconds * 1000);
	
	// Return the result as a string.
	return new StringValue(getDateTime(d, true));
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-adjust-dateTime-to-timezone
*/
FunctionCallExpr.prototype.xpathfunctions["adjust-dateTime-to-timezone"] = function(ctx) {
	// This function can only have 1 parameter.
	if (!this.args || (this.args.length != 1)) {
    	return new StringValue("");
	}
	var sDate = this.args[0].evaluate(ctx).stringValue();

    // sDate must be a valid xsd:dateTime.
    if (!isValidDateTime(sDate)) {
        return new StringValue("");
    }

    // Create a JS Date from the xsd:dateTime.
    var year = parseInt(sDate.substr(0, 4), 10);
    var month = parseInt(sDate.substr(5, 2), 10) - 1;
    var day = parseInt(sDate.substr(8, 2), 10);
    var hours = parseInt(sDate.substr(11,2), 10);
    var minutes = parseInt(sDate.substr(14,2), 10);
    var seconds = parseInt(sDate.substr(17,2), 10);
    var dDate = new Date(year, month, day, hours, minutes, seconds);

    // Get the date in milliseconds so we can adjust for the time zone offset.
    var time = dDate.getTime();

    // Get the local timezone offset from a local date.
    var localDate = new Date();
    var tzOffset = localDate.getTimezoneOffset();

    // If a time zone is present, adjust the time zone offset to account
    // for the difference between the input timezone and the local timezone.
    if (sDate.length == 25) {
        var tzSign = sDate.substr(19, 1);
        var tzHours = parseInt(sDate.substr(20,2), 10);
        var tzMinutes = parseInt(sDate.substr(23,2), 10);
        var tz = tzHours * 60 + tzMinutes;
        if (tzSign == "-") {
            tz *= -1;
        }

        tzOffset += tz;
    }
    
    // Convert the time zone offset to milliseconds and adjust the date.
    if (tzOffset < 0) {
        time += (tzOffset * 60 * 1000);
    } else {
        time -= (tzOffset * 60 * 1000);
    }
    dDate.setTime(time);

    // Convert the date to xsd:dateTime format.
    var s = getDateTime(dDate, false);
    // Add the time zone offset string for the local time zone to the xsd:dateTime.
    s += getTZOffset(localDate);

	// Return the result as a string.
	return new StringValue(s);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-seconds
*/
FunctionCallExpr.prototype.xpathfunctions["seconds"] = function(ctx) {
	// This function can only have 1 parameter.
	if (!this.args || (this.args.length != 1)) {
    	return new NumberValue(NaN);
	}

	// Initialize variables.
	var duration = this.args[0].evaluate(ctx).stringValue();
	var totalSeconds = 0;
	var index = 0;
	var endingIndex = 0;
	var length = 0;
	var durationIsNegative = false;
	
	// A valid duration begins with 'P' or '-P'.
	if (!duration.match(/^P|\-P/)) {
		return new NumberValue(NaN);
	}
	// If the duration is negative, turn the durationIsNegative flag on and skip the "-" sign.
	if (duration.match(/^\-/)) {
		durationIsNegative = true;
		index++;
	}
	// If the duration has some days in it, ...
	if (duration.match(/D/)) {
		// If the duration has some years in it, ignore the years.
		if (duration.indexOf("Y") > 0 && duration.indexOf("Y") < duration.indexOf("D"))
			index = duration.indexOf("Y");
		// If the duration has some months in it, ignore the months.
		if (duration.indexOf("M") > 0 && duration.indexOf("M") < duration.indexOf("D"))
			index = duration.indexOf("M");
		// Calculate the number of days.
		endingIndex = duration.indexOf("D");
		length = endingIndex - index - 1;
		var days = duration.substr(index + 1, length);
		// Add the days to the totalSeconds and move to the next index.
		totalSeconds = totalSeconds + 60 * 60 * 24 * parseFloat(days);
		index = endingIndex;
	}
	// If the duration has some time in it, make the duration string only contain the time information,
	// so the M now stands for minutes (not months).
	if (duration.indexOf("T") != -1) {
		index = 0;
		duration = duration.substr(duration.indexOf("T"));
	}
	// If the duration has some hours in it, calculate the number of hours,
	// add them to the totalSeconds, and move to the next index.
	if (duration.match(/H/)) {
		endingIndex = duration.indexOf("H");
		length = endingIndex - index - 1;
		var hours = duration.substr(index + 1, length);
		totalSeconds = totalSeconds + 60 * 60 * parseFloat(hours);
		index = endingIndex;
	}
	// If the duration has some minutes in it, calculate the number of minutes,
	// add them to the totalSeconds, and move to the next index.
	if (duration.match(/M/) && duration.indexOf("T") == 0) {
		endingIndex = duration.indexOf("M");
		length = endingIndex - index - 1;
		var minutes = duration.substr(index + 1, length);
		totalSeconds = totalSeconds + 60 * parseFloat(minutes);
		index = endingIndex;
	}
	// If the duration has some seconds in it, calculate the number of seconds,
	// add them to the totalSeconds.
	if (duration.match(/S/)) {
		endingIndex = duration.indexOf("S");
		length = endingIndex - index - 1;
		var seconds = duration.substr(index + 1, length);
		totalSeconds = totalSeconds + parseFloat(seconds);
		index = endingIndex;
	}
	// If the durationIsNegative flag is on, make the totalSeconds negative.
	if (durationIsNegative) {
		totalSeconds = totalSeconds * -1;
	}
	
	// Return the total number of seconds.
	return new NumberValue(totalSeconds);
};

/**@addon
	http://www.w3.org/TR/xforms11/#fn-months
*/
FunctionCallExpr.prototype.xpathfunctions["months"] = function(ctx) {
	// This function can only have 1 parameter.
	if (!this.args || (this.args.length != 1)) {
    	return new NumberValue(NaN);
	}

	// Initialize variables.
	var duration = this.args[0].evaluate(ctx).stringValue();
	var totalMonths = 0;
	var index = 0;
	var endingIndex = 0;
	var length = 0;
	var durationIsNegative = false;
	
	// A valid duration begins with 'P' or '-P'.
	if (!duration.match(/^P|\-P/)) {
		return new NumberValue(NaN);
	}
	// If the duration is negative, turn the durationIsNegative flag on and skip the "-" sign.
	if (duration.match(/^\-/)) {
		durationIsNegative = true;
		index++;
	}
	// If the duration has some years in it, calculate the number of years,
	// add them to the totalMonths, and move to the next index.
	if (duration.match(/Y/)) {
		endingIndex = duration.indexOf("Y");
		length = endingIndex - index - 1;
		var years = duration.substr(index + 1, length);
		totalMonths = totalMonths + 12 * parseFloat(years);
		index = endingIndex;
	}
	// If the duration has some months in it, calculate the number of months,
	// add them to the totalMonths.
	if (duration.match(/M/)) {
		endingIndex = duration.indexOf("M");
		length = endingIndex - index - 1;
		var months = duration.substr(index + 1, length);
		if(duration.indexOf("T") < 0 || duration.indexOf("T") > endingIndex)
			totalMonths = totalMonths + parseFloat(months);
		index = endingIndex;
	}
	// If the durationIsNegative flag is on, make the totalMonths negative.
	if (durationIsNegative) {
		totalMonths = totalMonths * -1;
	}
	
	// Return the total number of months.
	return new NumberValue(totalMonths);
};

//	http://www.w3.org/TR/xforms11/#expr-lib-nodeset

/**
@addon
	http://www.w3.org/TR/xforms11/#fn-instance
	@throws String if the first instance with the given id in document order is not inside the context model. 
*/
FunctionCallExpr.prototype.xpathfunctions["instance"] = function(ctx) {
	var ret = null;
                
	if(ctx.currentModel) {
		try {
     	var sInstance = this.args[0].evaluate(ctx).stringValue();
			var oDom = ctx.currentModel.getInstanceDocument(sInstance);
			var oDE = oDom.documentElement;
			ret = new Array(oDE);
		} catch(e) {
			throw("XPath function: instance("+sInstance+") is not a member of  model " + ctx.currentModel.id );
		}
	}	else {
		throw("instance() executed without a current model");
	}

	if (this.args[1])	{
		alert(this.args.join('\n'));
	}

	return new NodeSetValue(ret);
};		

/**@addon
*/  

FunctionCallExpr.prototype.xpathfunctions["current"] = function(ctx) {
    return new NodeSetValue([ctx.OutermostContextNode]);
};

//	id is implemented by ajaxslt, but not in a manner conformant with XForms.
//FunctionCallExpr.prototype.xpathfunctions["id"] = ThrowNotImpl;

FunctionCallExpr.prototype.xpathfunctions["context"] = ThrowNotImpl;

//	http://www.w3.org/TR/xforms11/#expr-lib-object

/**@addon
	http://www.w3.org/TR/xforms11/#fn-choose
*/
FunctionCallExpr.prototype.xpathfunctions["choose"] = function(ctx) {
  // All parameters of an XPath function are evaluated, so the parameter that
  // is not returned by this function is still evaluated, and its result is
  // discarded by this function.
  if (!this.args || this.args.length != 3) {
      return null;
  }

  var p1 = this.args[1].evaluate(ctx);
  var p2 = this.args[2].evaluate(ctx);
  var result = (this.args[0].evaluate(ctx).booleanValue()) ? p1 : p2;
  var ret;

  switch (result.type) {
    case "string":
      ret =  new StringValue(result.stringValue());
      break;

    case "number":
      ret =  new NumberValue(result.numberValue());
      break;

    case "boolean":
      ret =  new BooleanValue(result.booleanValue());
      break;

    case "node-set":
      ret =  new NodeSetValue(result.nodeSetValue());
      break;

    default:
      throw "Unrecognised type in choose()";
      break;
  }
  return ret;
};

FunctionCallExpr.prototype.xpathfunctions["event"] = ThrowNotImpl;

/**
	This is a formsPlayer specific function to return any instance, regardless of the in-scope model,
	not part of the core function library
@addon*/
FunctionCallExpr.prototype.xpathfunctions["globalInstance"] = function(ctx) {
	var sInstance = this.args[0].evaluate(ctx).stringValue();
	var oInst = document.getElementById(sInstance);
	var ret = null;
	if (oInst)	{
		ret = new Array(oInst.getDocument().documentElement);
	}
	return new NodeSetValue(ret);
};
