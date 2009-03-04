"./testsuite/selenium/core/TestRunner.hta" "test=../../W3C-XForms-1.1/Edition1/driverPages/SeleniumTests/W3CTestSuite.html&auto=true&save=true&resultsUrl=testsuite/xforms11-ie7-results.html&close=true"
ant -f "testsuite/build.xml"
if "%ERRORLEVEL%" == "1" exit 1