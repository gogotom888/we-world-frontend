@echo off
chcp 65001 >nul
title We-World 全站啟動

echo ========================================
echo    We-World 全站啟動
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] 啟動 Strapi 後台 (端口 1337)...
start "Strapi 後台" cmd /k "cd backend-strapi && node node_modules\@strapi\strapi\bin\strapi.js develop"

echo 等待 Strapi 啟動...
timeout /t 10 /nobreak >nul

echo.
echo [2/2] 啟動前台 Vite (端口 3001)...
start "前台 Vite" cmd /k "node node_modules\vite\bin\vite.js --port 3001"

echo.
echo ========================================
echo ✅ 全站啟動完成!
echo ========================================
echo.
echo 服務地址:
echo   - 前台: http://localhost:3001
echo   - 後台: http://localhost:3001/admin
echo   - API:  http://localhost:1337/api
echo.
echo 兩個命令視窗已開啟,請勿關閉!
echo.
pause
