REM Chains the operations needed for creating a distribution, pending QA and commission
CALL create-dist-directory.bat
CALL build-ux.bat
CALL copy-distributables.bat
