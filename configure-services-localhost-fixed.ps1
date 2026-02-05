# Script pour configurer les services pour utilisation locale (non-Docker)
# Nom: configure-services-localhost.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Configuration des Services pour Localhost" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    @{
        Name = "discovery-service"
        Config = @"
server:
  port: 8761

spring:
  application:
    name: discovery-service

eureka:
  client:
    register-with-eureka: false
    fetch-registry: false
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
  server:
    enable-self-preservation: false

management:
  endpoints:
    web:
      exposure:
        include: '*'
"@
    },
    @{
        Name = "gateway-service"
        Config = @"
server:
  port: 8081

spring:
  application:
    name: gateway-service
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**
        - id: clinic-service
          uri: lb://clinic-service
          predicates:
            - Path=/api/clinic/**
        - id: medical-service
          uri: lb://medical-service
          predicates:
            - Path=/api/medical/**
        - id: consultation-service
          uri: lb://consultation-service
          predicates:
            - Path=/api/consultation/**
      default-filters:
        - DedupeResponseHeader=Access-Control-Allow-Credentials Access-Control-Allow-Origin
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:3000"
            allowedMethods:
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: true

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/

management:
  endpoints:
    web:
      exposure:
        include: '*'
"@
    },
    @{
        Name = "auth-service"
        Config = @"
server:
  port: 8090

spring:
  application:
    name: auth-service
  datasource:
    url: jdbc:mysql://localhost:3306/pds_auth?createDatabaseIfNotExist=true
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/pds-realm
          jwk-set-uri: http://localhost:8080/realms/pds-realm/protocol/openid-connect/certs

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: '*'
"@
    },
    @{
        Name = "clinic-service"
        Config = @"
server:
  port: 8083

spring:
  application:
    name: clinic-service
  datasource:
    url: jdbc:mysql://localhost:3306/pds_clinic?createDatabaseIfNotExist=true
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/pds-realm
          jwk-set-uri: http://localhost:8080/realms/pds-realm/protocol/openid-connect/certs

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: '*'
"@
    },
    @{
        Name = "medical-service"
        Config = @"
server:
  port: 8084

spring:
  application:
    name: medical-service
  datasource:
    url: jdbc:mysql://localhost:3306/pds_medical?createDatabaseIfNotExist=true
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/pds-realm
          jwk-set-uri: http://localhost:8080/realms/pds-realm/protocol/openid-connect/certs

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: '*'
"@
    },
    @{
        Name = "consultation-service"
        Config = @"
server:
  port: 8085

spring:
  application:
    name: consultation-service
  datasource:
    url: jdbc:mysql://localhost:3306/pds_consultation?createDatabaseIfNotExist=true
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/pds-realm
          jwk-set-uri: http://localhost:8080/realms/pds-realm/protocol/openid-connect/certs

eureka:
  client:
    serviceUrl:
      defaultZone: http://localhost:8761/eureka/
    register-with-eureka: true
    fetch-registry: true
  instance:
    prefer-ip-address: true

management:
  endpoints:
    web:
      exposure:
        include: '*'
"@
    }
)

# Mettre a jour les fichiers application.yml
foreach ($service in $services) {
    $configPath = Join-Path $PSScriptRoot "$($service.Name)\src\main\resources\application.yml"
    
    if (Test-Path $configPath) {
        Write-Host "Configuration de $($service.Name)..." -ForegroundColor Yellow
        $service.Config | Out-File -FilePath $configPath -Encoding UTF8
        Write-Host "OK $($service.Name) configure" -ForegroundColor Green
    } else {
        Write-Host "ERREUR Fichier non trouve: $configPath" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Configuration terminee!" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaine etape: Compilez les services avec:" -ForegroundColor Yellow
Write-Host "  .\compile-all-services.ps1" -ForegroundColor White
