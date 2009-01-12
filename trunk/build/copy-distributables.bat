@REM Copies the rolled up build and other distributables into a waiting dist directory

@setlocal

@set deploy=%1
@if not "%deploy%"=="" goto do-deploy
@set deploy=%~dp0\dist
@:do-deploy

@if not exist "%deploy%\lib\xforms" mkdir %deploy%\lib\xforms

@xcopy /Y /F %~dp0..\package %deploy%\package /I
@xcopy /Y /F %~dp0..\src\assets %deploy%\assets /I /S
@xcopy /Y /F %~dp0..\src\behaviours %deploy%\behaviours /I
@xcopy /Y /F %~dp0..\src\ubiquity-loader.js %deploy%
@xcopy /Y /F %~dp0..\src\lib\sniffer.js %deploy%\lib
@xcopy /Y /F %~dp0..\src\lib\xforms\ie-instance-fixer.js %deploy%\lib\xforms
@xcopy /Y /F %~dp0..\src\lib\xforms\ie6-css-selectors-fixer.js %deploy%\lib\xforms
@xcopy /Y /F %~dp0..\src\lib\xforms\set-document-loaded.js %deploy%\lib\xforms