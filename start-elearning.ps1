# E-Learning Platform Starter
# PowerShell Script version

$Host.UI.RawUI.WindowTitle = "E-Learning Platform - Starter"
$Host.UI.RawUI.ForegroundColor = "Green"

Write-Host "====================================" -ForegroundColor Cyan
Write-Host " E-LEARNING PLATFORM STARTER" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# Check Node.js
Write-Host "Checking requirements..." -ForegroundColor Yellow
Write-Host ""

if (-not (Test-CommandExists "node")) {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[OK] Node.js is installed" -ForegroundColor Green

# Check Docker
$dockerRunning = $false
try {
    docker ps | Out-Null
    $dockerRunning = $true
} catch {
    $dockerRunning = $false
}

if (-not $dockerRunning) {
    Write-Host "[WARNING] Docker Desktop is not running!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
    
    # Try to start Docker Desktop
    $dockerPath = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    if (Test-Path $dockerPath) {
        Start-Process $dockerPath
        Write-Host "Waiting for Docker to start (30 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30
        
        # Check again
        try {
            docker ps | Out-Null
            $dockerRunning = $true
            Write-Host "[OK] Docker is now running" -ForegroundColor Green
        } catch {
            Write-Host "[ERROR] Could not start Docker Desktop!" -ForegroundColor Red
            Write-Host "Please start Docker Desktop manually and try again." -ForegroundColor Red
            Write-Host ""
            Read-Host "Press Enter to exit"
            exit 1
        }
    } else {
        Write-Host "[ERROR] Docker Desktop is not installed!" -ForegroundColor Red
        Write-Host "Please install Docker Desktop from https://www.docker.com/" -ForegroundColor Red
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "[OK] Docker is running" -ForegroundColor Green
Write-Host ""

Write-Host "====================================" -ForegroundColor Cyan
Write-Host " STARTING APPLICATION..." -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "1. Clean up old processes"
Write-Host "2. Start Docker containers (PostgreSQL, Redis, Adminer)"
Write-Host "3. Setup database and seed data"
Write-Host "4. Start Backend server (port 5000)"
Write-Host "5. Start Frontend server (port 3000)"
Write-Host ""
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 2

# Run the application
try {
    npm run dev
    if ($LASTEXITCODE -ne 0) {
        throw "npm run dev failed"
    }
} catch {
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Red
    Write-Host " ERROR OCCURRED!" -ForegroundColor Red
    Write-Host "====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check the error messages above." -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}
