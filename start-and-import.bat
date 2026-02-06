@echo off
chcp 65001 >nul
title 啟動 Strapi 並執行匯入

echo ========================================
echo    啟動 Strapi 並執行產品匯入
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 啟動 Strapi 後台...
cd backend-strapi
start "Strapi Backend" cmd /c "npm run develop"
cd ..
echo    ✓ 後台啟動中...
echo.

echo [2/3] 等待 Strapi 完全啟動...
echo    請等待約 30 秒...
timeout /t 30 /nobreak
echo    ✓ 等待完成
echo.

echo [3/3] 執行產品匯入...
echo ========================================
echo.

cd backend-strapi
node scripts/import-products.js

echo.
echo ========================================
echo    完成!
echo ========================================
echo.
echo 🔗 後台: http://localhost:1337/admin
echo 🔗 前台: http://localhost:3001
echo.

pause
