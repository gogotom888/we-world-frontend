@echo off
chcp 65001 >nul
title 強制重啟並清除快取

echo ========================================
echo    強制重啟前台服務 (清除快取)
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] 停止所有 Node 進程...
taskkill /F /IM node.exe /T >nul 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] 刪除 Vite 快取...
if exist ".vite" (
    rmdir /s /q ".vite"
    echo    ✓ .vite 已刪除
)
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite"
    echo    ✓ node_modules\.vite 已刪除
)

echo [3/4] 刪除 dist 目錄...
if exist "dist" (
    rmdir /s /q "dist"
    echo    ✓ dist 已刪除
)

echo.
echo [4/4] 啟動前台服務 (端口 3001)...
echo.
echo ----------------------------------------
echo  請在瀏覽器按 Ctrl+Shift+R 強制刷新
echo  或使用無痕模式訪問: http://localhost:3001
echo ----------------------------------------
echo.

npm run dev

pause
