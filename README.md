# Asset Management System (Full Stack)

A full-stack Asset Management application built with React (TypeScript) frontend and Spring Boot backend, containerized with Docker for easy deployment.

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Redux Toolkit + Tailwind CSS
- **Backend**: Spring Boot 3.4.5 + Java 21 + PostgreSQL + JWT Authentication
- **Database**: PostgreSQL 15
- **Deployment**: Docker + Docker Compose
- **External Services**: Cloudinary (file uploads), Gmail SMTP (email), Google OAuth

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd ASM-Project
```

### 2. Environment Configuration
Copy the example environment file and configure your services:
```bash
cp .env.example .env
```

Edit `.env` with your actual credentials:
- Database credentials
- Email service (Gmail SMTP)
- JWT secret key
- Cloudinary configuration
- Google OAuth client ID

### 3. Deploy Full Stack Application
```bash
# Start all services (frontend, backend, database)
docker-compose up -d

# Or start with additional services (Redis, monitoring)
docker-compose --profile fullstack up -d
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html
- **Health Check**: http://localhost:8080/actuator/health

## 📁 Project Structure

```
ASM-Project/
├── .env.example              # Environment variables template
├── .gitignore               # Git ignore rules
├── docker-compose.yml       # Production deployment configuration
├── Dockerfile              # Backend container configuration
├── nginx.conf              # Reverse proxy configuration
├── Asset-Management-Application/  # Spring Boot Backend
│   ├── src/                # Java source code
│   ├── pom.xml             # Maven dependencies
│   └── Dockerfile          # Backend-specific Dockerfile
└── frontend/               # React Frontend
    ├── src/                # React source code
    ├── public/             # Static assets
    ├── package.json        # Node dependencies
    └── Dockerfile          # Frontend Dockerfile
```

## 🔧 Development

### Backend Development
```bash
cd Asset-Management-Application
mvn spring-boot:run
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Database Management
The PostgreSQL database is automatically created and configured. Access it at:
- **Host**: localhost:5432
- **Database**: assetdb
- **Username/Password**: As configured in `.env`

## 🚢 Deployment Options

### Option 1: Full Stack (Recommended for Development)
```bash
docker-compose up -d
```
This starts:
- Frontend (React app on port 3000)
- Backend (Spring Boot API on port 8080)
- PostgreSQL database
- Redis cache (optional)

### Option 2: Backend Only (For API deployment)
```bash
docker build -t asm-backend .
docker run -p 8080:8080 --env-file .env asm-backend
```

### Option 3: Production with Reverse Proxy
```bash
# Build and start with nginx reverse proxy
docker-compose -f docker-compose.yml up -d --build
```

## 🔐 Security Features

- **JWT Authentication**: Stateless token-based auth
- **Google OAuth 2.0**: Social login integration
- **Password Encryption**: Secure password storage
- **CORS Protection**: Configurable cross-origin policies
- **File Upload Security**: Cloudinary integration with validation
- **Non-root Containers**: Security best practices

## 📊 Monitoring

The application includes health checks and monitoring endpoints:
- **Backend Health**: `/actuator/health`
- **Frontend Health**: Available via nginx status
- **Database Health**: PostgreSQL health checks

## 🔧 Configuration

### Environment Variables
See `.env.example` for all configurable options:

- **Database**: PostgreSQL connection settings
- **Email**: SMTP configuration for notifications
- **JWT**: Token expiration and secret key
- **Cloudinary**: File upload service configuration
- **OAuth**: Google authentication setup
- **CORS**: Allowed origins for cross-origin requests

### Application Properties
Backend configuration in `Asset-Management-Application/src/main/resources/application.yml`

## 🛠️ Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check what's using ports
   lsof -i :8080
   lsof -i :3000

   # Stop conflicting services
   docker-compose down
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs db

   # Reset database
   docker-compose down -v
   docker-compose up -d
   ```

3. **Build Failures**
   ```bash
   # Clean and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

### Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

## 📚 API Documentation

Once the backend is running, access the Swagger UI at:
- http://localhost:8080/swagger-ui.html

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions, please contact the development team.

---

**Built with ❤️ using React, Spring Boot, and Docker**
