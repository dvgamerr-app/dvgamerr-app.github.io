@echo off
if "%~1"=="" (
  echo Commit message is required.
  exit /b 0
)
git add -A
git commit -m "feat: %*"
git push
