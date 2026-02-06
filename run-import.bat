@echo off
chcp 65001 >nul
title 執行產品匯入

echo ========================================
echo    執行產品匯入腳本
echo ========================================
echo.

cd /d "%~dp0backend-strapi"

echo 🚀 開始匯入產品資料...
echo.

node scripts/import-products.js

echo.
echo ========================================
echo.
pause
