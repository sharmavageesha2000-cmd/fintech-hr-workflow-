@echo off
title HR SmartFlow AI Recruitment Platform
echo ======================================================================
echo           HR SMARTFLOW - ENTERPRISE AI RECRUITMENT PLATFORM
echo               Powered by Gemini AI, n8n, & Gmail SMTP
echo ======================================================================
echo.
echo Recruiter: Vageesha Sharma (sharmavageesha2000@gmail.com)
echo.
echo [1] HR Dashboard:      http://localhost:3000
echo [2] Assessment Portal: http://localhost:3000/assessment
echo [3] Corporate Website: http://localhost:3000/website
echo.
echo Starting local server daemon...
start "" http://localhost:3000
node server.js
pause
