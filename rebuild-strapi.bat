@echo off
chcp 65001 >nul
title 清除 Strapi 緩存並重建

echo ========================================
echo    清除 Strapi 緩存並重建
echo ========================================
echo.

cd /d "%~dp0backend-strapi"

echo [1/3] 清除 .cache 目錄...
if exist ".cache" (
    rmdir /s /q ".cache"
    echo ✅ .cache 已刪除
) else (
    echo ⚠️  .cache 不存在
)
echo.

echo [2/3] 清除 dist 目錄...
if exist "dist" (
    rmdir /s /q "dist"
    echo ✅ dist 已刪除
) else (
    echo ⚠️  dist 不存在
)
echo.

echo [3/3] 清除 build 目錄...
if exist "build" (
    rmdir /s /q "build"
    echo ✅ build 已刪除
) else (
    echo ⚠️  build 不存在
)
echo.

echo ========================================
echo ✅ 緩存清除完成!
echo ========================================
echo.
echo 現在啟動 Strapi 進行完整重建...
echo.

node node_modules\@strapi\strapi\bin\strapi.js develop

pause
