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
	if (sNum.match(/^\d*[0-9]?$/)) {
		if(sNum.length >= 12 && sNum.length <= 19) {
			return true;
		}
	}
	return false;
}


function Validator() {
};


Validator.prototype.validateNodeSet = function(oNodeset, oContext) {
	var oNode = null;
	var oResult = null;
	var i = 0;

	if (oNodeset && oNodeset.length > 0) {
		oResult = new Array();

		// loop through all the nodes
		for (i = 0; i < oNodeset.length; i++) {
			oNode = oNodeset[i];
			oResult[i] = this.validateNode(oNode);
		}
	}
	return oResult;
};


Validator.prototype.validateNode = function(oNode, oContext) {
	var oType = this.getTypeAndNSFromNode(oNode);
	var sValue = xmlValue(oNode);
	return this.validate(oType, sValue, oContext);
};


Validator.prototype.validateValue = function(sType, sValue, oContext) {
	var oType = this._getNSType(sType);
	return this.validate(oType, sValue, oContext);	
};


Validator.prototype.validate = function(oType, sValue, oContext) {
	var bResult = false;
	if (oType.ns === "http://www.w3.org/2002/xforms" && oType.type !== null) {
		bResult = this._validateXFormsBulitinType(oType.type, sValue, oContext);
	} else if (oType.ns === "http://www.w3.org/2001/XMLSchema"
	        && oType.type !== null) {
		bResult = this._validateSchemaBulitinType(oType.type, sValue, oContext);
	}
	return bResult;
};


Validator.prototype.getTypeAndNSFromNode = function(oNode) {
	var oPN = null;
	var sType = NamespaceManager.getAttributeNS(oNode,
	        "http://www.w3.org/2001/XMLSchema-instance", "type");
	var sPrefix = null;
	var i = 0;

	// Check for proxy
	if (!sType) {
		oPN = oNode.m_proxy;

		if (oPN && oPN.datatype) {
			sType = oPN.datatype;
		} else {
			return {
			    ns :null,
			    type :null
			};
		}
	}

	return this._getNSType(sType);
};


Validator.prototype._getNSType = function(sType) {
	var oResult = { ns :null, type: null };
	var oPrefixXF =  NamespaceManager.getOutputPrefixesFromURI("http://www.w3.org/2002/xforms");
	var oPrefixXSD = NamespaceManager.getOutputPrefixesFromURI("http://www.w3.org/2001/XMLSchema");

	if (oPrefixXF) {
		for (i = 0; i < oPrefixXF.length; i++) {
			sPrefix = oPrefixXF[i];

			if (sType.lastIndexOf(sPrefix) === 0) {
				oResult.ns = "http://www.w3.org/2002/xforms";
				oResult.type = sType.substring(sPrefix.length + 1);
				return oResult;
			}
		}
	}

	if (oPrefixXSD) {
		for (i = 0; i < oPrefixXSD.length; i++) {
			sPrefix = oPrefixXSD[i];

			if (sType.lastIndexOf(sPrefix) === 0) {
				oResult.ns = "http://www.w3.org/2001/XMLSchema";
				oResult.type = sType.substring(sPrefix.length + 1);
				return oResult;
			}
		}
	}

	return oResult;
};


Validator.prototype._validateXFormsBulitinType = function(sType, sValue, oContext) {
	var sExpr = null;
	var bResult = false;
	
	switch (sType) {
	case "dayTimeDuration":
		sExpr = "seconds(" + "'" + sValue + "')";
		bResult = isNaN(xpathDomEval(sExpr, oContext).numberValue()) === false;
		break;
	case "yearMonthDuration":
		sExpr = "months(" + "'" + sValue + "')";
		bResult = isNaN(xpathDomEval(sExpr, oContext).numberValue()) === false;
		break;
	case "email":
		bResult = isRFC822ValidEmail(sValue);
		break;
	case "card-number":
		bResult = isCardNumber(sValue);
		break;
	default:
		throw "unsupported xforms type";
	}
	return bResult;
};


Validator.prototype._validateSchemaBulitinType = function(sType, sValue, oContext) {
	// TODO
};