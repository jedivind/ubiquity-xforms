REM Creates a dist directory on the server, 
REM 	then creates a Working copy and populates it with the current test material


SET /P DIST_NUMBER=What is the identifier for this distribution (e.g. 0.6.2)
rmdir /s %~dp0\dist /q
mkdir %~dp0\dist

REM svn mkdir -m "Creating directory to contain distribution %DIST_NUMBER%" https://ubiquity-xforms.googlecode.com/svn/spikes/dist/%DIST_NUMBER%
svn checkout https://ubiquity-xforms.googlecode.com/svn/spikes/dist/%DIST_NUMBER% %~dp0\dist
svn copy %~dp0\..\_samples %~dp0\dist\_samples\
svn copy %~dp0\..\_testsuite %~dp0\dist\_testsuite\
svn copy %~dp0\..\_unit-tests %~dp0\dist\_unit-tests\