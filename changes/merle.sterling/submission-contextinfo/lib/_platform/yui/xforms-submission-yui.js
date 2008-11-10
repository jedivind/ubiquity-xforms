/*
 * Copyright (C) 2008 Backplane Ltd.
 *
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

/*
 * [TODO] Could probably turn this into one object. 
 */

callback.prototype.success = function(o)
{
    var result = this.processResponse(o, false);
	this.processResult(result, false); 
}

callback.prototype.failure = function(o)
{
    var result = this.processResponse(o, true);
	this.processResult(result, true); 
}

submission.prototype.request = function(sMethod, sAction, sBody, nTimeout, oCallback)
{
	if (nTimeout)
		oCallback.timeout = nTimeout;

    this.m_resourceURI = sAction;

	return YAHOO.util.Connect.asyncRequest(
		sMethod,
		sAction,
		oCallback,
		sBody
	);
}

submission.prototype.processResponse = function(oResponse, isFailure)
{
    // Process the response and create the context info object for
    // the xforms-submit-done or xforms-submit-error events.
    // Return the result from the server.
    var result, errorResult, status, statusText, responseHeaders, contentType;

    result = (oResponse.responseText) ? oResponse.responseText : "";
    status = (oResponse.status) ? oResponse.status : NaN; 
    statusText = (oResponse.statusText) ? oResponse.statusText : "";
    responseHeaders = this.processResponseHeaders(oResponse);

    // These context info properties are common to both success and
    // failure results.
    this.m_contextInfo = {
        "resource-uri" : this.m_resourceURI,
        "response-status-code" : status,
        "response-headers" : responseHeaders,
        "response-reason-phrase" : statusText
    };

    // When the error response specifies an XML media type as defined by [RFC 3023],
    // the response body is parsed into an XML document and the root element of the
    // document is returned. If the parse fails, or if the error response specifies
    // a text media type (starting with text/), then the response body is returned
    // as a string. Otherwise, an empty string is returned. 
    if (isFailure) {
        this.m_contextInfo["error-type"] = "resource-error";
        contentType = oResponse.getResponseHeader["Content-Type"];
        errorResult = (contentType.indexOf("text/") == 0) ? result : xmlParse(result);
        this.m_contextInfo["response-body"] = errorResult;
    }

    return result;
}

submission.prototype.processResponseHeaders = function(oResponse) {
  var headerElt, nameElt, valueElt, name, value, responseHeaders = [ ];

  // Create a <header><name/><value/></header> node for each
  // response header from the server.
  for (name in oResponse.getResponseHeader) {
      value = oResponse.getResponseHeader[name];

      headerElt = document.createElement("header");
      nameElt = document.createElement("name");
      nameElt.appendChild(document.createTextNode(name));
      headerElt.appendChild(nameElt);
      valueElt = document.createElement("value");
      valueElt.appendChild(document.createTextNode(value));
      headerElt.appendChild(valueElt);

      responseHeaders.push(headerElt);
  }

  return responseHeaders;
}

submission.prototype.getConnection = function()
{
	return YAHOO.util.Connect;
}
