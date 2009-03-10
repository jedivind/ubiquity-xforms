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

/**
 * function: isRFC822ValidEmail(sEmail)
 * JavaScript function to check an email address conforms to RFC822 (http://www.ietf.org/rfc/rfc0822.txt)
 *
 * Version: 0.2
 * Author: Ross Kendall
 * Created: 2006-12-16
 * Updated: 2007-03-22
 *
 * Based on the PHP code by Cal Henderson
 * http://iamcal.com/publish/articles/php/parsing_email/
 * Portions copyright (C) 2006  Ross Kendall - http://rosskendall.com
 * Portions copyright (C) 1993-2005 Cal Henderson - http://iamcal.com
 * Licensed under GNU General Public License
 */
function isRFC822ValidEmail(sEmail) {
	var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
	var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
	var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
	var sQuotedPair = '\\x5c[\\x00-\\x7f]';
	var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
	var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
	var sDomain_ref = sAtom;
	var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
	var sWord = '(' + sAtom + '|' + sQuotedString + ')';
	var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
	var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
	var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
	var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

	var reValidEmail = new RegExp(sValidEmail);

	if (reValidEmail.test(sEmail)) {
		return true;
	}

	return false;
}

function isCardNumber(sNum) {
	return (
        sNum.match(/^\d*[0-9]?$/) &&
        sNum.length >= 12 &&
        sNum.length <= 19
    );
}

function isValidDateTime(sDateTime) {
    return (
        sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/) ||
        sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}Z$/) ||
        sDateTime.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}[+-][0-9]{2}\:[0-9]{2}$/)
    );
}

function isValidTime(sTime) {
    return (
        sTime.match(/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}$/) ||
        sTime.match(/^[0-9]{2}\:[0-9]{2}\:[0-9]{2}[+-][0-9]{2}\:[0-9]{2}$/)
    );
}

function isValidDate(sDate) {
    return (
        sDate.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/) ||
        sDate.match(/^[0-9]{4}\-[0-9]{2}\-[0-9]{2}[+-][0-9]{2}\:[0-9]{2}$/)
    );
}

function isValidGYearMonth(sGYearMonth) {
    return (
        sGYearMonth.match(/^[0-9]{4}\-[0-9]{2}$/)
    );
}

function isValidGYear(sGYear) {
    return (
        sGYear.match(/^[0-9]{4}$/)
    );
}

function isValidGMonthDay(sGMonthDay) {
    return (
        sGMonthDay.match(/^\-\-[0-9]{2}\-[0-9]{2}$/)
    );
}

function isValidGDay(sGDay) {
    return (
        sGDay.match(/^\-\-\-[0-9]{2}$/)
    );
}

function isValidGMonth(sGMonth) {
    return (
        sGMonth.match(/^\-\-[0-9]{2}$/)
    );
}

function isValidBase64Binary(sBase64) {
    return (
        sBase64.match(/^[a-zA-Z0-9\+\/\=]+$/)
    );
}

function isValidNCName(sNCName) {
    // NCName           ::=    NCNameStartChar NCNameChar* /* An XML Name, minus the ":" */ 
    // NCNameChar       ::=    NameChar - ':' 
    // NCNameStartChar  ::=    Letter | '_'  
    // NameChar         ::=    Letter | Digit | '.' | '-' | '_' | ':' | CombiningChar | Extender  

    return (
        sNCName.match(/^[_a-z][\w\.\-]*$/i)
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
    var i, s;

    // The '%' escape character must be followed by a two digit hex number.
    for (i = 0; i < sURI.length; i++) {
        if (sURI.charAt(i) === "%") {
            s = sURI.substr(i + 1, 2);
            if (s && isNaN(parseInt(s, 16))) {
                return false;
            }
        }
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
    return (sValue === 'INF' || sValue === '-INF' || sValue === 'NaN');
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
		        return isValidGMonth(sValue);
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
		        return (sValue === "true" || sValue === "false"
		                || sValue === "1" || sValue === "0");
	        }
        },

        "base64Binary" : {
	        validate : function(sValue) {
		        return isValidBase64Binary(sValue);
	        }
        },

        "hexBinary" : {
	        validate : function(sValue) {
		        return (isNaN(parseInt(sValue, 16)) === false);
	        }
        },

        "float" : {
	        validate : function(sValue) {
                if (isInfinityOrNaN(sValue)) {
                    return true;
                } else {
                    return (isNaN(parseFloat(sValue)) === false);
                }
	        }
        },

        "decimal" : {
	        validate : function(sValue) {
		        return (isNaN(parseInt(sValue)) === false);
	        }
        },

        "double" : {
	        validate : function(sValue) {
                if (isInfinityOrNaN(sValue)) {
                    return true;
                } else {
                    return (isNaN(parseFloat(sValue)) === false);
                }
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
	        }
        },

        "dayTimeDuration" : {
	        validate : function(sValue) {
		        return isNaN(evalXPathFunc("seconds", [sValue]).numberValue()) === false;
	        }
        },

        "yearMonthDuration" : {
	        validate : function(sValue) {
		        var sExpr = "months(" + "'" + sValue + "')";
		        return isNaN(evalXPathFunc("months", [sValue]).numberValue()) === false;
	        }
        },

        "email" : {
	        validate : function(sValue) {
		        return isRFC822ValidEmail(sValue);
	        }
        },

        "card-number" : {
	        validate : function(sValue) {
		        return isCardNumber(sValue);
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
		        return (sValue === "true" || sValue === "false"
		                || sValue === "1" || sValue === "0");
	        }
        },

        "base64Binary" : {
	        validate : function(sValue) {
		        return isValidBase64Binary(sValue);
	        }
        },

        "hexBinary" : {
	        validate : function(sValue) {
		        return (isNaN(parseInt(sValue, 16)) === false);
	        }
        },

        "float" : {
	        validate : function(sValue) {
                if (isInfinityOrNaN(sValue)) {
                    return true;
                } else {
                    return (isNaN(parseFloat(sValue)) === false);
                }
	        }
        },

        "decimal" : {
	        validate : function(sValue) {
		        return (isNaN(parseInt(sValue)) === false);
	        }
        },

        "double" : {
	        validate : function(sValue) {
                if (isInfinityOrNaN(sValue)) {
                    return true;
                } else {
                    return (isNaN(parseFloat(sValue)) === false);
                }
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
		    } else {
			    throw "unsupported built-in datatype ";
		    }
	    } else {
		    throw "data validation is not supported for " + namespace;
	    }
	    return false;
    }
};

Validator.addRules(xformsRules);
Validator.addRules(xmlSchemaRules);
