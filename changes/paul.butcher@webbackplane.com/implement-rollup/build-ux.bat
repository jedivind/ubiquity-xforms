REM Build script for creating rolled up versions of ubiquity-xforms.
REM 
REM Parameters:
REM   %1 path to a local directory corresponding to http://ubiquity.googlecode.com/svn/trunk/tools/rollup/
REM

rename %~dp0\ubiquity-xforms.js ubiquity-xforms.bak
rename %~dp0\lib\xforms\style\ubiquity-xforms.css ubiquity-xforms.bak

cscript %1\make-rollup.wsf /js:%~dp0\ubiquity-xforms.js /css:%~dp0\lib\xforms\style\ubiquity-xforms.css /paths:xforms-loader:file:///%~dp0/lib/xforms/, < %~dp0\lib\xforms\xforms-loader.js