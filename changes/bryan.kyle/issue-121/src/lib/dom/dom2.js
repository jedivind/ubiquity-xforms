if (!document.createElementNS) {
	document.createElementNS = function(namespaceURI, elementName) {
		var element = document.createElement(elementName);
		
		element.namespaceURI = namespaceURI;
		return element;
	};
}

