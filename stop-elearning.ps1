# E-Learning Platform Stopper
# Copyright 2025 ThaiTaka

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  E-LEARNING PLATFORM - STOPPER" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

# Stop Docker containers
Write-Host "[1/3] Stopping Docker containers..." -ForegroundColor Yellow
try {
    Set-Location -Path "d:\udemy\Executable"
    docker-compose down
    Write-Host "  -> Docker containers stopped successfully!" -ForegroundColor Green
} catch {
    Write-Host "  -> Warning: Could not stop Docker containers" -ForegroundColor Red
}

# Kill Node.js processes on port 3000 (Frontend)
Write-Host ""
Write-Host "[2/3] Stopping Frontend (Port 3000)..." -ForegroundColor Yellow
try {
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($port3000) {
        foreach ($pid in $port3000) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Write-Host "  -> Frontend stopped!" -ForegroundColor Green
    } else {
        Write-Host "  -> Frontend is not running" -ForegroundColor Gray
    }
} catch {
    Write-Host "  -> Frontend is not running" -ForegroundColor Gray
}

# Kill Node.js processes on port 5000 (Backend)
Write-Host ""
Write-Host "[3/3] Stopping Backend (Port 5000)..." -ForegroundColor Yellow
try {
    $port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($port5000) {
        foreach ($pid in $port5000) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
        Write-Host "  -> Backend stopped!" -ForegroundColor Green
    } else {
        Write-Host "  -> Backend is not running" -ForegroundColor Gray
    }
} catch {
    Write-Host "  -> Backend is not running" -ForegroundColor Gray
}

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host "  ALL SERVICES STOPPED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
