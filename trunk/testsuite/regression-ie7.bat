"./testsuite/selenium/core/TestRunner.hta" "test=../../issues/driverPages/SeleniumTests/TestSuite.html&auto=true&save=true&resultsUrl=testsuite/regression-ie7-results.html&close=true"
ant -f "testsuite/build.xml"
if "%ERRORLEVEL%" == "1" exit 1