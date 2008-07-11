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
    if (!this.args) {
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

FunctionCallExpr.prototype.xpathfunctions["avg"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["min"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["max"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["count-non-empty"] = ThrowNotImpl;

/**
@addon
*/
FunctionCallExpr.prototype.xpathfunctions["index"] = function(ctx) {
	var s =  this.args[0].evaluate(ctx).stringValue();
	var oRpt = document.getElementById(s);

  return new NumberValue(oRpt.getIndex());
};

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
FunctionCallExpr.prototype.xpathfunctions["random"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["compare"] = ThrowNotImpl;

//	http://www.w3.org/TR/xforms11/#expr-lib-string

/**@addon*/
FunctionCallExpr.prototype.xpathfunctions["if"] = function(ctx) {
	var bIf = this.args[0].evaluate(ctx).booleanValue();
	if (bIf)	{
		return new StringValue(this.args[1].evaluate(ctx).stringValue());
	}	else {
		return new StringValue(this.args[2].evaluate(ctx).stringValue());
	}
};

FunctionCallExpr.prototype.xpathfunctions["property"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["digest"] = ThrowNotImpl;
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

/**@addon*/
FunctionCallExpr.prototype.xpathfunctions["days-from-date"] = function(ctx) {
	var sDate = this.args[0].evaluate(ctx).stringValue();
	var dDate = null;
	//if date is of format 1970-01-01, JavaScript Date.parse cannot handle it, unfortunately, as well as being the best format for dates anyway,
	//    this is also the prescribed format for xml dates.
	if (sDate.match(/[0-9]{4}\-[0-9]{2}\-[0-9]{2}/)) {
	                //The easiest way to deal with this is to replace '-' with ',', and eval a constructor of the form Date(yearNum,MonthNum,DayNum);
		var sCommaDate = sDate.replace(/\-/g,",").substr(0,10);
		dDate = eval("new Date("+ sCommaDate  +")");
	}	else {	
	            //If the date is not in the above format, let Date.parse handle it, if it is a screwy date, not our problem.
		dDate = new Date(sDate);
	}
	var dOrigin = new Date(1970,1,1);
	var diff = dDate-dOrigin;
	
	return new NumberValue(Math.floor(diff/86400000));
};

FunctionCallExpr.prototype.xpathfunctions["days-to-date"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["seconds-from-dateTime"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["seconds-to-dateTime"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["adjust-dateTime-to-timezone"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["seconds"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["months"] = ThrowNotImpl;

//	http://www.w3.org/TR/xforms11/#expr-lib-nodeset

/**
@addon
	http://www.w3.org/TR/xforms11/#fn-instance
	@throws String if the first instance with the given id in doecument order is not inside the context model. 
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

	var bIf = this.args[0].evaluate(ctx).booleanValue();
    var oOne = this.args[1].evaluate(ctx);
    var oTwo = this.args[2].evaluate(ctx);
	if (bIf) {
		return oOne;
	}	else {
		return oTwo;
	}
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
