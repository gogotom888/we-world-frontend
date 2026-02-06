@echo off
chcp 65001 >nul
title 安裝 CKEditor 插件

echo ========================================
echo    安裝 Strapi CKEditor 編輯器插件
echo ========================================
echo.

cd /d "%~dp0backend-strapi"

echo 正在安裝 @ckeditor/strapi-plugin-ckeditor...
echo.

call npm install @ckeditor/strapi-plugin-ckeditor

if errorlevel 1 (
    echo.
    echo ❌ 安裝失敗
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 安裝成功!
echo ========================================
echo.
echo 下一步: 重啟 Strapi 服務以載入插件
echo.
pause
