@echo off
echo Starting all WE World sites...
echo.
echo Main Site: http://localhost:3000
echo About Site: http://localhost:3001
echo News Site: http://localhost:3002
echo Services Site: http://localhost:3003
echo Products Site: http://localhost:3004
echo.
echo Press Ctrl+C to stop all servers
echo.

start "Main Site (3000)" cmd /k "cd /d %~dp0 && npm.cmd run dev:main"
timeout /t 2 /nobreak >nul
start "About Site (3001)" cmd /k "cd /d %~dp0 && npm.cmd run dev:about"
timeout /t 2 /nobreak >nul
start "News Site (3002)" cmd /k "cd /d %~dp0 && npm.cmd run dev:news"
timeout /t 2 /nobreak >nul
start "Services Site (3003)" cmd /k "cd /d %~dp0 && npm.cmd run dev:services"
timeout /t 2 /nobreak >nul
start "Products Site (3004)" cmd /k "cd /d %~dp0 && npm.cmd run dev:products"

echo.
echo All sites are starting in separate windows...
pause
