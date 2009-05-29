echo Downloading test suite.
start /wait wget --accept=xhtml --no-parent --wait 2 --recursive --no-host-directories --cut-dirs=4 http://www.w3.org/MarkUp/Forms/Test/XForms1.1/Edition1/
echo Starting Apache Ant XSLT.
call runant.bat
echo Compiling Java post processor.
start /wait javac RecursiveStringReplacer.java
echo Making Ubiquity JavaScript URIs relative.
start /wait java RecursiveStringReplacer Edition1 "http://ubiquity-xforms.googlecode.com/trunk/ubiquity-loader.js" "../../../src/ubiquity-loader.js" "../"
echo Removing ":xhtml" namespace definitions.
start /wait java RecursiveStringReplacer Edition1 ":xhtml" "" ""
echo Removing "xhtml:" namespace prefixes.
start /wait java RecursiveStringReplacer Edition1 "xhtml:" "" ""
echo Removing robots.txt.
del robots.txt
echo Removing driverPages directory.
rmdir /Q /S Edition1\driverPages
echo Removing zip directory.
rmdir /Q /S Edition1\zip
echo Removing backup files.
del /Q /S Edition1\*.bak
echo DONE!
pause