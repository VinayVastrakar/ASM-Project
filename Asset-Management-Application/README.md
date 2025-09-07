# Asset Management Application

A comprehensive Spring Boot application for managing assets, users, categories, and purchase history with email notifications and Google OAuth integration.

## 🚀 Quick Start

### Prerequisites
- Java 21 or higher
- Maven 3.6+
- PostgreSQL 12+
- Node.js 18+ (for frontend)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Asset-Management-Application
   ```

2. **Set up environment variables**
   
   **For Windows:**
   ```bash
   setup-env.bat
   ```
   
   **For Linux/Mac:**
   ```bash
   chmod +x setup-env.sh
   ./setup-env.sh
   ```
   
   **Manual setup:**
   ```bash
   cp env.example .env
   # Edit .env file with your actual values
   ```

3. **Configure your database**
   - Create a PostgreSQL database
   - Update database credentials in `.env` file

4. **Configure email settings**
   - Set up Gmail app password
   - Update email credentials in `.env` file

5. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

## 📋 Features

- **Asset Management**: CRUD operations for assets
- **User Management**: User registration, authentication, and authorization
- **Category Management**: Asset categorization
- **Purchase History**: Track asset purchases and warranties
- **Email Notifications**: Automated expiry notifications
- **Google OAuth**: Social login integration
- **JWT Authentication**: Secure API access
- **File Upload**: Asset image uploads
- **Dashboard**: Analytics and reporting
- **SMS Notifications**: Optional Twilio integration

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. See `env.example` for all available options.

**Required Variables:**
- `SPRING_DATASOURCE_URL` - Database connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `MAIL_USERNAME` - Email username
- `MAIL_PASSWORD` - Email app password
- `JWT_SECRET` - JWT signing secret
- `GOOGLE_CLIENT_ID` - Google OAuth client ID

### Profiles

- **Development**: `application-dev.yml`
- **Production**: `application-prod.yml`
- **Docker**: Uses environment variables

Run with specific profile:
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
docker-compose up -d
```

### Using Docker
```bash
docker build -t asset-management-app .
docker run -p 8080:8080 --env-file .env asset-management-app
```

## 📚 API Documentation

Once the application is running, access the API documentation at:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- API Docs: `http://localhost:8080/v3/api-docs`

## 🔒 Security

- JWT-based authentication
- Role-based authorization (ADMIN, USER)
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use App Password in `MAIL_PASSWORD`

### Other SMTP Providers
Update `MAIL_HOST` and `MAIL_PORT` in `.env` file.

## 🔍 Monitoring

- Health checks: `http://localhost:8080/actuator/health`
- Metrics: `http://localhost:8080/actuator/metrics`
- Application info: `http://localhost:8080/actuator/info`

## 🧪 Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report

# Run specific test
mvn test -Dtest=AssetControllerTest
```

## 📁 Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/example/Assets/Management/App/
│   │       ├── controller/     # REST controllers
│   │       ├── service/        # Business logic
│   │       ├── repository/     # Data access
│   │       ├── model/          # Entity classes
│   │       ├── dto/            # Data transfer objects
│   │       ├── config/         # Configuration classes
│   │       ├── security/       # Security configuration
│   │       ├── scheduler/      # Scheduled tasks
│   │       └── exception/      # Custom exceptions
│   └── resources/
│       ├── application.yml     # Main configuration
│       ├── application-dev.yml # Development profile
│       └── application-prod.yml # Production profile
└── test/                       # Test classes
```

## 🔄 CI/CD

The project includes GitHub Actions workflows for:
- Automated testing
- Security scanning
- Docker image building
- Deployment to cloud platforms

See `CI-CD-README.md` for detailed information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
1. Check the documentation
2. Review `ENVIRONMENT_SETUP.md`
3. Check existing issues
4. Create a new issue

## 🔗 Related Documentation

- [Environment Setup](ENVIRONMENT_SETUP.md)
- [CI/CD Pipeline](CI-CD-README.md)
- [Google OAuth Setup](GOOGLE_OAUTH_SETUP.md)
