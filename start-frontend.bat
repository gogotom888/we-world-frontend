@echo off
chcp 65001 >nul
title 啟動前台

cd /d "%~dp0"
npm run dev
