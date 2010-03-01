var schemeHandlers = [ ];

schemeHandlers["dom"] = [ ];

schemeHandlers["dom"]["GET"] = function(URI, data, timeout, callback) {
    var isSuccess = false;
    var XMLtext = "";
    var eltID = URI.substr(4);
    var sourceElement = document.getElementById( eltID );
    if ( sourceElement ) {
        var sourceText = sourceElement.textContent;
        
        // check for contentType on the source element and convert to XML if needed...
        
        var typeAttr = sourceElement.getAttribute( "type" );
        if ( typeAttr && typeAttr == "application/json") {
            XMLtext = UX.JSON.JSON2XML( sourceText );
        };
        isSuccess = true;
    }
    else {
        isSuccess = false;
    };
    	// If there is a callback object then give it the results.
	//
	if (callback) {
		callback.processResult(
			{
				method: "GET",
				status : 200,             
				statusText : "",
				responseText : XMLtext.length > 0 ? XMLtext : sourceText,
				responseHeaders : "",
				resourceURI : URI
			},
			!isSuccess
		);
	}
	return isSuccess;
};

schemeHandlers["file"] = [ ];

schemeHandlers["file"]["PUT"] = function (fileName, data, timeout, callback) {
	var fileWriter,
	    isSuccess;

	try {
		fileWriter = document.fileIOFactory.createFileWriter(fileName);
		fileWriter.write(data);
		fileWriter.close();
		isSuccess = true;
	} catch(e) {
		isSuccess = false;
	}

	// If there is a callback object then give it the results.
	//
	if (callback) {
		callback.processResult(
			{
				method: "PUT",
				status : 200,             
				statusText : "",
				responseText : data,
				responseHeaders : "",
				resourceURI : fileName
			},
			!isSuccess
		);
	}
	return isSuccess;
};

schemeHandlers["file"]["GET"] = function (fileName, data, timeout, callback) {
	var fileReader,
	    data,
	    isSuccess;

	try {
		fileReader = document.fileIOFactory.createFileReader(fileName);
		data = fileReader.read(null, null, -1);
		fileReader.close();
		isSuccess = true;
	} catch(e) {
		isSuccess = false;
	}

	// If there is a callback object then give it the results.
	//
	if (callback) {
		callback.processResult(
			{
				method: "GET",
				status : 200,             
				statusText : "",
				responseText : data,
				responseHeaders : "",
				resourceURI : fileName
			},
			!isSuccess
		);
	}
	return isSuccess;
};

schemeHandlers["file"]["DELETE"] = function (fileName, data, timeout, callback) {
	var file,
	    isSuccess;

	try {
		file = document.fileIOFactory.createFile(fileName);
		isSuccess = file["delete"]();
	} catch(e) {
		isSuccess = false;
	}

	// If there is a callback object then give it the results.
	//
	if (callback) {
		callback.processResult(
			{
				method: "DELETE",
				status : 200,
				statusText : "",
				responseText : data,
				responseHeaders : "",
				resourceURI : fileName
			},
			!isSuccess
		);
	}
	return isSuccess;
};
