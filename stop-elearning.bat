@echo off
title E-Learning Platform - Stop
color 0C

echo ====================================
echo  STOPPING E-LEARNING PLATFORM
echo ====================================
echo.

echo Stopping Docker containers...
cd Executable
docker-compose down
cd ..

echo.
echo Stopping Node processes on ports 3000 and 5000...

REM Kill process on port 3000 (Frontend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping process on port 3000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>nul
)

REM Kill process on port 5000 (Backend)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo Stopping process on port 5000 (PID: %%a)
    taskkill /F /PID %%a >nul 2>nul
)

color 0A
echo.
echo ====================================
echo  ALL SERVICES STOPPED!
echo ====================================
echo.
pause
