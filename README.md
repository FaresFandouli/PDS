# PDS - E-Health Management System

A complete microservices-based E-Health management system built with Spring Boot and React.

## 🏗️ Architecture

### Backend Microservices
- **Config Service** (Port 8888): Centralized configuration management
- **Discovery Service** (Port 8761): Service discovery with Eureka
- **Gateway** (Port 8081): API Gateway with routing and load balancing
- **Auth Service** (Port 8090): Authentication and user management
- **Clinic Service** (Port 8083): Patient and appointment management
- **Medical Service** (Port 8084): Medical records and prescriptions
- **Consultation Service** (Port 8085): Consultation management

### Frontend
- **React Application** (Port 3000): Modern, responsive UI with Tailwind CSS

### Infrastructure
- **Keycloak** (Port 8080): Identity and access management
- **MySQL** (Port 3306): Database
- **Redis** (Port 6379): Caching
- **Kafka** (Port 9092): Message broker

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 17+ (for local development)
- Node.js 18+ (for frontend development)
- Maven 3.8+

### 1. Start Infrastructure Services

```bash
# Start Keycloak, MySQL, Redis, Kafka
docker-compose up -d keycloak mysql redis kafka zookeeper
```

### 2. Configure Keycloak

1. Access Keycloak admin console: http://localhost:8080
2. Login with `admin/admin`
3. Create a new realm: `pds-realm`
4. Create a client: `pds-client`
   - Client Protocol: openid-connect
   - Access Type: confidential
   - Valid Redirect URIs: `http://localhost:3000/*`
   - Web Origins: `http://localhost:3000`
5. Create roles: `ADMIN`, `DOCTOR`, `PATIENT`, `SECRETARY`, `SECURITY_OFFICER`
6. Create test users and assign roles

### 3. Start Microservices

**Option A: Using Docker Compose (Recommended)**
```bash
docker-compose up -d
```

**Option B: Local Development**
```bash
# Start services in order
cd config-service && ./mvnw spring-boot:run &
cd discovery-service && ./mvnw spring-boot:run &
cd gateway-service && ./mvnw spring-boot:run &
cd auth-service && ./mvnw spring-boot:run &
cd clinic-service && ./mvnw spring-boot:run &
cd medical-service && ./mvnw spring-boot:run &
cd consultation-service && ./mvnw spring-boot:run &
```

### 4. Start Frontend

```bash
cd pds-frontend
npm install
npm run dev
```

## 📱 Access the Application

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8081
- **Eureka Dashboard**: http://localhost:8761
- **Keycloak Admin**: http://localhost:8080

## 🔐 Default Credentials

Configure these in Keycloak:

- **Admin**: admin@pds.com / admin123
- **Doctor**: doctor@pds.com / doctor123
- **Patient**: patient@pds.com / patient123

## 📊 API Endpoints

### Auth Service
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

### Clinic Service
- `GET /api/clinic/patients` - Get all patients
- `POST /api/clinic/patients` - Create patient
- `GET /api/clinic/patients/{id}` - Get patient by ID
- `PUT /api/clinic/patients/{id}` - Update patient
- `DELETE /api/clinic/patients/{id}` - Delete patient
- `GET /api/clinic/appointments` - Get all appointments
- `POST /api/clinic/appointments` - Create appointment

### Medical Service
- `GET /api/medical/records` - Get medical records
- `POST /api/medical/records` - Create medical record
- `GET /api/medical/prescriptions` - Get prescriptions
- `POST /api/medical/prescriptions` - Create prescription

### Consultation Service
- `GET /api/consultation/consultations` - Get consultations
- `POST /api/consultation/consultations` - Create consultation

## 🛠️ Development

### Building Services

```bash
# Build all services
./build-all.sh

# Build specific service
cd [service-name]
./mvnw clean package
```

### Running Tests

```bash
# Run tests for all services
./test-all.sh

# Run tests for specific service
cd [service-name]
./mvnw test
```

### Database Migrations

Databases are automatically created and initialized on first run.

## 📦 Project Structure

```
pds-complete-project/
├── config-service/           # Configuration server
├── discovery-service/        # Eureka server
├── gateway-service/          # API Gateway
├── auth-service/             # Authentication
├── clinic-service/           # Patient & appointments
├── medical-service/          # Medical records
├── consultation-service/     # Consultations
├── pds-frontend/             # React application
├── docker-compose.yml        # Docker orchestration
├── init-db.sql              # Database initialization
└── README.md                # This file
```

## 🔒 Security

- JWT-based authentication via Keycloak
- Role-based access control (RBAC)
- OAuth2 Resource Server protection
- CORS configuration for frontend
- Secure password storage

## 🌐 Technologies

### Backend
- Spring Boot 3.2.0
- Spring Cloud 2023.0.0
- Spring Security with OAuth2
- MySQL 8.0
- Redis
- Apache Kafka
- Keycloak 23.0

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- React Query
- Axios
- Keycloak JS Adapter

## 📝 Environment Variables

Create `.env` file in root:

```env
# Database
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=pds_db

# Keycloak
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=admin

# Services
CONFIG_SERVER_PORT=8888
EUREKA_SERVER_PORT=8761
GATEWAY_PORT=8081
```

## 🧪 Testing

### Testing with Postman

Import the Postman collection from `postman/PDS-API.postman_collection.json`

1. Get Keycloak access token
2. Add token to Authorization header
3. Test endpoints

### Integration Tests

```bash
cd [service-name]
./mvnw verify
```

## 🚀 Deployment

### Docker Production Build

```bash
# Build all images
docker-compose build

# Push to registry
docker-compose push

# Deploy
docker-compose up -d
```

### Kubernetes Deployment

```bash
# Apply configurations
kubectl apply -f k8s/

# Check status
kubectl get pods
```

## 📊 Monitoring

- Spring Boot Actuator endpoints: `/actuator`
- Eureka Dashboard: http://localhost:8761
- Application metrics available at `/actuator/metrics`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

- Developer: [Your Name]
- Project: PDS E-Health Management System
- Year: 2024

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@pds-health.com

## 🗺️ Roadmap

- [ ] Add real-time notifications
- [ ] Implement WebSocket for chat
- [ ] Add mobile application
- [ ] Integrate ML for diagnosis assistance
- [ ] Add multi-language support
- [ ] Implement advanced analytics dashboard

## ⚠️ Important Notes

1. Change all default passwords in production
2. Configure HTTPS for all services
3. Set up proper backup strategies
4. Configure monitoring and alerting
5. Review and update security policies regularly

---

**Built with ❤️ for Healthcare Professionals**
