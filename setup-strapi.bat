@echo off
chcp 65001 >nul
echo ========================================
echo  Strapi 后台快速安装脚本
echo ========================================
echo.

cd /d %~dp0

echo [提示] 这将删除现有的backend-strapi目录并重新安装
echo.
pause

echo [1/3] 删除旧目录...
if exist backend-strapi (
    rmdir /s /q backend-strapi
)

echo [2/3] 使用官方命令创建Strapi项目...
echo 这需要几分钟时间,请耐心等待...
echo.

call npx create-strapi-app@latest backend-strapi --quickstart --no-run

if errorlevel 1 (
    echo.
    echo ❌ 安装失败
    echo 请确保:
    echo 1. 已安装Node.js (推荐 v18 或 v20)
    echo 2. 网络连接正常
    pause
    exit /b 1
)

echo.
echo [3/3] 配置完成!
echo.
echo ========================================
echo ✅ Strapi 安装成功!
echo ========================================
echo.
echo 后台地址: http://localhost:1337/admin
echo API地址: http://localhost:1337/api
echo.
echo 按任意键启动后台...
pause >nul

cd backend-strapi
call npm run develop

pause
