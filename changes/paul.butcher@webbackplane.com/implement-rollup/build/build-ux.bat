REM Build script for creating rolled up versions of ubiquity-xforms.
REM 


copy %~dp0\..\package\ubiquity-xforms.js %~dp0\..\package\ubiquity-xforms.js.bak
copy %~dp0\..\package\ubiquity-xforms.css %~dp0\..\package\ubiquity-xforms.css.bak

cscript %~dp0\rollup\make-rollup.wsf /js:%~dp0\..\package\ubiquity-xforms.js /css:%~dp0\..\assets\ubiquity-xforms.css /paths:xforms-loader:file:///%~dp0../lib/xforms/, < %~dp0\..\lib\xforms\xforms-loader.js

