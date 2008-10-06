(function() {
	var Assert = YAHOO.util.Assert;

	var suite = new YAHOO.tool.TestSuite({
		name : "Test delete nodes functionality",

		setUp : function() {
			this.testDIV = document.createElement( "div" )
			this.testInstance = new Instance( this.testDIV );

			this.testInstance.replaceDocument(
				xmlParse(
					"<shoppingcart xmlns=''> \
						<item> \
							<product>SKU-0815</product> \
							<quantity>1</quantity> \
							<unitcost>29.99</unitcost> \
							<price>29.99</price> \
						</item> \
						<item> \
							<product>SKU-4711</product> \
							<quantity>3</quantity> \
							<unitcost>7.49</unitcost> \
							<price>22.47</price> \
						</item> \
					</shoppingcart>"
				)
			);
			return;
		},// setUp()

		tearDown : function() {
			delete this.testDIV;
			this.testDIV = null;

			delete this.testInstance;
			this.testInstance = null;
			return;
		}// tearDown()
	});

	// Add test for delete nodes.
	//
	suite.add(
		new YAHOO.tool.TestCase({
			name : "Test delete nodes",

			setUp : function() {
				// Check that the initial data is correct.
				//
				Assert.areEqual(2, suite.testInstance.evalXPath('count(/shoppingcart/item)').numberValue(),
					"Shopping-cart not initialised correctly");
				return;
			}, // setUp()

			tearDown : function() {
				suite.testInstance.reset();
				return;
			}, // tearDown()

			// Delete the second item in the list by creating a list of only one item, and
			// then deleting the first one in that list.
			//
			testDeleteNodeNodsetOfOneIndexOfOneItemFromPurchaseOrder: function() {
				Assert.isTrue(suite.testInstance.deleteNodes("/shoppingcart/item[2]", "1"));

				Assert.areEqual(1, suite.testInstance.evalXPath('count(/shoppingcart/item)').numberValue());
				Assert.areEqual(1, suite.testInstance.evalXPath('count(/shoppingcart/item[product = "SKU-0815"])').numberValue());
				return;
			},

			// Delete the second item in the list by creating a list of all items, and then
			// deleting the second one.
			//
			testDeleteNodeNodsetOfManyIndexOfTwoItemFromPurchaseOrder: function() {
				Assert.isTrue(suite.testInstance.deleteNodes("/shoppingcart/item", "2"));

				Assert.areEqual(1, suite.testInstance.evalXPath('count(/shoppingcart/item)').numberValue());
				Assert.areEqual(1, suite.testInstance.evalXPath('count(/shoppingcart/item[product = "SKU-0815"])').numberValue());
				return;
			},

			// Delete the second item in the list by creating a list of all items, and deleting
			// the last one.
			//
			testDeleteNodeNodsetOfManyIndexOfCountItemFromPurchaseOrder: function() {
				Assert.isTrue(suite.testInstance.deleteNodes("/shoppingcart/item", "count(/shoppingcart/item)"));

				Assert.areEqual(1, suite.testInstance.evalXPath('count(/shoppingcart/item)').numberValue());
				Assert.areEqual(1, suite.testInstance.evalXPath('count(/shoppingcart/item[product = "SKU-0815"])').numberValue());
				return;
			},

			// Delete the second item in the list by creating a list of one item, and then
			// deleting the entire list.
			//
			testDeleteNodeNodsetOfOneNoAtItemFromPurchaseOrder: function() {
				Assert.isTrue(suite.testInstance.deleteNodes("/shoppingcart/item[2]"));

				Assert.areEqual(1, suite.testInstance.evalXPath('count(/shoppingcart/item)').numberValue());
				Assert.areEqual(1, suite.testInstance.evalXPath('count(/shoppingcart/item[product = "SKU-0815"])').numberValue());
				return;
			},

			// Delete the entire list, and check that no items remain.
			//
			testDeleteNodeNodsetOfTwoNoAtItemFromPurchaseOrder: function() {
				Assert.isTrue(suite.testInstance.deleteNodes("/shoppingcart/item"));

				Assert.areEqual(0, suite.testInstance.evalXPath('count(/shoppingcart/item)').numberValue());
				return;
			},

			// Try to delete the non-existent third item in various ways.
			//
			testDeleteNodeFailToDeleteItemFromPurchaseOrder: function() {
				Assert.isFalse(suite.testInstance.deleteNodes("/shoppingcart/item", "3"));
				Assert.isFalse(suite.testInstance.deleteNodes("/shoppingcart/item[3]", "1"));
				Assert.isFalse(suite.testInstance.deleteNodes("/shoppingcart/item[3]"));

				Assert.areEqual(2, suite.testInstance.evalXPath('count(/shoppingcart/item)').numberValue());
				return;
			}
		})//new TestCase
	); //suite.add( ... )

	YAHOO.tool.TestRunner.add(suite);
}());
