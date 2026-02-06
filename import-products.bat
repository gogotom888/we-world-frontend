@echo off
chcp 65001 >nul
title 批量匯入產品資料

echo ========================================
echo    批量匯入產品資料到 Strapi
echo ========================================
echo.

cd /d "%~dp0backend-strapi"

echo [1/4] 檢查依賴套件...
if not exist "node_modules\axios" (
    echo    正在安裝 axios...
    call npm install axios --no-save
)
if not exist "node_modules\form-data" (
    echo    正在安裝 form-data...
    call npm install form-data --no-save
)
echo    ✓ 依賴套件已就緒
echo.

echo [2/4] 停止 Strapi 服務...
taskkill /F /IM node.exe /T >nul 2>nul
timeout /t 2 /nobreak >nul
echo    ✓ 服務已停止
echo.

echo [3/4] 啟動 Strapi (重新載入 schema)...
echo    請等待 Strapi 啟動完成...
start "Strapi Server" cmd /c "npm run develop"
echo    等待 30 秒讓 Strapi 完全啟動...
timeout /t 30 /nobreak
echo    ✓ Strapi 已啟動
echo.

echo [4/4] 執行匯入腳本...
echo ========================================
echo.

node scripts/import-products.js

echo.
echo ========================================
echo.
pause
