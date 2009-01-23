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
	if (o.responseText !== undefined)
	{
		var result = o.responseText; 
		this.processResult(result, false); 
     }
}

callback.prototype.failure = function(o)
{
	var result = o.status + " " + o.statusText; 
	this.processResult(result, true); 
}

submission.prototype.request = function(sMethod, sAction, sBody, nTimeout, oCallback)
{
	if (nTimeout)
		oCallback.timeout = nTimeout;

try {      netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");     } catch (e) {      alert("Permission UniversalBrowserRead denied.");     }

	return YAHOO.util.Connect.asyncRequest(
		sMethod,
		sAction,
		oCallback,
		sBody
	);
}

submission.prototype.getConnection = function()
{
	return YAHOO.util.Connect;
}

submission.prototype.setSOAPHeaders = function(soapVersion, sMediatype, sSOAPAction, sCharset) {
    var contentType = sMediatype;
    
    if (soapVersion === "1.1") {
        contentType = "text/xml";
        if (sSOAPAction && sSOAPAction.length > 0) {
            this.getConnection().initHeader("SOAPAction", sSOAPAction); 
        }        
	
        if (sCharset && sCharset.length > 0) {
           contentType += "; charset=" + sCharset + ";";
        } else {
           contentType += "; charset=" + "UTF-8;";
        }      
    } 
 
    this.getConnection().initHeader("content-type", contentType);
 
    this.getConnection().setDefaultPostHeader(false);  
    return;
}