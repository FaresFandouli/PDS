$services = @(
    @{ Name = "config-service"; Path = "config-service" },
    @{ Name = "discovery-service"; Path = "discovery-service" },
    @{ Name = "gateway-service"; Path = "gateway-service" },
    @{ Name = "auth-service"; Path = "auth-service" },
    @{ Name = "consultation-service"; Path = "consultation-service" },
    @{ Name = "medical-service"; Path = "medical-service" },
    @{ Name = "clinic-service"; Path = "clinic-service" },
    @{ Name = "pds-frontend"; Path = "pds-frontend" }
)

Write-Host "🚀 Starting Docker Image Build Process..." -ForegroundColor Green

foreach ($service in $services) {
    $serviceName = $service.Name
    $servicePath = $service.Path

    if (Test-Path $servicePath) {
        Write-Host "`n🔨 Building $serviceName..." -ForegroundColor Cyan
        
        # Check if Dockerfile exists
        if (!(Test-Path "$servicePath/Dockerfile")) {
            Write-Host "❌ Error: Dockerfile not found in $servicePath!" -ForegroundColor Red
            continue
        }

        # Build Docker image
        docker build -t $serviceName:latest $servicePath
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $serviceName built successfully!" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Failed to build $serviceName" -ForegroundColor Red
        }
    }
    else {
        Write-Host "⚠️ Directory $servicePath not found, skipping..." -ForegroundColor Yellow
    }
}

Write-Host "`n🎉 All builds completed." -ForegroundColor Green
docker images | findstr "service"
