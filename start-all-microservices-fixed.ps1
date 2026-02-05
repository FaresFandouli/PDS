# Script pour demarrer tous les microservices
# Nom: start-all-microservices.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Demarrage de Tous les Microservices" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que Docker est demarre
Write-Host "Verification de l'infrastructure Docker..." -ForegroundColor Yellow
try {
    $dockerStatus = docker-compose ps --format json 2>$null | ConvertFrom-Json
    if ($dockerStatus) {
        $runningServices = ($dockerStatus | Where-Object { $_.State -eq "running" }).Count
        Write-Host "OK Infrastructure Docker ($runningServices services)" -ForegroundColor Green
    }
} catch {
    Write-Host "AVERTISSEMENT: Impossible de verifier Docker" -ForegroundColor Yellow
}

Write-Host ""

# Services a demarrer (avec delai)
$services = @(
    @{Name="config-service"; Port=8888; Wait=30},
    @{Name="discovery-service"; Port=8761; Wait=30},
    @{Name="gateway-service"; Port=8081; Wait=30},
    @{Name="auth-service"; Port=8090; Wait=15},
    @{Name="clinic-service"; Port=8083; Wait=15},
    @{Name="medical-service"; Port=8084; Wait=15},
    @{Name="consultation-service"; Port=8085; Wait=15}
)

Write-Host "Les services vont demarrer dans des fenetres separees." -ForegroundColor Yellow
Write-Host "Ne fermez pas ces fenetres!" -ForegroundColor Yellow
Write-Host ""
Start-Sleep -Seconds 3

foreach ($service in $services) {
    Write-Host "Demarrage de $($service.Name) (Port: $($service.Port))..." -ForegroundColor Yellow
    
    $servicePath = Join-Path $PSScriptRoot $service.Name
    
    if (Test-Path $servicePath) {
        # Demarrer dans une nouvelle fenetre PowerShell
        $title = "PDS - $($service.Name)"
        Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-Command",
            "Set-Location '$servicePath'; `$host.UI.RawUI.WindowTitle = '$title'; Write-Host '========================================' -ForegroundColor Cyan; Write-Host 'Demarrage de $($service.Name)' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; Write-Host ''; mvn spring-boot:run"
        )
        
        Write-Host "OK $($service.Name) demarre" -ForegroundColor Green
        Write-Host "Attente de $($service.Wait) secondes..." -ForegroundColor Gray
        Start-Sleep -Seconds $service.Wait
    } else {
        Write-Host "ERREUR Dossier non trouve: $servicePath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Tous les Services Sont en Cours de Demarrage" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Verifiez Eureka Dashboard dans 2 minutes:" -ForegroundColor Yellow
Write-Host "  http://localhost:8761" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services attendus:" -ForegroundColor Yellow
Write-Host "  - GATEWAY-SERVICE" -ForegroundColor White
Write-Host "  - AUTH-SERVICE" -ForegroundColor White
Write-Host "  - CLINIC-SERVICE" -ForegroundColor White
Write-Host "  - MEDICAL-SERVICE" -ForegroundColor White
Write-Host "  - CONSULTATION-SERVICE" -ForegroundColor White
Write-Host ""
Write-Host "Pour demarrer le frontend:" -ForegroundColor Yellow
Write-Host "  cd pds-frontend" -ForegroundColor White
Write-Host "  npm install" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Puis ouvrez: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
