@echo off
title E-Learning Platform - Clean Install
color 0B

echo ====================================
echo  E-LEARNING PLATFORM - CLEAN INSTALL
echo ====================================
echo.
echo This will:
echo 1. Install root dependencies
echo 2. Install Executable dependencies
echo 3. Install Backend dependencies
echo 4. Install Frontend dependencies
echo 5. Generate Prisma client
echo.
echo This may take 5-10 minutes...
echo.
pause

color 0E
echo.
echo [1/5] Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Failed to install root dependencies!
    pause
    exit /b 1
)

echo.
echo [2/5] Installing Executable dependencies...
cd Executable
call npm install
cd ..
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Failed to install Executable dependencies!
    pause
    exit /b 1
)

echo.
echo [3/5] Installing Backend dependencies...
cd Source\backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Failed to install Backend dependencies!
    pause
    exit /b 1
)

echo.
echo [4/5] Installing Frontend dependencies...
cd ..\frontend
call npm install
cd ..\..
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Failed to install Frontend dependencies!
    pause
    exit /b 1
)

echo.
echo [5/5] Generating Prisma client...
cd Source\backend
call npm run prisma:generate
cd ..\..
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [ERROR] Failed to generate Prisma client!
    pause
    exit /b 1
)

color 0A
echo.
echo ====================================
echo  INSTALLATION COMPLETE!
echo ====================================
echo.
echo You can now run "start-elearning.bat" to start the application.
echo.
pause
