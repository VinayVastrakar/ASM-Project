# CI/CD Pipeline Setup

This document explains the CI/CD pipeline setup for the Asset Management Application.

## 🚀 Overview

The CI/CD pipeline includes:
- **Build & Test**: Automated building and testing on every push/PR
- **Security Scanning**: OWASP dependency vulnerability scanning
- **Containerization**: Docker image building and optimization
- **Deployment**: Automated deployment to development and production environments
- **Monitoring**: Health checks and notifications

## 📁 Pipeline Structure

```
.github/workflows/
├── ci-cd.yml          # Main CI/CD pipeline
└── deploy-aws.yml     # AWS-specific deployment

Docker/
├── Dockerfile         # Multi-stage Docker build
├── docker-compose.yml # Local development setup
└── .dockerignore      # Docker build optimization
```

## 🔧 Setup Instructions

### 1. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

**For AWS Deployment:**
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key

**For Notifications (Optional):**
- `SLACK_WEBHOOK_URL`: Slack webhook for notifications
- `EMAIL_SMTP_PASSWORD`: Email password for notifications

### 2. Environment Setup

#### Local Development
```bash
# Start the application with Docker Compose
docker-compose up -d

# Access the application
http://localhost:8080

# View logs
docker-compose logs -f app
```

#### Production Deployment

**AWS ECS Deployment:**
1. Create an ECS cluster
2. Create an ECR repository
3. Update the workflow variables in `.github/workflows/deploy-aws.yml`
4. Push to main branch to trigger deployment

**Manual Deployment:**
```bash
# Build Docker image
docker build -t asset-management-app .

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/db \
  -e SPRING_DATASOURCE_USERNAME=user \
  -e SPRING_DATASOURCE_PASSWORD=pass \
  asset-management-app
```

## 🔄 Pipeline Stages

### 1. Build & Test
- **Trigger**: Push to main/develop or PR
- **Actions**:
  - Checkout code
  - Setup Java 21
  - Run unit tests with PostgreSQL
  - Build application
  - Upload artifacts

### 2. Security Scan
- **Trigger**: After successful build
- **Actions**:
  - OWASP dependency check
  - Generate security report
  - Upload security artifacts

### 3. Development Deployment
- **Trigger**: Push to develop branch
- **Actions**:
  - Deploy to development environment
  - Run smoke tests

### 4. Production Deployment
- **Trigger**: Push to main branch
- **Actions**:
  - Deploy to production environment
  - Health checks
  - Rollback on failure

## 🛠️ Customization

### Environment Variables
Update environment variables in the workflow files:
- Database connections
- API keys
- Service URLs

### Deployment Targets
Modify deployment scripts for your target platform:
- AWS ECS/EC2
- Azure App Service
- Google Cloud Run
- Kubernetes

### Notifications
Configure notification channels:
- Slack webhooks
- Email notifications
- Microsoft Teams
- Discord

## 📊 Monitoring

### Health Checks
- Application health: `/actuator/health`
- Database connectivity
- External service dependencies

### Metrics
- Application metrics: `/actuator/metrics`
- Custom business metrics
- Performance monitoring

## 🔒 Security

### Secrets Management
- Use GitHub Secrets for sensitive data
- Rotate credentials regularly
- Implement least privilege access

### Vulnerability Scanning
- OWASP dependency check
- Container image scanning
- Code security analysis

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Java version compatibility
   - Verify Maven dependencies
   - Review test failures

2. **Deployment Failures**
   - Verify AWS credentials
   - Check ECS cluster status
   - Review container logs

3. **Database Connection Issues**
   - Verify database credentials
   - Check network connectivity
   - Review connection pool settings

### Debug Commands
```bash
# Check application logs
docker-compose logs app

# Test database connection
docker-compose exec db psql -U postgres -d assetdb

# Verify health endpoint
curl http://localhost:8080/actuator/health
```

## 📈 Best Practices

1. **Branch Strategy**
   - Use feature branches for development
   - Merge to develop for testing
   - Deploy to production from main

2. **Testing**
   - Unit tests for all new features
   - Integration tests for APIs
   - End-to-end tests for critical flows

3. **Security**
   - Regular dependency updates
   - Security scanning in pipeline
   - Secrets rotation

4. **Monitoring**
   - Set up alerts for failures
   - Monitor application performance
   - Track deployment metrics

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Spring Boot Actuator](https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/) 