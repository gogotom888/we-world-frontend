@echo off
chcp 65001 >nul
title Strapi 診斷與啟動

echo ========================================
echo    Strapi 啟動診斷
echo ========================================
echo.

:: 切換到項目根目錄
cd /d "%~dp0"

echo [1/5] 檢查環境...
echo.

:: 檢查 Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ 錯誤: 未找到 Node.js
    echo 請安裝 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安裝
node -v
echo.

:: 檢查 npm
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ 錯誤: 未找到 npm
    pause
    exit /b 1
)

echo ✅ npm 已安裝
npm -v
echo.

echo [2/5] 檢查專案結構...
echo.

:: 檢查 backend-strapi 目錄
if not exist "backend-strapi" (
    echo ❌ 錯誤: backend-strapi 目錄不存在
    pause
    exit /b 1
)
echo ✅ backend-strapi 目錄存在

:: 進入 backend-strapi 目錄
cd backend-strapi

:: 檢查 .env 檔案
if not exist ".env" (
    echo ❌ 錯誤: .env 檔案不存在
    echo 請創建 .env 檔案
    pause
    exit /b 1
)
echo ✅ .env 檔案存在
echo.

:: 檢查 node_modules
if not exist "node_modules" (
    echo ⚠️  警告: node_modules 不存在
    echo 正在安裝依賴...
    call npm install
    if errorlevel 1 (
        echo ❌ npm install 失敗
        pause
        exit /b 1
    )
) else (
    echo ✅ node_modules 已存在
)
echo.

echo [3/5] 檢查端口佔用...
echo.

:: 檢查 1337 端口
netstat -ano | findstr ":1337" >nul 2>nul
if not errorlevel 1 (
    echo ⚠️  警告: 端口 1337 已被佔用
    echo 正在終止佔用進程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":1337"') do (
        taskkill /F /PID %%a >nul 2>nul
    )
    timeout /t 2 /nobreak >nul
) else (
    echo ✅ 端口 1337 可用
)
echo.

echo [4/5] 檢查資料庫...
echo.

if exist ".tmp\data.db" (
    echo ✅ SQLite 資料庫存在
) else (
    echo ⚠️  資料庫將在首次啟動時創建
)
echo.

echo [5/5] 啟動 Strapi...
echo.
echo 服務地址:
echo   - API: http://localhost:1337/api
echo   - 管理後台: http://localhost:1337/admin
echo   - (透過 Vite 代理): http://localhost:3001/admin
echo.
echo 正在啟動,請稍候...
echo ========================================
echo.

:: 方法1: 嘗試使用 node 直接執行
echo 正在嘗試啟動 Strapi...
echo.

if exist "node_modules\@strapi\strapi\bin\strapi.js" (
    echo ✅ 找到 Strapi 執行檔
    node node_modules\@strapi\strapi\bin\strapi.js develop
) else (
    echo ❌ 錯誤: 找不到 Strapi 執行檔
    echo 路徑: node_modules\@strapi\strapi\bin\strapi.js
    echo.
    echo 正在檢查 node_modules 結構...
    if exist "node_modules\@strapi" (
        dir node_modules\@strapi
    ) else (
        echo ❌ node_modules\@strapi 不存在
        echo 請執行: npm install
    )
)

echo.
echo ========================================
echo 如果看到此訊息,表示 Strapi 已停止
echo ========================================
pause
