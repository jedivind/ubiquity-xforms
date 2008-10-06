(function() {
	var Assert = YAHOO.util.Assert;

	var suite = new YAHOO.tool.TestSuite({
		name : "Test insert nodes functionality",

		setUp : function() {
		
			this.testDIV = document.createElement( "div" );
			this.testInstance = new Instance( this.testDIV );
            this.testInstance.replaceDocument(
                xmlParse(
                    "<po xmlns=''> \
                         <order> \
                             <item> \
                                <product>P1</product> \
                                <unitcost>1.99</unitcost> \
                                <qty>10</qty> \
                                <itemtotal>19.90</itemtotal> \
                             </item> \
                         </order> \
                         <prototype> \
                             <item> \
                                <product></product> \
                                <unitcost>0</unitcost> \
                                <qty>0</qty> \
                                <itemtotal>0</itemtotal> \
                             </item> \
                         </prototype> \
                         <subtotal>19.90</subtotal> \
                         <tax>1.00</tax> \
                         <total>20.99</total> \
                    </po>"
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
			name : "Test insert nodes",

			setUp : function() {
				// Check that the initial data is correct.
				//
				Assert.areEqual(2, suite.testInstance.evalXPath('count(*/item)').numberValue(),
					"Instance not initialised correctly");
				return;
			}, // setUp()

			tearDown : function() {
				suite.testInstance.reset();
				return;
			}, // tearDown()

            // Test insert for main "add" button use case, except not using repeat index.
            // and not using separate instance for origin prototype.
            // <xforms:insert context="order" nodeset="item" at="last()" 
            //                position="after" origin="/po/prototype/item"/>
            //
            testInsertElementPrototypeIntoList: function() {
            
                Assert.isTrue(suite.testInstance.insertNodes(null,  
                    "order", "item", "last()", "after", "/po/prototype/item"), 
                    "Insert did not insert any nodes");

                Assert.areEqual(2, suite.testInstance.evalXPath('count(order/item)').numberValue());
                Assert.isFalse(suite.testInstance.evalXPath('order/item[1]/product = ""').booleanValue());
                Assert.isTrue(suite.testInstance.evalXPath('order/item[2]/product = ""').booleanValue());
                
                return;
            },

            // Test insert for main "delete" button use case in which a new prototype element
            // would be added if a deletion removes the only element in a list.
            // <xforms:delete nodeset="order/item" at="1"/>
            // <xforms:insert context="order" origin="/po/prototype/item" if="count(item)=0"/>
            //
            
            testInsertElementPrototypeIntoEmptyList: function() {
                Assert.isTrue(suite.testInstance.deleteNodes(null, null, "order/item", "1"));
                
                Assert.areEqual(0, suite.testInstance.evalXPath('count(order/item)').numberValue(), 
                                "The delete failed to set up the precondition for the insert test");

                Assert.isTrue(suite.testInstance.insertNodes(null,  
                    "order", null, null, null, "/po/prototype/item"), 
                    "Insert did not insert any nodes");

                // Ensure we got one element and that it is a copy of the empty prototype
                Assert.areEqual(1, suite.testInstance.evalXPath('count(order/item)').numberValue());
                Assert.isTrue(suite.testInstance.evalXPath('order/item[1]/product = ""').booleanValue());

                return;
            }
            
		})//new TestCase
	); //suite.add( ... )

	YAHOO.tool.TestRunner.add(suite);
}());
