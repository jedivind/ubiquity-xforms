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

//	http://www.w3.org/TR/xforms11/#expr-lib-bool

/**@addon
	http://www.w3.org/TR/xforms11/#fn-boolean-from-string
*/
FunctionCallExpr.prototype.xpathfunctions["boolean-from-string"] = function(ctx) {
	var s = this.args[0].evaluate(ctx).stringValue();

	s = s.trim();
	return new BooleanValue((s.toLowerCase() === "true") || (s === "1"));
};

FunctionCallExpr.prototype.xpathfunctions["is-card-number"] = ThrowNotImpl;


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
  if (this.args.length != 2)
    return new NumberValue(NaN);

  var a = this.args[0].evaluate(ctx).numberValue();
  var b = this.args[1].evaluate(ctx).numberValue();

  return new NumberValue(Math.pow(a, b));
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

FunctionCallExpr.prototype.xpathfunctions["local-date"] = ThrowNotImpl;
FunctionCallExpr.prototype.xpathfunctions["local-dateTime"] = ThrowNotImpl;

/**@addon*/
FunctionCallExpr.prototype.xpathfunctions["now"] = function(ctx) {
	var oRet = "";
	var d = new Date();
	var s = "";
	var x;

	/*
	 * Put the year first.
	 */

	s += d.getFullYear() + "-";

	// If the month is less than ten give it a leading zero.	

	x = d.getMonth() + 1;
	if (x < 10)
		x = "0" + x;
	s += x + "-";

	// Similarly, if the date is less than ten give it a leading zero.

	x = d.getDate();
	if (x < 10)
		x = "0" + x;
	s += x;
	
	// The date is separate from the time with a 'T'.
	
	s += "T"

	// Get the hours, minutes, and seconds, again adding leading zeros if necessary.	 

	x = d.getHours();
	if (x < 10){
		x = "0" + x;
	}
	s += x + ":";
	
	x = d.getMinutes();
	if (x < 10){
		x = "0" + x;
	}
	s += x + ":";

	x = d.getSeconds();
	if (x < 10){
		x = "0" + x;
	}
	s += x;

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

FunctionCallExpr.prototype.xpathfunctions["choose"] = ThrowNotImpl;
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
