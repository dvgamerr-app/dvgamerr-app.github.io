@echo off

bun collector/ai-blogs.js https://github.com/%*
if "%~1"=="" (
  echo Commit message is required.
  exit /b 0
)
git add -A
git commit -m "feat: add %*"
git push
