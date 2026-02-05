# PDS - Plateforme de Santé (Health Platform)

A microservices-based health platform built with Spring Boot and React using JWT authentication.

## 🏗️ Architecture

### Backend Microservices
- **Eureka Service** (Port 8761): Service discovery
- **Gateway Service** (Port 8982): API Gateway with routing
- **Auth Service** (Port 8082): Authentication and user management with JWT

### Frontend
- **React Application** (Port 5173): Modern, responsive UI with Tailwind CSS

### Infrastructure
- **MySQL** (Port 3306): Database

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

### Backend Setup

1. **Start Eureka Discovery Service** (Terminal 1)
```bash
cd eureka-service
mvn spring-boot:run
```

2. **Configure Auth Service** (Terminal 2)
```bash
cd auth-service
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your settings
mvn spring-boot:run
```

3. **Start Gateway Service** (Terminal 3)
```bash
cd gateway-service
mvn spring-boot:run
```

### Frontend Setup

```bash
cd pds-frontend
npm install
npm run dev
```

## 📱 Access Points

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:8982
- **Auth Service Swagger**: http://localhost:8082/swagger-ui.html
- **Eureka Dashboard**: http://localhost:8761

## 🔐 Authentication

### JWT Configuration

The system uses JWT (HS256) with:
- **Access Token**: 24 hours expiration
- **Refresh Token**: 7 days expiration

Configure in `auth-service/.env`:
```
JWT_SECRET=your-256-bit-secret-key-minimum-64-characters
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000
```

### API Endpoints

**Public Endpoints:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

**Protected Endpoints:**
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/logout` - Logout user

## 📝 Environment Configuration

### Auth Service (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
MAIL_FROM=noreply@pds-health.com

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8982/api
VITE_ENV=development
```

## 🧪 Testing

### Register User
```bash
curl -X POST http://localhost:8982/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PATIENT"
  }'
```

### Login
```bash
curl -X POST http://localhost:8982/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "securepass123"
  }'
```

## 🔧 Database Setup

MySQL automatically creates the database on first run. To manually create:

```sql
CREATE DATABASE IF NOT EXISTS pds_auth;
USE pds_auth;
```

## 📧 Email Configuration (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an app-specific password: https://myaccount.google.com/apppasswords
3. Update `MAIL_USERNAME` and `MAIL_PASSWORD` in `auth-service/.env`

## 🚨 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8082
lsof -ti:8082 | xargs kill -9

# Kill process on port 8982
lsof -ti:8982 | xargs kill -9
```

### Database Connection Error
- Ensure MySQL is running
- Verify credentials in `auth-service/.env`
- Check database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Frontend Cannot Connect
- Verify Gateway Service is running on port 8982
- Check `VITE_API_BASE_URL` in `pds-frontend/.env`
- Verify CORS is enabled in `auth-service/SecurityConfig.java`

### Email Not Sending
- Verify Gmail credentials and app-specific password
- Check 2FA is enabled on Gmail
- Review logs: Check Spring Mail configuration

## 📊 Project Structure

```
pds/
├── eureka-service/           # Service discovery (Eureka Server)
├── auth-service/             # Authentication microservice
│   ├── src/main/java/...     # Java source code
│   ├── src/main/resources/
│   │   └── application.yml   # Configuration (uses environment variables)
│   └── .env.example          # Environment variables template
├── gateway-service/          # API Gateway
├── pds-frontend/             # React frontend
│   ├── src/                  # React components and pages
│   ├── package.json          # Dependencies
│   ├── vite.config.js        # Vite configuration
│   └── .env.example          # Environment variables template
└── README.md                 # This file
```

## 🔒 Security Notes

⚠️ **Development Only Configuration**

Before production deployment:

1. Store JWT secret in secure vault (HashiCorp Vault, AWS Secrets Manager, etc.)
2. Use environment-specific configurations
3. Enable HTTPS/TLS for all services
4. Implement token blacklisting for logout
5. Use production-grade email service (SendGrid, AWS SES, etc.)
6. Add rate limiting and DDoS protection
7. Implement comprehensive request validation
8. Set up audit logging
9. Enable CORS only for trusted domains
10. Use strong, randomly generated JWT secrets (minimum 64 characters)

## 🎯 Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and test locally
# Commit changes
git add .
git commit -m "Add your feature description"

# Push to remote
git push origin feature/your-feature
```

## 📚 Additional Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- React Documentation: https://react.dev
- JWT Guide: https://jwt.io
- Vite Documentation: https://vitejs.dev

## 💡 Tips

- Use Swagger UI to test API endpoints: http://localhost:8082/swagger-ui.html
- Monitor service status via Eureka: http://localhost:8761
- Check application logs for debugging issues
- Use Postman or Insomnia for API testing

---

**Built for Healthcare Professionals**
**Built with ❤️ for Healthcare Professionals**
" " 
"# Test" 
