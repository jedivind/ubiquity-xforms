/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function isValidEmail(sEmail) {
    return (
        sEmail.match(/^([A-Za-z0-9!#-'\*\+\-\/=\?\^_`\{-~]+(\.[A-Za-z0-9!#-'\*\+\-\/=\?\^_`\{-~]+)*@[A-Za-z0-9!#-'\*\+\-\/=\?\^_`\{-~]+(\.[A-Za-z0-9!#-'\*\+\-\/=\?\^_`\{-~]+)*)?$/) ? true : false
    );
}

function isValidCardNumber(sNum) {
    return (
        sNum.match(/^\d*[0-9]?$/) &&
        sNum.length >= 12 &&
        sNum.length <= 19 ? true : false
    );
}

function isValidDateTime(sDateTime) {
    return (
        sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/) ||
        sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}Z$/) ||
        sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}[+-][0-9]{2}\:[0-9]{2}$/) ? true : false
    );
}

function isValidTime(sTime) {
    return (
        sTime.match(/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/) ||
        sTime.match(/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}[+-][0-9]{2}\:[0-9]{2}$/) ? true : false
    );
}

function isValidDate(sDate) {
    return (
        sDate.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/) ||
        sDate.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}[+-][0-9]{2}\:[0-9]{2}$/) ? true : false
    );
}

function isValidGYearMonth(sGYearMonth) {
    return (
        sGYearMonth.match(/^[0-9]{4}\-[0-9]{2}$/) ? true : false
    );
}

function isValidGYear(sGYear) {
    return (
        sGYear.match(/^[0-9]{4}$/) ? true : false
    );
}

function isValidGMonthDay(sGMonthDay) {
    return (
        sGMonthDay.match(/^\-\-[0-9]{2}\-[0-9]{2}$/) ? true : false
    );
}

function isValidGDay(sGDay) {
    return (
        sGDay.match(/^\-\-\-[0-9]{2}$/) ? true : false
    );
}

function isValidGMonth(sGMonth) {
    return (
        sGMonth.match(/^\-\-[0-9]{2}$/) ? true : false
    );
}

function isValidBase64Binary(sBase64) {
    return (
        sBase64.match(/^[a-zA-Z0-9\+\/\=]+$/) ? true : false
    );
}

function isValidHexBinary(sHexBinary) {
    return (
        sHexBinary.match(/^[0-9a-fA-F]+$/) ? true : false
    );
}

function isValidNCName(sNCName) {
    // NCName           ::=    NCNameStartChar NCNameChar* /* An XML Name, minus the ":" */ 
    // NCNameChar       ::=    NameChar - ':' 
    // NCNameStartChar  ::=    Letter | '_'  
    // NameChar         ::=    Letter | Digit | '.' | '-' | '_' | ':' | CombiningChar | Extender  

    return (
        sNCName.match(/^[_a-z][\w\.\-]*$/i) ? true : false
    );
}

function isValidAnyURI(sURI) {
   var i, c, match, encodedURI = "";

   // Escape non-ascii and disallowed ascii characters. Disallowed characters
   // are: control characters (0-31 and 127), space (32), double quote (34),
   // '<' (60), '>' (62), '[' (91), '\' (92), ']' (93), '^' (94), '`' (96),
   // '{' (123), '|' (124), and '}' (125).
   for (i = 0; i < sURI.length; i++) {
       c = sURI.charCodeAt(i);
       if (((c >= 0 && c <= 31) || c === 127) || (c === 32) || 
           (c === 34) || (c === 60) || (c === 62) || (c === 91) ||
           (c === 92) || (c === 93) || (c === 94) || (c === 96) ||
           (c === 123) || (c === 124) || (c === 125) || (c > 127)) {
           encodedURI += (encodeURIComponent(String.fromCharCode(c)));
       } else {
           encodedURI += (String.fromCharCode(c));
       }
   }

   match = encodedURI.match(/^(([^:\/?#]+):)?(\/\/([^\/\?#]*))?([^\?#]*)(\?([^#]*))?(#([^\:#\[\]\@\!\$\&\\'\(\)\*\+\,\;\=]*))?$/);
   return match ? _isValidAnyURI(match[0]) : false;
}

function _isValidAnyURI(sURI) {
    var ixPercent, s;

    // The '%' escape character must be followed by a two digit hex number.
    ixPercent = sURI.indexOf("%");
    while (ixPercent !== -1) {
        s = sURI.substr(ixPercent);
        if (s.length < 3 || !s.substr(ixPercent + 1, 2).match(/^[0-9a-fA-F]$/)) {
                return false;
        }
        s = s.substr(ixPercent + 3);
        ixPercent = s.indexOf("%");
    }
    return true;
}

function isValidQName(sQName) {
    // QName ::=  (Prefix ':')? LocalPart 
    // Prefix ::=  NCName 
    // LocalPart ::=  NCName 
    var arrSegments, prefix, localPart;
    
    arrSegments = sQName.split(":");
    prefix = arrSegments.length === 1 ? "" : arrSegments[0];
    localPart = arrSegments.length ===1 ? arrSegments[0] : arrSegments[1];

    return prefix ? isValidNCName(prefix) && isValidNCName(localPart) : isValidNCName(localPart);
}

function isInfinityOrNaN(sValue) {
    return (
        sValue === 'INF' || sValue === '-INF' || sValue === 'NaN'
    );
}

function isValidBoolean(sBoolean) {
    return (
        sBoolean === "true" || sBoolean === "false" || sBoolean === "1" || sBoolean === "0"
    );
}

function isValidInteger(sInteger) {
    return (
        sInteger.match(/^[-+]?[0-9]+$/) ? true : false
    );
}

function isValidPositiveInteger(sInteger) {
    return (
        sInteger.match(/^[+]?0*[1-9][0-9]*$/) ? true : false
    );
}

function isValidFloat(sFloat) {
    if (isInfinityOrNaN(sFloat)) {
        return true;
    } else {
        return (
            sFloat.match(/^[-+]?0*[1-9][0-9]*([\.]{1}[0-9]+)?([eE]{1}[-+]?[0-9]+)?$/) ? true : false
        );
    }
}

function isValidDouble(sDouble) {
    return isValidFloat(sDouble);
}

function isValidDecimal(sDecimal) {
    return (
        sDecimal.match(/^[-+]?0*[1-9][0-9]*([\.]{1}[0-9]+)?$/) ? true : false
    );
}

function evalXPathFunc(func, args, ctx) {
	var funcName = new StringValue(func);
	var argToken =  null; 
		
	var ret = new FunctionCallExpr(funcName);

	for (var i = 0; i < args.length; ++i) {
		argToken = new TokenExpr(args[i]);
	    ret.appendArg(argToken);
	}
	return ret.evaluate(ctx);	
}

var xformsRules = {
    namespace: "http://www.w3.org/2002/xforms",
    rules : {
        "dateTime" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidDateTime(sValue);
	        }
        },

        "time" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidTime(sValue);
	        }
        },

        "date" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidDate(sValue);
	        }
        },

        "gYearMonth" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidGMonth(sValue);
	        }
        },

        "gYear" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidGYear(sValue);
	        }
        },

        "gMonthDay" : {
	        validate : function(sValue) {
		        return sValue == "" || isValidGMonthDay(sValue);
	        }
        },

        "gDay" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidGDay(sValue);
	        }
        },

        "gMonth" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidGMonth(sValue);
	        }
        },

        "string" : {
	        validate : function(sValue) {
		        return true;
	        }
        },

        "boolean" : {
	        validate : function(sValue) {
                return sValue === "" || isValidBoolean(sValue);
	        }
        },

        "base64Binary" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidBase64Binary(sValue);
	        }
        },

        "hexBinary" : {
	        validate : function(sValue) {
                return sValue === "" || isValidHexBinary(sValue);
	        }
        },

        "integer" : {
	        validate : function(sValue) {
                return sValue === "" || isValidInteger(sValue);
	        }
        },

        "positiveInteger" : {
	        validate : function(sValue) {
                return sValue === "" || isValidPositiveInteger(sValue);
	        }
        },

        "float" : {
	        validate : function(sValue) {
                return sValue === "" || isValidFloat(sValue);
	        }
        },

        "decimal" : {
	        validate : function(sValue) {
                return sValue === "" || isValidDecimal(sValue);
	        }
        },

        "double" : {
	        validate : function(sValue) {
                return sValue === "" || isValidDouble(sValue);
	        }
        },

        "anyURI" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidAnyURI(sValue);
	        }
        },

        "QName" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidQName(sValue);
	        }
        },

        "dayTimeDuration" : {
	        validate : function(sValue) {
		        return sValue === "" || isNaN(evalXPathFunc("seconds", [sValue]).numberValue()) === false;
	        }
        },

        "yearMonthDuration" : {
	        validate : function(sValue) {
		        var sExpr = "months(" + "'" + sValue + "')";
		        return sValue === "" || isNaN(evalXPathFunc("months", [sValue]).numberValue()) === false;
	        }
        },

        "email" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidEmail(sValue);
	        }
        },

        "card-number" : {
	        validate : function(sValue) {
		        return sValue === "" || isValidCardNumber(sValue);
	        }
        }
    }
};

var xmlSchemaRules = {
    namespace : "http://www.w3.org/2001/XMLSchema",
    rules : {
        "dateTime" : {
	        validate : function(sValue) {
		        return isValidDateTime(sValue);
	        }
        },

        "time" : {
	        validate : function(sValue) {
		        return isValidTime(sValue);
	        }
        },

        "date" : {
	        validate : function(sValue) {
		        return isValidDate(sValue);
	        }
        },

        "gYearMonth" : {
	        validate : function(sValue) {
		        return isValidGYearMonth(sValue);
	        }
        },

        "gYear" : {
	        validate : function(sValue) {
		        return isValidGYear(sValue);
	        }
        },

        "gMonthDay" : {
	        validate : function(sValue) {
		        return isValidGMonthDay(sValue);
	        }
        },

        "gDay" : {
	        validate : function(sValue) {
		        return isValidGDay(sValue);
	        }
        },

        "gMonth" : {
	        validate : function(sValue) {
		        return isValidGMonth(sValue);
	        }
        },

        "string" : {
	        validate : function(sValue) {
		        return true;
	        }
        },

        "boolean" : {
	        validate : function(sValue) {
		        return isValidBoolean(sValue);
	        }
        },

        "base64Binary" : {
	        validate : function(sValue) {
		        return isValidBase64Binary(sValue);
	        }
        },

        "hexBinary" : {
	        validate : function(sValue) {
		        return isValidHexBinary(sValue);
	        }
        },

        "integer" : {
	        validate : function(sValue) {
                return isValidInteger(sValue);
	        }
        },

        "positiveInteger" : {
	        validate : function(sValue) {
                return isValidPositiveInteger(sValue);
	        }
        },

        "float" : {
	        validate : function(sValue) {
                return isValidFloat(sValue);
	        }
        },

        "decimal" : {
	        validate : function(sValue) {
		        return isValidDecimal(sValue);
	        }
        },

        "double" : {
	        validate : function(sValue) {
                return isValidDouble(sValue);
	        }
        },

        "anyURI" : {
	        validate : function(sValue) {
		        return isValidAnyURI(sValue);
	        }
        },

        "QName" : {
	        validate : function(sValue) {
		        return isValidQName(sValue);
		        return true;
	        }
        }
    }
};

var Validator = {
	nsRules: {},

    addRules: function(vRules) {
    	this.nsRules[vRules.namespace] = vRules;
    },

    removeRules : function(namespace) {
    	var nsRules = this.nsRules;
	    var len = nsRules.length;
	    var idx;

	    for (idx = 0; idx < len; idx++) {
		    if (nsRules[idx].namespace === namespace) {
		    	nsRules.splice(idx, 1);
			    break;
		    }
	    }
    },

    validateValue : function(ns, datatype, value) {
	    var validator = null;
	    var validateRule = this.nsRules[ns];

	    if (validateRule) {
		    rule = validateRule.rules[datatype];
		    if (rule && rule.validate !== undefined) {
			    return rule.validate(value);
		    }
	    }
	    return false;
    }
};

Validator.addRules(xformsRules);
Validator.addRules(xmlSchemaRules);
