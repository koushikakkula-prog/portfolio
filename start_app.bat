@echo off
title GenDoc AI - Generative AI Technical Documentation Generator Launcher
color 0b
echo ===============================================================================
echo   GenDoc AI - Generative AI-Based Technical Documentation Generator
echo   "Turn Code Into Clear Documentation with AI."
echo ===============================================================================
echo.

echo [1/2] Launching Python FastAPI Backend Server on Port 8000...
start "GenDoc AI - FastAPI Backend (Port 8000)" cmd /k "cd backend && python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Waiting 2 seconds for backend initialization...
timeout /t 2 /nobreak >nul

echo [3/3] Launching React Frontend Server on Port 5173...
start "GenDoc AI - React Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ===============================================================================
echo   GenDoc AI Application Successfully Launched!
echo   Frontend URL: http://localhost:5173
echo   Backend API Docs: http://127.0.0.1:8000/docs
echo ===============================================================================
echo.
pause
