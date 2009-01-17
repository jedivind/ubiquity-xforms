
/**
 * Stub implementation of xforms-submission callback and submission methods for unit tesing.
 */
submission.prototype.request = function(sMethod, sAction, sBody, nTimeout, oCallback)
{
	if (nTimeout)
		oCallback.timeout = nTimeout;

	this.method = sMethod;
	this.action = sAction;
	this.body = sBody;
	this.timeout = nTimeout;
	this.callback = oCallback;
	
	return null;
};

submission.prototype.getConnection = function()
{
	return null;
};


var suiteXFormsSubmission = new YAHOO.tool.TestSuite({
	name : "Test xforms-submission module"
});

suiteXFormsSubmission.add(
	new YAHOO.tool.TestCase(
		{
			name: "Test xf:submission @method",
			
			testMethods: function() {
				
				var Assert = YAHOO.util.Assert;
				
				var submission;
				
				submission = document.createElement("xf:submission");
				
				// Implement the methods that submission.submit calls.
				submission.getBoundNode = function() { return {}; };
				submission.getEvaluationContext = function() { return {}; };
				
				submission.setAttribute("method", "get");
				document.submission.submit(submission);
				Assert.areEqual("GET", document.submission.method);

				submission.setAttribute("method", "put");
				document.submission.submit(submission);
				Assert.areEqual("PUT", document.submission.method);

				submission.setAttribute("method", "post");
				document.submission.submit(submission);
				Assert.areEqual("POST", document.submission.method);

				submission.setAttribute("method", "delete");
				document.submission.submit(submission);
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
