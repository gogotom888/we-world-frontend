@echo off
chcp 65001 >nul
title 啟動 Strapi 後台

cd /d "%~dp0backend-strapi"
node node_modules\@strapi\strapi\bin\strapi.js develop
