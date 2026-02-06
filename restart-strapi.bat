@echo off
chcp 65001 >nul
title Strapi 重啟

echo ========================================
echo    Strapi 後台重啟中...
echo ========================================
echo.

:: 切換到 backend-strapi 目錄
cd /d "%~dp0backend-strapi"

:: 檢查 Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ 錯誤: 未找到 Node.js
    pause
    exit /b 1
)

echo ✅ Node.js 版本:
node -v
echo.

:: 終止所有 node 進程
echo 🛑 終止現有 Node 進程...
taskkill /F /IM node.exe >nul 2>nul
timeout /t 2 /nobreak >nul

:: 啟動 Strapi
echo 🚀 啟動 Strapi 開發服務器...
echo.
echo 服務地址:
echo   - 前台: http://localhost:3001
echo   - 後台管理: http://localhost:3001/admin
echo   - API: http://localhost:1337/api
echo.

npm run develop

pause
