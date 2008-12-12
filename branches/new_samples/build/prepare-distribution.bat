REM Chains the operations needed for creating a distribution, 
REM   pending QA and commission
CALL create-dist-directory.bat
CALL build-ux.bat
CALL copy-distributables.bat
