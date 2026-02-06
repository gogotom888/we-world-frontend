@echo off
title Strapi 簡易啟動
cd /d "%~dp0backend-strapi"

echo ========================================
echo    啟動 Strapi 後台
echo ========================================
echo.
echo 正在啟動...請等待約 30 秒
echo.

REM 使用 node 直接執行 Strapi
node node_modules\@strapi\strapi\bin\strapi.js develop

echo.
echo Strapi 已停止
pause
