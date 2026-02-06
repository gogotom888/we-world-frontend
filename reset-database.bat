@echo off
chcp 65001 >nul
title 重置數據庫並重啟 Strapi

echo ========================================
echo    重置數據庫並重啟 Strapi
echo ========================================
echo.
echo ⚠️  警告: 這將刪除所有現有數據!
echo.
echo 按任意鍵繼續，或關閉視窗取消...
pause >nul

cd /d "%~dp0backend-strapi"

echo.
echo [1/4] 刪除舊的數據庫文件...
if exist ".tmp\data.db" (
    del /f /q ".tmp\data.db"
    echo ✅ 數據庫已刪除
) else (
    echo ⚠️  數據庫文件不存在
)
echo.

echo [2/4] 清除緩存...
if exist ".cache" (
    rmdir /s /q ".cache"
    echo ✅ .cache 已刪除
)
if exist "dist" (
    rmdir /s /q "dist"
    echo ✅ dist 已刪除
)
if exist "build" (
    rmdir /s /q "build"
    echo ✅ build 已刪除
)
echo.

echo [3/4] 重建數據庫...
echo Strapi 將自動創建新的數據庫並執行 bootstrap 初始化
echo.

echo [4/4] 啟動 Strapi...
echo.

node node_modules\@strapi\strapi\bin\strapi.js develop

pause
