# E-Learning Platform - Dependency Installer
# Copyright 2025 ThaiTaka

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  E-LEARNING PLATFORM - DEPENDENCY INSTALLER" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will install ALL dependencies for the project." -ForegroundColor White
Write-Host "Estimated time: 5-10 minutes" -ForegroundColor Gray
Write-Host "Make sure you have Internet connection!" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Do you want to continue? (Y/N)"
if ($confirmation -ne 'Y' -and $confirmation -ne 'y') {
    Write-Host "Installation cancelled." -ForegroundColor Red
    exit 1
}

$ErrorActionPreference = "Stop"

# Function to check if command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Check Node.js
Write-Host ""
Write-Host "[CHECK] Verifying Node.js installation..." -ForegroundColor Yellow
if (Test-CommandExists "node") {
    $nodeVersion = node --version
    Write-Host "  -> Node.js $nodeVersion found!" -ForegroundColor Green
} else {
    Write-Host "  -> ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "  -> Please download from: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

try {
    # Step 1: Root dependencies
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor Cyan
    Write-Host "[1/5] Installing ROOT dependencies..." -ForegroundColor Yellow
    Write-Host "===========================================================" -ForegroundColor Cyan
    Set-Location -Path "d:\udemy"
    npm install
    Write-Host "  -> ROOT dependencies installed!" -ForegroundColor Green

    # Step 2: Executable dependencies
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor Cyan
    Write-Host "[2/5] Installing EXECUTABLE dependencies..." -ForegroundColor Yellow
    Write-Host "===========================================================" -ForegroundColor Cyan
    Set-Location -Path "d:\udemy\Executable"
    npm install
    Write-Host "  -> EXECUTABLE dependencies installed!" -ForegroundColor Green

    # Step 3: Backend dependencies
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor Cyan
    Write-Host "[3/5] Installing BACKEND dependencies..." -ForegroundColor Yellow
    Write-Host "===========================================================" -ForegroundColor Cyan
    Set-Location -Path "d:\udemy\Source\backend"
    npm install
    Write-Host "  -> BACKEND dependencies installed!" -ForegroundColor Green

    # Step 4: Frontend dependencies
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor Cyan
    Write-Host "[4/5] Installing FRONTEND dependencies..." -ForegroundColor Yellow
    Write-Host "===========================================================" -ForegroundColor Cyan
    Set-Location -Path "d:\udemy\Source\frontend"
    npm install
    Write-Host "  -> FRONTEND dependencies installed!" -ForegroundColor Green

    # Step 5: Generate Prisma Client
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor Cyan
    Write-Host "[5/5] Generating Prisma Client..." -ForegroundColor Yellow
    Write-Host "===========================================================" -ForegroundColor Cyan
    Set-Location -Path "d:\udemy\Source\backend"
    npx prisma generate
    Write-Host "  -> Prisma Client generated!" -ForegroundColor Green

    # Success
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor Cyan
    Write-Host "  INSTALLATION COMPLETED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "===========================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Open Docker Desktop" -ForegroundColor White
    Write-Host "  2. Run 'ELearn-Start.exe' to start the platform" -ForegroundColor White
    Write-Host ""

} catch {
    Write-Host ""
    Write-Host "===========================================================" -ForegroundColor Red
    Write-Host "  ERROR OCCURRED!" -ForegroundColor Red
    Write-Host "===========================================================" -ForegroundColor Red
    Write-Host "Error details: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "  - Check Internet connection" -ForegroundColor White
    Write-Host "  - Close other terminal windows" -ForegroundColor White
    Write-Host "  - Restart your computer" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Set-Location -Path "d:\udemy"
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
