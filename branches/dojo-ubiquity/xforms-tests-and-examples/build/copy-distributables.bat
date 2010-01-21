REM Copies the rolled up build and other distributables into a waiting dist directory

md %~dp0\dist\lib
md %~dp0\dist\lib\xforms

xcopy %~dp0\..\package %~dp0\dist\package /I
xcopy %~dp0\..\src\assets %~dp0\dist\assets /I /S
xcopy %~dp0\..\src\behaviours %~dp0\dist\behaviours /I
copy %~dp0\..\src\ubiquity-loader.js %~dp0\dist\ubiquity-loader.js
copy %~dp0\..\src\lib\sniffer.js %~dp0\dist\lib\sniffer.js
copy %~dp0\..\src\lib\xforms\ie-instance-fixer.js %~dp0\dist\lib\xforms\ie-instance-fixer.js
copy %~dp0\..\src\lib\xforms\ie6-css-selectors-fixer.js %~dp0\dist\lib\xforms\ie6-css-selectors-fixer.js
copy %~dp0\..\src\lib\xforms\set-document-loaded.js %~dp0\dist\lib\xforms\set-document-loaded.js