# Restart script for backend server
Write-Host "Stopping any running Node processes..." -ForegroundColor Yellow

# Stop any node processes (be careful - this will stop all node processes)
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node process(es). Please stop the backend server manually (Ctrl+C) first." -ForegroundColor Red
    Write-Host "Then run: npx prisma generate" -ForegroundColor Yellow
    Write-Host "Then run: npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "No Node processes found. Regenerating Prisma client..." -ForegroundColor Green
    npx prisma generate
    Write-Host "`nStarting server..." -ForegroundColor Green
    npm run dev
}


