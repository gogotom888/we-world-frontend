@echo off
chcp 65001 >nul
title 完全重建 Strapi 管理後台

echo ========================================
echo    完全重建 Strapi 管理後台
echo ========================================
echo.

cd /d "%~dp0backend-strapi"

echo [1/5] 停止所有 Node 進程...
taskkill /F /IM node.exe /T >nul 2>nul
timeout /t 2 /nobreak >nul
echo ✅ 已停止
echo.

echo [2/5] 刪除 .cache 目錄...
if exist ".cache" (
    rmdir /s /q ".cache"
    echo ✅ .cache 已刪除
) else (
    echo ⚠️  .cache 不存在
)
echo.

echo [3/5] 刪除 dist 目錄...
if exist "dist" (
    rmdir /s /q "dist"
    echo ✅ dist 已刪除
) else (
    echo ⚠️  dist 不存在
)
echo.

echo [4/5] 刪除 build 目錄...
if exist "build" (
    rmdir /s /q "build"
    echo ✅ build 已刪除
) else (
    echo ⚠️  build 不存在
)
echo.

echo [5/5] 啟動 Strapi (完全重建)...
echo.
echo ⏳ 這可能需要 30-60 秒...
echo.

node node_modules\@strapi\strapi\bin\strapi.js develop

pause
