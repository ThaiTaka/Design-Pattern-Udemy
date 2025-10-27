@echo off
title E-Learning Platform - Starter
color 0A

echo ====================================
echo  E-LEARNING PLATFORM STARTER
echo ====================================
echo.
echo Checking requirements...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

REM Check if Docker Desktop is running
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0E
    echo [WARNING] Docker Desktop is not running!
    echo.
    echo Starting Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo.
    echo Waiting for Docker to start (30 seconds)...
    timeout /t 30 /nobreak >nul
    
    REM Check again
    docker ps >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo [ERROR] Could not start Docker Desktop!
        echo Please start Docker Desktop manually and try again.
        echo.
        pause
        exit /b 1
    )
)

color 0A
echo [OK] All requirements are met!
echo.
echo ====================================
echo  STARTING APPLICATION...
echo ====================================
echo.
echo This will:
echo 1. Clean up old processes
echo 2. Start Docker containers (PostgreSQL, Redis, Adminer)
echo 3. Setup database and seed data
echo 4. Start Backend server (port 5000)
echo 5. Start Frontend server (port 3000)
echo.
echo Press Ctrl+C to stop the application
echo.
timeout /t 3 /nobreak >nul

REM Run the application
call npm run dev

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ====================================
    echo  ERROR OCCURRED!
    echo ====================================
    echo.
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

exit /b 0
