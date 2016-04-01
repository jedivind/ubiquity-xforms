# Introduction #

The W3C XForms 1.1 Test Suite has been incorporated into the Ubiquity-xforms project to facilitate compliance testing.  You can checkout a copy of the trunk to your local environment and **start Selenium testing by** opening the _testsuite/index.html_ file and selecting **Run W3C Selenium Tests**.  Visit this link for more information about [Selenium](http://seleniumhq.org/).  Our Ubiquity-xforms project uses the Selenium core.

# Details #

When you run the Selenium tests, you can quickly see the results of the Selenium testing by observing the background colors of the listed tests.  Red indicates the test or Selenium cmd failed, and green indicates the test or Selenium cmd passed.  There are some tests which are highlighted in red text to indicate the tests that can not be tested correctly by regular Selenium commands.  These tests fail when they are run by Selenium, so these tests should be tested manually.

## W3C XForms 1.1 Driver Pages ##
The [W3C XForms 1.1 Test Suite](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/W3C-XForms-1.1/Edition1/driverPages/html/index.html) contains a driver to run the individual tests by chapters as they are presented in the XForms 1.1 specification.  Further, the W3C XForms 1.1 test suite has an [XForms mode](http://ubiquity-xforms.googlecode.com/svn/trunk/testsuite/W3C-XForms-1.1/Edition1/driverPages/forms/index.xhtml) (not yet working with Ubiquity-XForms) which allows a user to mark individual tests as passed or failed and the date of the observed status.  These results can be saved to a local file system (e.g. if you were testing Chapter 2, select **2. Introduction to XForms**; select test 2.1.a _Introductory Example No. 1_; depending on the success of the test case, return back to the chapter 2 page; select 'Passed', 'Failed', or 'Unknown' status; select a date with the calendar control).  You can then select the **Save** button to save the results to the folder ../Results/XF11\_02\_Results.xml.  For the ubiquity-xforms results, we manually moved these xml files from the ../Results folder, respectively, to Results/FF3 for Firefox 3 results, and IE7 for Internet Explorer results.

## Updating Results xml Files Manually ##
Since the XForms mode link is not working right now, you must update the test results manually.  So, if you fixed some code that makes a Failed test say that it is Passed now, you must update its results.  For this example, lets say that the test case was 4.3.1.a.  If you ran the Selenium test in FF3, then you would go to the Results/FF3 folder.  If you ran the Selenium test in IE7, then you would go to the Results/IE7 folder.  Then, you would open the specific xml file based on the test case's chapter number.  In this example, you would open to XF11\_04\_Results.xml, because 4.3.1.a is in chapter 4.  Next, you would scroll down to your test case.  Where it says testCaseStatus, you would update the test case status.  In this example, you would change 

&lt;testCaseStatus&gt;

Failed

&lt;/testCaseStatus&gt;

 to 

&lt;testCaseStatus&gt;

Passed

&lt;/testCaseStatus&gt;

.  (You can change the date if you want to too.)  Then, you would see if testCaseBasic & testCaseNormative are true or false.  If one or both are true, you must scroll back up to the top where the statusSummary is.  If testCaseBasic is true, you would update numBasicPass & numBasicFail.  If testCaseNormative is true, you would update numNormPass & numNormFail.  Let's say for this example, numBasicPass & numNormPass are 20 and numBasicFail & numNormFail are 45.  So, you just changed testCaseStatus from Failed to Passed and you can see that testCaseBasic & testCaseNormative are true (this means that there is one more Passed result and one less Failed result).  So, you would scroll up to the top and change numBasicPass & numNormPass from 20 to 21 and numBasicFail & numNormFail from 45 to 44.  Now, you would have to update the html files to view your changes.  These steps are explained in the next section.

## Viewing Results ##


There is a ResultsTable.xhtml document written with XForms which displays the results of the above manual testing methods of the W3C XForms 1.1 Test Suite. But due to various reasons, we had to use an X/HTML oriented approach to display these results.  To view these Results, you will need to transform the XML files above to X/HTML.  To do this, inspect the testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/build.xml and ubiquityxforms.xsl files.  You may need to edit these files depending on whether you are working with IE or Firefox results.  If you are an Eclipse user, select the build.xml file and right click on the "Run As > Ant Build" to transform the IE7 or FF3 results xml files to html files under IE7/html and FF3/html.

At this point you can open testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/IE7/ResultsTable.html or testsuite/W3C-XForms-1.1/Edition1/driverPages/Results/FF3/ResultsTable.html to see a view-at-a-glance results of the test runs.

## Saving Results using Selenium ##
The next stage we have been working on is to find an automated way to run the Selenium tests, collect the passed/failed status, and automatically update the Results xml files to quickly present the current state of the product.

Now, there are some changes to the Selenium core JavaScript files in the xforms-tests-and-examples branch.  You can turn the Save Results Feature on or off.  If it is off, then you can run Selenium normally.  If it is on, then after every test, Selenium will run the last test in the testSuite.  For the w3c testSuite in that branch, there is a sendResults.html Selenium test that is run.  It gets the chapter, test number, and Passed/Failed result from the previous test.  It opens a new results-write.xhtml file that uses XForms capabilities to get the correct xml file's instance information.  results-write.xhtml updates the Passed/Failed on its model's instance.  That file also tries to write the updated instance back to the correct xml file when the button is clicked, but that doesn't work right now.

There are many problems that are not done now.

Someone will have to fix insert for this to work: 

&lt;xforms:insert if="instance('urlvars')/chapter = 'XF11\_02\_Results'" nodeset="instance('instance1')" origin="instance('chap02')"/&gt;

.  This is replacing the instance data from "instance('chap02')" to "instance('instance1')" if "instance('urlvars')/chapter = 'XF11\_02\_Results'".

Someone will have to fix submission for this to work:
> 

&lt;xforms:submission id="submit01" method="put" instance="instance1"&gt;


> > 

&lt;xforms:resource value="file:F11\_04\_Results.xml"&gt;



&lt;/xforms:resource&gt;



> 

&lt;/xforms:submission&gt;


This writes the instance data from instance1 to the file F11\_04\_Results.xml.

Someone will have to add browser support to the sendResults.html and results-write.xhtml file.  When sendResults.html opens results-write.xhtml now, only the chapter, the test number, and the Passed/Failed result are passed added to the URL.  Adding the browser as a forth variable should be pretty simple to do.  Then someone will have to use that browser in the results-write.xhtml similarly to the other variables.  That person would need to make sure that xml files from the Results/FF3 folder and the Results/IE7 folder are used, not just from the Results folder.