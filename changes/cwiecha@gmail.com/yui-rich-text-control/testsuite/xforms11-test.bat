:: Parameters:
:: %1 = Browser indicator 'ff' or 'ie' 
:: %2 = Test suite part type being tested. 'Chapter' or 'Appendix'
:: %3 = Test suite part type number or letter. '2' or 'B' etc.
:: %4 = Boolean value that is used to autorun the tests or not
::
:: So, to run from command line (C:\Work\SVN\ubiquity_xforms_lib): 
::
::   xforms-test.bat ff Chapter 2 true
::   or
::   xforms-test.bat ie Appendix B false
::

SET TEST_SUITE_CMD=

:: IE example:
:: "./testsuite/selenium/core/TestRunner.hta" "test=../../issues/driverPages/SeleniumTests/TestSuite.html&auto=true&save=true&resultsUrl=testsuite/regression-ie7-results.html&close=true"
::
:: FF Example:
:: "C:\Program Files\Mozilla Firefox\firefox.exe" "testsuite\selenium\core\TestRunner.html?auto=%4&save=true&close=true&test=..%%2F..%%2FW3C-XForms-1.1%%2FEdition1%%2FdriverPages%%2FSeleniumTests%%2FTestSuite%2%3.html&resultsUrl=..\..\xforms11-%2%3-%1-results.html"

IF [%1]==[ie] SET TEST_SUITE_CMD="./testsuite/selenium/core/TestRunner.hta" "test=../../W3C-XForms-1.1/Edition1/driverPages/SeleniumTests/TestSuite%2%3.html&auto=%4&save=true&close=true&resultsUrl=testsuite/xforms11-%2%3-%1-results.html"
IF [%1]==[ff] SET TEST_SUITE_CMD="C:\Program Files\Mozilla Firefox\firefox.exe" "testsuite\selenium\core\TestRunner.html?auto=%4&save=true&close=true&test=..%%2F..%%2FW3C-XForms-1.1%%2FEdition1%%2FdriverPages%%2FSeleniumTests%%2FTestSuite%2%3.html&resultsUrl=..\..\xforms11-%2%3-%1-results.html"

:: Run the test(s)
%TEST_SUITE_CMD%

:: Move the Selenium produced files to the correct 'Results' directory so they can be merged by merge-selenium-build.xml
:: CD /d %~dp0
:: IF [%1]==[ie] move /Y xforms11-*-ie-results.html W3C-XForms-1.1\Edition1\driverPages\Results\IE7
:: IF [%1]==[ff] move /Y xforms11-*-ff-results.html W3C-XForms-1.1\Edition1\driverPages\Results\FF3