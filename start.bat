@echo off
title Portfolio Vault
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
)

if not exist ".env.local" (
  if exist ".env.example" (
    copy /Y ".env.example" ".env.local" >nul
    echo Created .env.local - set MONGODB_URI before registering.
  )
)

echo Starting at http://localhost:3000
start "" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"
call npm run dev
pause
