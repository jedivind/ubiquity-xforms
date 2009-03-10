(
	function() {
		var Assert = YAHOO.util.Assert;
		var xmlDoc,
		    xmlString = [
					'<name>',
					'Donald Duck',
					'</name>'
				].join('');

		var suite = new YAHOO.tool.TestSuite({
			name: "AJAXSLT Extensions"
		});

		// Tests our enhancements to AJAXSLT.
		//
		suite.add(
			new YAHOO.tool.TestCase({
				name: "Test createProcessingInstruction",

				setUp: function () {
					xmlDoc = xmlParse( xmlString );
				},

				tearDown: function () {
					xmlDoc = null;
				},

				testAddXMLPI : function () {
					xmlDoc.insertBefore(
						xmlDoc.createProcessingInstruction("xml", "version='1.0' encoding='ISO-8859-1'"),
						xmlDoc.firstChild
					);
					Assert.areEqual("<?xml version='1.0' encoding='ISO-8859-1'?>" + xmlString, xmlText(xmlDoc));
		    },

				// A lot of examples you see on the web have a leading space before "version".
				// We trim leading and trailing whitespace to make it easier to compare documents.
				// But we might as well test this feature.
				//
				testAddXMLPIWithLeadingSpaces : function () {
					xmlDoc.insertBefore(
						xmlDoc.createProcessingInstruction("xml", "   version='1.0' encoding='ISO-8859-1'   "),
						xmlDoc.firstChild
					);
					Assert.areEqual("<?xml version='1.0' encoding='ISO-8859-1'?>" + xmlString, xmlText(xmlDoc));
		    }
		  })//new TestCase
		);

		// Add our test suite to the test runner.
		//
		YAHOO.tool.TestRunner.add(suite);
	}()
);
