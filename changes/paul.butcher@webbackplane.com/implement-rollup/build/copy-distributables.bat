REM Copies the rolled up build and other distributables into a waiting dist directory

md %~dp0\dist\lib
md %~dp0\dist\lib\xforms

xcopy %~dp0\..\package %~dp0\dist\package /I
xcopy %~dp0\..\assets %~dp0\dist\assets /I
xcopy %~dp0\..\behaviours %~dp0\dist\behaviours /I
copy %~dp0\..\ubiquity-loader.js %~dp0\dist\ubiquity-loader.js
copy %~dp0\..\lib\sniffer.js %~dp0\dist\lib\sniffer.js
copy %~dp0\..\lib\xforms\ie-instance-fixer.js %~dp0\dist\lib\xforms\ie-instance-fixer.js
copy %~dp0\..\lib\xforms\ie6-css-selectors-fixer.js %~dp0\dist\lib\xforms\ie6-css-selectors-fixer.js
copy %~dp0\..\lib\xforms\set-document-loaded.js %~dp0\dist\lib\xforms\set-document-loaded.js