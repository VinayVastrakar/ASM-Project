# Full Stack CI/CD Pipeline Setup

This document explains the complete CI/CD pipeline setup for the Asset Management Application (Frontend + Backend).

## 🚀 Overview

The full stack CI/CD pipeline includes:
- **Frontend (React)**: Build, test, and deploy React application
- **Backend (Spring Boot)**: Build, test, and deploy Spring Boot API
- **Security Scanning**: OWASP dependency checks for both applications
- **Containerization**: Docker images for both frontend and backend
- **Deployment**: Automated deployment to development and production environments
- **Monitoring**: Health checks and performance monitoring

## 📁 Project Structure

```
├── Asset-Management-Application/     # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile
│   └── .dockerignore
├── frontend/                        # React Frontend
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
├── .github/workflows/
│   ├── full-stack-ci-cd.yml        # Main CI/CD pipeline
│   ├── deploy-aws-fullstack.yml    # AWS deployment
│   └── ci-cd.yml                   # Backend-only pipeline
├── docker-compose.fullstack.yml    # Full stack local development
└── FULLSTACK-CI-CD-README.md       # This file
```

## 🔧 Setup Instructions

### 1. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

**For AWS Deployment:**
- `AWS_ACCESS_KEY_ID`: Your AWS access key
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
- `CLOUDFRONT_DISTRIBUTION_ID`: CloudFront distribution ID (optional)

**For Email Notifications:**
- `MAIL_USERNAME`: Email username for notifications
- `MAIL_PASSWORD`: Email password for notifications

**For Notifications (Optional):**
- `SLACK_WEBHOOK_URL`: Slack webhook for notifications
- `DISCORD_WEBHOOK_URL`: Discord webhook for notifications

### 2. Environment Setup

#### Local Development
```bash
# Start the full stack application
docker-compose -f docker-compose.fullstack.yml up -d

# Access the applications
Frontend: http://localhost:3000
Backend API: http://localhost:8080
Database: localhost:5432

# View logs
docker-compose -f docker-compose.fullstack.yml logs -f

# Stop all services
docker-compose -f docker-compose.fullstack.yml down
```

#### Production Deployment

**AWS ECS Deployment:**
1. Create ECS cluster
2. Create ECR repositories for both frontend and backend
3. Create ECS services and task definitions
4. Update workflow variables in `.github/workflows/deploy-aws-fullstack.yml`
5. Push to main branch to trigger deployment

**Manual Deployment:**
```bash
# Build and run backend
cd Asset-Management-Application
docker build -t asset-management-backend .
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/db \
  -e SPRING_DATASOURCE_USERNAME=user \
  -e SPRING_DATASOURCE_PASSWORD=pass \
  asset-management-backend

# Build and run frontend
cd frontend
docker build -t asset-management-frontend .
docker run -p 3000:80 \
  -e REACT_APP_API_URL=http://localhost:8080 \
  asset-management-frontend
```

## 🔄 Pipeline Stages

### 1. Backend Build & Test
- **Trigger**: Push to main/develop or PR
- **Actions**:
  - Setup Java 21
  - Run unit tests with PostgreSQL
  - Build Spring Boot application
  - Upload JAR artifacts

### 2. Frontend Build & Test
- **Trigger**: Push to main/develop or PR
- **Actions**:
  - Setup Node.js 18
  - Install dependencies
  - Run React tests with coverage
  - Build production bundle
  - Upload build artifacts

### 3. Security Scan
- **Trigger**: After successful builds
- **Actions**:
  - OWASP dependency check (Backend)
  - npm audit (Frontend)
  - Generate security reports
  - Upload security artifacts

### 4. Docker Build
- **Trigger**: After successful builds and security scans
- **Actions**:
  - Build backend Docker image
  - Build frontend Docker image
  - Cache Docker layers
  - Upload Docker artifacts

### 5. Development Deployment
- **Trigger**: Push to develop branch
- **Actions**:
  - Deploy to development environment
  - Run smoke tests
  - Health checks

### 6. Production Deployment
- **Trigger**: Push to main branch
- **Actions**:
  - Deploy to production environment
  - Update CloudFront (if configured)
  - Run comprehensive tests
  - Health checks and monitoring

## 🛠️ Customization

### Environment Variables

**Frontend Environment Variables:**
```bash
REACT_APP_API_URL=http://localhost:8080
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=$npm_package_version
```

**Backend Environment Variables:**
```bash
SPRING_PROFILES_ACTIVE=production
SPRING_DATASOURCE_URL=jdbc:postgresql://host:5432/db
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
```

### Deployment Targets

Modify deployment scripts for your target platform:
- **AWS**: ECS, EC2, Lambda
- **Azure**: App Service, Container Instances
- **Google Cloud**: Cloud Run, GKE
- **Kubernetes**: Self-hosted or managed

### Monitoring Setup

**With Monitoring Profile:**
```bash
# Start with monitoring
docker-compose -f docker-compose.fullstack.yml --profile monitoring up -d

# Access monitoring tools
Prometheus: http://localhost:9090
Grafana: http://localhost:3001 (admin/admin)
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Frontend**: `http://localhost:3000/health`
- **Backend**: `http://localhost:8080/actuator/health`
- **Database**: PostgreSQL connection check
- **Redis**: Redis ping check

### Metrics & Logging
- **Application Metrics**: `/actuator/metrics`
- **Application Logs**: Docker container logs
- **Database Metrics**: PostgreSQL monitoring
- **Frontend Performance**: React performance monitoring

## 🔒 Security

### Security Measures
- **Dependency Scanning**: OWASP for backend, npm audit for frontend
- **Container Security**: Non-root users, minimal base images
- **Network Security**: Isolated Docker networks
- **Secrets Management**: GitHub Secrets, environment variables
- **HTTPS**: SSL/TLS termination at load balancer

### Security Headers (Frontend)
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Content-Security-Policy: Strict CSP rules

## 🚨 Troubleshooting

### Common Issues

1. **Frontend Build Failures**
   - Check Node.js version compatibility
   - Verify npm dependencies
   - Review TypeScript compilation errors

2. **Backend Build Failures**
   - Check Java version compatibility
   - Verify Maven dependencies
   - Review test failures

3. **Docker Build Issues**
   - Check Dockerfile syntax
   - Verify build context
   - Review multi-stage build steps

4. **Deployment Failures**
   - Verify AWS credentials
   - Check ECS cluster status
   - Review container logs

### Debug Commands
```bash
# Check application logs
docker-compose -f docker-compose.fullstack.yml logs frontend
docker-compose -f docker-compose.fullstack.yml logs backend

# Test database connection
docker-compose -f docker-compose.fullstack.yml exec db psql -U postgres -d assetdb

# Verify health endpoints
curl http://localhost:3000/health
curl http://localhost:8080/actuator/health

# Check Docker images
docker images | grep asset-management
```

## 📈 Best Practices

### Development Workflow
1. **Feature Development**: Create feature branches
2. **Testing**: Write unit and integration tests
3. **Code Review**: Pull request reviews
4. **CI/CD**: Automated testing and deployment
5. **Monitoring**: Production monitoring and alerting

### Performance Optimization
- **Frontend**: Code splitting, lazy loading, caching
- **Backend**: Database optimization, caching, connection pooling
- **Infrastructure**: Auto-scaling, load balancing, CDN

### Security Best Practices
- Regular dependency updates
- Security scanning in pipeline
- Secrets rotation
- Least privilege access
- Network segmentation

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [React Documentation](https://reactjs.org/docs/)
- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)

## 🎯 Quick Start

```bash
# Clone and setup
git clone <your-repo>
cd <your-repo>

# Start full stack locally
docker-compose -f docker-compose.fullstack.yml up -d

# Access applications
open http://localhost:3000  # Frontend
open http://localhost:8080  # Backend API

# Push to trigger CI/CD
git add .
git commit -m "Add full stack CI/CD pipeline"
git push origin main
```

The pipeline will automatically build, test, and deploy both frontend and backend applications! 