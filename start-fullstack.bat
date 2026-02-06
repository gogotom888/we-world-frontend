@echo off
chcp 65001 >nul
title We-World Precision Engineering - 全栈启动

echo ========================================
echo    We-World 全栈开发环境启动
echo ========================================
echo.

cd /d %~dp0

:: 检查Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ 错误: 未找到Node.js
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js版本:
call node -v
echo.

:: 启动Strapi后端
echo [1/2] 启动Strapi后端...
cd backend-strapi

if not exist ".env" (
    echo ⚠️  警告: backend-strapi\.env不存在
    echo    请复制.env.example为.env并配置数据库
    cd ..
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo 📦 首次运行,安装后端依赖...
    call npm install
)

echo 启动后端服务器(端口1337)...
start "We-World Backend" cmd /k "npm run develop"
timeout /t 5 /nobreak >nul

cd ..

:: 启动前端
echo.
echo [2/2] 启动前端开发服务器...

if not exist "node_modules" (
    echo 📦 安装前端依赖...
    call npm install
)

echo.
echo ========================================
echo ✅ 启动完成!
echo ========================================
echo.
echo 服务地址:
echo   - 前端: http://localhost:5173
echo   - 后端API: http://localhost:1337/api
echo   - 管理后台: http://localhost:1337/admin
echo.
echo ⚠️  注意: 首次访问管理后台需要创建管理员账号
echo.
echo 按任意键启动前端...
pause >nul

call npm run dev

pause
