:: Parameters:
:: %1 = Browser indicator 'ff' or 'ie' 
:: %2 = Test suite part type being tested. 'Chapter' or 'Appendix'
:: %3 = Test suite part type number or letter. '2' or 'B' etc.
::
:: So, to run from command line: 
::   xforms-test.bat ff Chapter 2
::   or
::   xforms-test.bat ie Appendix B
::

SET BROWSER_PATH=

IF [%1]==[ie] SET BROWSER_PATH="C:\Program Files\Internet Explorer\iexplore.exe"
IF [%1]==[ff] SET BROWSER_PATH="C:\Program Files\Mozilla Firefox\firefox.exe"

%BROWSER_PATH% "testsuite\selenium\core\TestRunner.html?test=..\..\W3C-XForms-1.1\Edition1\driverPages\SeleniumTests\TestSuite%2%3.html&auto=true&save=true&resultsUrl=..\..\xforms11-%2%3-%1-results.html&close=true"

:: 
ant -f "testsuite\build.xml"