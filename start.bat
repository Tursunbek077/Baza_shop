@echo off
title STARK SHOP ADMIN
echo ========================================================
echo       STARK SHOP - ADMIN BOSHQARUV PANELINI OCHISH
echo ========================================================
echo.
cd /d "%~dp0"
echo Server ishga tushmoqda va brauzer avtomatik ochiladi...
call npm.cmd run dev -- --open
pause
