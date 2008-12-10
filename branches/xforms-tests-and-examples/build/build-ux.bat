REM Build script for creating rolled up versions of ubiquity-xforms.
REM 


copy %~dp0\..\package\ubiquity-xforms.js %~dp0\..\package\ubiquity-xforms.js.bak
copy %~dp0\..\package\ubiquity-xforms.css %~dp0\..\package\ubiquity-xforms.css.bak

cscript %~dp0\rollup\make-rollup.wsf /js:%~dp0\..\package\ubiquity-xforms.js /css:%~dp0\..\src\assets\ubiquity-xforms.css /paths:xforms-loader:file:///%~dp0../src/lib/xforms/, < %~dp0\..\src\lib\xforms\xforms-loader.js

