REM Creates a dist directory on the server, 
REM 	then creates a Working copy and populates it with the current test material


SET /P DIST_NUMBER=What is the identifier for this distribution (e.g. 0.6.2)
rmdir /s %~dp0\dist /q
mkdir %~dp0\dist

REM svn mkdir -m "Creating directory to contain distribution %DIST_NUMBER%" https://ubiquity-xforms.googlecode.com/svn/dist/%DIST_NUMBER%
svn checkout https://ubiquity-xforms.googlecode.com/svn/dist/%DIST_NUMBER% %~dp0\dist
svn copy %~dp0\..\samples %~dp0\dist\samples\
svn copy %~dp0\..\testsuite %~dp0\dist\testsuite\
svn copy %~dp0\..\unit-tests %~dp0\dist\unit-tests\