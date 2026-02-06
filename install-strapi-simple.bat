@echo off
chcp 65001 >nul
title Strapi 后台安装

cd /d %~dp0

echo ========================================
echo  正在安装 Strapi 后台系统
echo ========================================
echo.
echo 这需要几分钟时间,请耐心等待...
echo 安装过程中如果询问是否登录,请选择 "Skip" 跳过
echo.
pause

REM 删除旧目录
if exist backend-strapi (
    echo 删除旧的backend-strapi目录...
    rmdir /s /q backend-strapi
)

echo.
echo 开始安装 Strapi...
echo.

REM 使用npx安装
npx create-strapi-app@latest backend-strapi --quickstart --no-run

if errorlevel 1 (
    echo.
    echo ❌ 安装失败
    echo.
    echo 可能的原因:
    echo 1. Node.js版本过新 (当前v24,推荐v18或v20)
    echo 2. 网络连接问题
    echo 3. 权限不足
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Strapi 安装成功!
echo ========================================
echo.
echo 接下来启动Strapi...
pause

cd backend-strapi
npm run develop

pause
