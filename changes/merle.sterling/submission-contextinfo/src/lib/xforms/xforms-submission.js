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
 * This class must be extended to suit the comms library
 * being used.
 */
function callback(oMediator, oObserver, oContext)
{
	this.m_mediator = oMediator;
	this.m_observer = oObserver;
	this.m_context = oContext;
}

callback.prototype.processResult = function(oResult, isFailure)
{
	this.m_mediator.processResult(oResult, isFailure, this.m_observer, this.m_context);
}

callback.prototype.success = function(o)
{
	throw "callback::success() has not been implemented";
}

callback.prototype.failure = function(o)
{
	throw "callback::failure() has not been implemented";
}

/*
 * [TODO] Use some kind of addFeature thing.
 */

function submission()
{
}

document.submission = new submission();

/*
 * The comms library being used must override this.
 */

submission.prototype.request = function(sMethod, sAction, sBody, nTimeout, oCallback)
{
	throw "submission::request() has not been implemented";
}
submission.prototype.getConnection = function()
{
	throw "submission::getConnection() has not been implemented";
}

submission.prototype.processResult = function(oResult, isFailure, oObserver, oContext)
{
    var sData, sReplace, oEvt, oNewDom;

	if (oObserver)
	{
		oEvt = oObserver.ownerDocument.createEvent("Events");

        // Set context info properties common to both success and failure results.
        oEvt.context = {
            "resource-uri" : oResult.resourceURI,
            "response-status-code" : oResult.status,
            "response-reason-phrase" : oResult.statusText,
            "response-headers" : this.processResponseHeaders(oResult.responseHeaders)
        };

		if (isFailure)
		{
            // When the error response specifies an XML media type as defined by [RFC 3023],
            // the response body is parsed into an XML document and the root element of the
            // document is returned. If the parse fails, or if the error response specifies
            // a text media type (starting with text/), then the response body is returned
            // as a string. Otherwise, an empty string is returned. 
			oEvt.initEvent("xforms-submit-error", true, false);
            oEvt.context["error-type"] = "resource-error";
            oEvt.context["response-body"] =  !oResult.responseHeaders["Content-Type"].indexOf("text/") ?
                 oResult.responseText : xmlParse(oResult.responseText);
			FormsProcessor.dispatchEvent(oObserver, oEvt);
		}
		else
		{
            sData = oResult.responseText;

            // If the server returned a response body, process it according to the value of the
            // 'replace' attribute. If there is no response body, we still need to dispatch
            // xforms-submit-done with whatever context info we do have and indicate that this
            // submission is no longer in progress.
            if (sData) {
                oNewDom = xmlParse(sData);

                /*
                 * We now need to store the returned data. First find out
                 * what the @replace value was set to.
                 */

                sReplace = oObserver.getAttribute("replace");
                sReplace = (sReplace) ? sReplace : "all";

                switch (sReplace)
                {
                    case "all":
                        oObserver.ownerDocument.logger.log("@replace = 'all'", "submission");				

                        if (document.all) {
                           document.write(sData);
                        }
                        else  {
                           if (UX.isFF) {
                               // on FF,  <?xml version="1.0"?> needs to be factored out
                               if (sData.indexOf("<?", 0) === 0) {
                                   sData = sData.substr(sData.indexOf("?>")+2);
                               }                       
                           } 					  
                           document.documentElement.innerHTML=sData;
                        }				

                        break;

                    case "instance":
                        oObserver.ownerDocument.logger.log("@replace = 'instance'", "submission");

                        /*
                         * @replace="instance" causes the returned data to overwrite
                         * an instance. If no instance is specified then the instance
                         * to overwrite is the one submitted.
                         */

                        if (oObserver["instance"])
                        {
                            if (!oContext.model.replaceInstanceDocument(oObserver["instance"], oNewDom))
                                throw "Instance '" + oObserver["instance"] + "' not found.";
                        }
                        else if(oObserver.srcInstance)
                        {
                            if (!__replaceInstanceDocument(oContext.model,oObserver.srcInstance, oNewDom))
                                throw "Failed to replace source instance";
                        }
                        else
                        {
                            debugger;
                            //don't know where to put it - first instance of first model?
                        }
                        break;

                    case "none":
                        oObserver.ownerDocument.logger.log("@replace = 'none'", "submission");
                        break;

                    default:
                        oObserver.ownerDocument.logger.log("Invalid replace value.", "submission");
                        break;
                }
            }

        	oEvt.initEvent("xforms-submit-done", true, false);		
			FormsProcessor.dispatchEvent(oObserver, oEvt);
		}
	}
}

submission.prototype.processResponseHeaders = function(oHeaders) {
  var headerElt, nameElt, valueElt, name, value, responseHeaders = [ ];

  // Create a <header><name/><value/></header> node for each
  // response header from the server.
  for (name in oHeaders) {
      value = oHeaders[name];

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

/*
 * We give the submit function an object that contains
 * all of the parameters. This is also the object to
 * which we want all of our events targetted.
 */

submission.prototype.submit = function(oSubmission)
{
    var oEvt = null;
    var ns = oSubmission.getElementsByTagName("extension");
	var oExtDom = null;    
	if (ns && ns.length > 0) {
		var oExt = ns[0];
		oExtDom = oExt.getDocument();
	}

	/*
	 * XForms 1.0

	var sVersion = this.element["version"];
	var sIndent = this.element["indent"];
	var sMediaType = this.element["mediatype"];
	var sEncoding = this.element["encoding"];
	var sOmitXmlDeclaration = this.element["omit-xml-declaration"];
	var sCdataSectionElements = this.element["cdata-section-elements"];
	var sReplace = this.element["replace"];
	var sInstance = this.element["instance"];
	var sSeparator = this.element["separator"];
	var sIncludeNamespacePrefixes = this.element["includenamespaceprefixes"];

	 */

	/*
	 * XForms 1.1

	var sValidate = this.element["validate");
	var sRelevant = this.element["relevant");

	 */

	var nTimeout = oSubmission.getAttribute("timeout");
	if (nTimeout === null) {
	   nTimeout = 5000;
	}
	var sAction = oSubmission.getAttribute("action");
    var sMethod = "";
	var sSerialisation;
	var sBody;
	var oContext = oSubmission.getBoundNode();	
	if(oContext.node && !oSubmission.getAttribute("instance"))
		oSubmission.srcInstance = oContext.node.ownerDocument.XFormsInstance;
	if(oContext.model == null)	
		oContext = oSubmission.getEvaluationContext();
	if (oExtDom)
	{

		/*
		 * See if there are any nodes for an action.
		 */

		var oRes = oContext.model.EvaluateXPath("/sub/action/part", 
		    {
		        node: oExtDom,
		        model: oContext.model,
		        resolverElement: oExt
		    }
		);

		if (oRes && oRes.type == "node-set")
		{
			ns = oRes.nodeSetValue();

			/*
			 * Loop through them, creating the action URL.
			 *
			 * [ISSUE] We ignore any action placed on the submission
			 * element, but why not concatenate? This is how fP behaves,
			 * so only change this when fP is also changed.
			 */

			sAction = "";

			if (ns)
			{
				for (var i = 0; i < ns.length; i++)
					sAction += getElementValueOrContent(oContext, ns[i]);
				oSubmission.ownerDocument.logger.log("@action = '" + sAction + "'", "submission");
			}
		}
	}

	/*
	 * M E T H O D
	 * ===========
	 *
	 * The XForms method is mapped to the right method for the
	 * protocol.
	 */

	switch (oSubmission.getAttribute("method"))
	{
		case "get":
			sMethod = "GET";
			sSerialisation = "application/x-www-form-urlencoded";
			sAction += this.serialiseForAction(oContext);
			sBody = null;
			break;

		case "post":
			sMethod = "POST";
			sSerialisation = "application/xml";
			if (oContext.node)
				sBody = xmlText(oContext.node);
			break;

		case "put":
			sMethod = "PUT";
			sSerialisation = "application/xml";
			if (oContext.node)
				sBody = xmlText(oContext.node);
			break;

		default:
			/* the submission method being used needs to be implemented */
			debugger;
			oSubmission.ownerDocument.logger.log("Submission method '" + oSubmission["method"] + "' is not defined.", "error");
			break;
	}

	if (!sMethod)
		throw "A submission method is required.";

    // Dispatch xforms-submit-serialize.
    // If the event context submission-body property string is empty, then no
    // operation is performed so that the submission will use the normal
    // serialization data. Otherwise, if the event context submission-body
    // property string is non-empty, then the serialization data for the
    // submission is set to be the content of the submission-body string.
    try {
	   oEvt = oSubmission.ownerDocument.createEvent("Events"); 
       oEvt.initEvent("xforms-submit-serialize", true, false);
       oEvt.context = { "submission-body" : document.createTextNode("") };
       FormsProcessor.dispatchEvent(oSubmission, oEvt);

       if (oSubmission.submissionBody.value) {
           sBody = oSubmission.submissionBody;
       }
    } catch(e) {
	   oSubmission.ownerDocument.logger.log("Error: " + e.description, "error");
    }

	//
	// Callback for asynchronous submission
	// [ISSUE] synchronous submissions need to do the request here without a callback 

	var oCallback = new callback(this, oSubmission, oContext);

	this.setHeaders(oContext.model,this.getConnection(),oExtDom);		
	
    try {    
	    return this.request(
		    sMethod,
		    sAction,
		    sBody,
		    nTimeout,
		    oCallback
	    );
    } catch(e) {
	    oEvt = oSubmission.ownerDocument.createEvent("Events");
	    oEvt.initEvent("xforms-submit-error", true, false);
        oEvt.context = {
            "error-type" : "resource-error",
            "resource-uri" : sAction
        };
	    FormsProcessor.dispatchEvent(oSubmission,oEvt);
    }
}

/*
 * [TODO] Change the name, and remove the separator stuff, since this
 * is a general function that turns a nodelist into a sequence of
 * name/value pairs.
 */

submission.prototype.serialiseForAction = function(oContext)
{
	var oRet = "";

	if (oContext.node)
	{
		/*
		 * [ISSUE] This returns every text node.
		 */
	
		var r = oContext.model.EvaluateXPath(".//*", oContext);
		var sep = "?";
	
		for (var i = 0; i < r.value.length; ++i)
		{
			var o = r.value[i];

			if (o && o.nodeType == DOM_ELEMENT_NODE)
			{
				if (o.firstChild && (o.childNodes.length == 1) && (o.firstChild.nodeType == DOM_TEXT_NODE) && o.firstChild.nodeValue)
				{
					var sPropName = String(o.nodeName).replace(/underscore/g, "_");
		
					oRet += sep + sPropName + "=" + o.firstChild.nodeValue;
					sep = "&";
				}
			}
		}
	}
	return oRet;
}


submission.prototype.setHeaders = function(oModel, connection,oExtdom)
{
	if(oExtdom)
	{
	    var r = oModel.EvaluateXPath("//headers/header",oExtdom);
	    for(var i = 0;i < r.value.length;++i)
	    {
	        var sPath = r.value[i].getAttribute("value");
	        if(sPath)
	        {   
	            var rHeader= oModel.EvaluateXPath(sPath,null);
	            if(rHeader)
	            {
	                var sHeaderValue = ""
	                switch(typeof(rHeader.value))
	                {
	                    case "string":
	                        sHeaderValue = rHeader.value;
	                    break;
	                    case "object":
	                        sHeaderValue= rHeader.value[0].nodeValue;
                    }	                
					var sLabel = r.value[i].getAttribute("name");
					connection.initHeader(sLabel,sHeaderValue);
	            }
            }
            
        }
    }	
}


submission.prototype.buildGetUrl = function(action, params)
{
    var url = action;

    if (params)
    {
        var sep = "?"; //should test that action doesn't already have this anywhere already.

        for (var key in params)
        {
            if (params[key] === null)
                continue;
            url += sep + encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
            sep = "&";
        }
    }//if ( there are parameters to add to the action )
    return url;
}//buildurl