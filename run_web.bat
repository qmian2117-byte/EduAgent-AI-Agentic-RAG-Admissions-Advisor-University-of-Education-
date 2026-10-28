@echo off
title UniGuide AI - Enterprise Admissions Advisor
color 0B
echo ======================================================================
echo    UniGuide AI: Enterprise Agentic Admissions Advisor (University of Education)
echo ======================================================================
echo.
echo Starting UniGuide AI Local Web Application...
echo.
start "" "http://localhost:8000"
python server.py
pause
