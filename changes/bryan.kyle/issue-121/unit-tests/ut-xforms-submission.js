
/**
 * Stub implementation of xforms-submission callback and submission methods for unit tesing.
 */
submission.prototype.request = function(sMethod, sAction, sBody, nTimeout, oCallback) {
	if (nTimeout) {
		oCallback.timeout = nTimeout;
	}

	this.method = sMethod;
	this.action = sAction;
	this.body = sBody;
	this.timeout = nTimeout;
	this.callback = oCallback;
	
	return null;
};

submission.prototype.getConnection = function() {
	
	return {
		headers: {},
		
		initHeader: function(name, value) {
			this.headers[name] = value;
		}
	};
	
};


var suiteXFormsSubmission = new YAHOO.tool.TestSuite({
	name : "Test xforms-submission module"
});

suiteXFormsSubmission.add(
	new YAHOO.tool.TestCase(
		{
			name: "Test xf:submission @method",
			
			setUp: function() {
				this.node = document.createElement("xf:submission");
				
				// Implement the methods that submission.submit calls.
				this.node.getBoundNode = function() { return {}; };
				this.node.getEvaluationContext = function() { return {}; };
			},
			
			tearDown: function() {
				delete this.node;
			},
			
			testGetMethod: function() {
				var Assert = YAHOO.util.Assert;
				
				this.node.setAttribute("method", "get");
				document.submission.submit(this.node);
				Assert.areEqual("GET", document.submission.method);
			},
			
			testPutMethod: function() {
				var Assert = YAHOO.util.Assert;
				
				this.node.setAttribute("method", "put");
				document.submission.submit(this.node);
				Assert.areEqual("PUT", document.submission.method);
			},
			
			testPostMethod: function() {
				var Assert = YAHOO.util.Assert;
				
				this.node.setAttribute("method", "post");
				document.submission.submit(this.node);
				Assert.areEqual("POST", document.submission.method);
			},
			
			testDeleteMethod: function() {
				var Assert = YAHOO.util.Assert;
				
				this.node.setAttribute("method", "delete");
				document.submission.submit(this.node);
				Assert.areEqual("DELETE", document.submission.method);
			}
			
		}));

suiteXFormsSubmission.add(
	new YAHOO.tool.TestCase(
		{
			name: "Test Submission application/x-www-url-encoded",
			
			setUp: function() {
				this.model = document.createElement("xf:model");
				this.instance = document.createElement("xf:instance");
				this.model.appendChild(this.instance);

				DECORATOR.extend(this.model, new EventTarget(this.model), false);
				DECORATOR.extend(this.model, new Model(this.model), false);
				DECORATOR.extend(this.instance, new EventTarget(this.instance), false);
				DECORATOR.extend(this.instance, new Instance(this.instance), false);

				this.instance.replaceDocument(xmlParse("<car><make>Ford</make><color>blue</color></car>"));
				this.model.addInstance(this.instance);
			},
			
			tearDown: function() {
				delete this.model;
				delete this.instance;
			},
			
			testSerializeWhenRefIsLeafNode: function() {
				
				var Assert = YAHOO.util.Assert;
				
				var context = { 
					model: this.model,
					node: getFirstNode(this.model.EvaluateXPath("/car/color"))
				}; 
				
				var string = document.submission.serialiseForAction(context);
				
				Assert.areEqual("?color=blue", string);
			},
			
			testSerializeWhenRefIsNotLeafNode: function() {
				
				var Assert = YAHOO.util.Assert;
				
				var context = { 
					model: this.model,
					node: getFirstNode(this.model.EvaluateXPath("/car"))
				}; 
				
				var string = document.submission.serialiseForAction(context);
				
				Assert.areEqual("?make=Ford&color=blue", string);
			}
			
		}));

suiteXFormsSubmission.add(
	new YAHOO.tool.TestCase(
		{
			name: "Test xf:header",
			
			setUp: function() {
				this.model = NamespaceManager.createElementNS("http://www.w3.org/2002/xforms", "xf:model");
				this.submission = NamespaceManager.createElementNS("http://www.w3.org/2002/xforms", "xf:submission");
				this.header = NamespaceManager.createElementNS("http://www.w3.org/2002/xforms", "xf:header");
				this.name = NamespaceManager.createElementNS("http://www.w3.org/2002/xforms", "xf:name");
				this.value = NamespaceManager.createElementNS("http://www.w3.org/2002/xforms", "xf:value");

				this.model.appendChild(this.submission);
				this.submission.appendChild(this.header);
				this.header.appendChild(this.name);
				this.header.appendChild(this.value);

				DECORATOR.extend(this.model, new EventTarget(this.model), false);
				DECORATOR.extend(this.model, new Model(this.model), false);
				
				DECORATOR.extend(this.name, new EventTarget(this.name), false);
				DECORATOR.extend(this.name, new Context(this.name), false);
				DECORATOR.extend(this.name, new Value(this.name), false);

				DECORATOR.extend(this.value, new EventTarget(this.value), false);
				DECORATOR.extend(this.value, new Context(this.value), false);
				DECORATOR.extend(this.value, new Value(this.value), false);

				
			},
			
			tearDown: function() {
				delete this.value;
				delete this.name;
				delete this.header;
				delete this.submission;
				delete this.model;
			},
			
			testSetHeadersReadsNameAndValueContent: function() {
				var Assert = YAHOO.util.Assert;
				
				var connection = document.submission.getConnection();
				
				this.name.appendChild(document.createTextNode("header-name"));
				this.value.appendChild(document.createTextNode("header-value"));

				document.submission.setHeaders(null, connection, null, this.submission);
				
				Assert.isNotNull(connection.headers["header-name"]);
				Assert.areEqual("header-value", connection.headers["header-name"]);
				
			},
			
			testSetHeaderIgnoresHeadersWithoutNames: function() {
				var Assert = YAHOO.util.Assert;
				
				var connection;
				var key;
				var count = 0;
				
				/*
				 * Blank xf:header
				 */
				
				this.name.appendChild(document.createTextNode(""));
				
				connection = document.submission.getConnection();
				document.submission.setHeaders(null, connection, null, this.submission);

				// Make sure there aren't any headers.				
				for ( key in connection.headers ) {
					count++;
				}
				Assert.areEqual(0, count);
				
			
				
				/*
				 * Missing xf:header
				 */
				
				this.header.removeChild(this.name);

				connection = document.submission.getConnection();
				document.submission.setHeaders(null, connection, null, this.submission);

				// Make sure there aren't any headers.				
				for ( key in connection.headers ) {
					count++;
				}
				Assert.areEqual(0, count);

			},
			
			testSetHeaderSetsValueToBlankStringWhenNoValueIsPresent: function() {
				var Assert = YAHOO.util.Assert;

				var connection;
				
				
				this.name.appendChild(document.createTextNode("header-name"));
				
				/*
				 * Blank xf:value
				 */
				
				this.value.appendChild(document.createTextNode(""));
				
				connection = document.submission.getConnection();
				document.submission.setHeaders(null, connection, null, this.submission);
				
				Assert.isNotNull(connection.headers["header-name"]);
				Assert.areEqual("", connection.headers["header-name"]);
				

				/*
				 * Missing xf:value
				 */
				
				this.header.removeChild(this.value);
				
				connection = document.submission.getConnection();
				document.submission.setHeaders(null, connection, null, this.submission);
				
				Assert.isNotNull(connection.headers["header-name"]);
				Assert.areEqual("", connection.headers["header-name"]);
			},
			
			testSetHeadersAcceptsMultipleValues: function() {
				
				var Assert = YAHOO.util.Assert;
				
				var value;
				var connection;
				

				this.name.appendChild(document.createTextNode("header-name"));
				this.value.appendChild(document.createTextNode("header-value-1"));

				value = NamespaceManager.createElementNS("http://www.w3.org/2002/xforms", "xf:value");
				value.appendChild(document.createTextNode("header-value-2"));
				this.header.appendChild(value);
									  
				DECORATOR.extend(value, new EventTarget(value), false);
				DECORATOR.extend(value, new Context(value), false);
				DECORATOR.extend(value, new Value(value), false);
				


				connection = document.submission.getConnection();
				document.submission.setHeaders(null, connection, null, this.submission);
				
				Assert.isNotNull(connection.headers["header-name"]);
				Assert.areEqual("header-value-1 header-value-2", connection.headers["header-name"]);
									  
			}
			

		}));
