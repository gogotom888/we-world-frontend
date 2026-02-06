@echo off
chcp 65001 >nul
title 重啟前後台服務

echo ========================================
echo    重啟前後台服務
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 停止所有服務...
taskkill /F /IM node.exe /T >nul 2>nul
taskkill /F /IM watchnode.exe /T >nul 2>nul
timeout /t 2 /nobreak >nul
echo    ✓ 已停止
echo.

echo [2/3] 啟動 Strapi 後台 (1337)...
cd backend-strapi
start "Strapi Backend" cmd /c "npm run develop"
cd ..
echo    ✓ 後台啟動中...
echo.

echo [3/3] 等待 15 秒後啟動前台 (3001)...
timeout /t 15 /nobreak
start "Vite Frontend" cmd /c "npm run dev"
echo    ✓ 前台啟動中...
echo.

echo ========================================
echo    服務啟動完成!
echo ========================================
echo.
echo 🔗 後台管理: http://localhost:1337/admin
echo 🔗 前台頁面: http://localhost:3001
echo.
echo 請等待約 10 秒讓服務完全啟動...
echo.

pause
