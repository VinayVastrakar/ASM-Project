# 🌍 Environment Management Guide

This guide explains how to manage different environments (testing, production) for your Asset Management System.

## 📋 Available Environments

| Environment | Purpose | Database | Security | Best For |
|-------------|---------|----------|----------|----------|
| **`.env.testing`** | Development & Testing | Local PostgreSQL | Low (test data) | Local development, testing features |
| **`.env.fullstack`** | Development | Local PostgreSQL | Medium (real credentials) | Full-stack development |
| **`.env.production`** | Production Deployment | Production DB | High (secure) | Live deployment |

## 🚀 Quick Start

### Option 1: Use Environment Switcher Script

#### Linux/Mac:
```bash
# Make script executable
chmod +x switch-env.sh

# Run the interactive switcher
./switch-env.sh
```

#### Windows:
```cmd
# Run the batch file
switch-env.bat
```

### Option 2: Manual Environment Switching

```bash
# For testing/development
cp .env.testing .env
docker-compose -f docker-compose.fullstack.yml up -d

# For production
cp .env.production .env
# Set production variables in deployment platform
docker-compose -f docker-compose.fullstack.yml up -d
```

## 🔧 Environment Details

### 🧪 Testing Environment (`.env.testing`)

**Perfect for:**
- ✅ Local development
- ✅ Feature testing
- ✅ Debugging
- ✅ Learning the system

**Features:**
- 🔧 Debug logging enabled
- 🗄️ Local PostgreSQL database
- 📧 Test email configuration
- 🔑 Test API keys
- 🚫 **Never use in production**

### 🏭 Production Environment (`.env.production`)

**Perfect for:**
- ✅ Live deployment
- ✅ Real users
- ✅ Production monitoring
- ✅ Performance optimization

**Features:**
- 🚀 Optimized for performance
- 🔒 High security settings
- 📊 Production monitoring
- ⚡ Production database
- 🔐 Strong security measures

### 🛠️ Development Environment (`.env.fullstack`)

**Perfect for:**
- ✅ Full-stack development
- ✅ Integration testing
- ✅ Demo deployments
- ✅ Client presentations

## 🔒 Security Considerations

### Testing Environment
- ⚠️ **Never commit `.env.testing`**
- ⚠️ Use test-only credentials
- ⚠️ Enable debug logging for troubleshooting
- ✅ Safe for local development

### Production Environment
- 🔐 **Never commit `.env.production`**
- 🔐 Use strong, unique passwords
- 🔐 Enable 2FA on all services
- 🔐 Regular security audits required

## 📊 Environment Comparison

| Feature | Testing | Development | Production |
|---------|---------|-------------|------------|
| **Database** | Local PostgreSQL | Local PostgreSQL | Production DB |
| **Email** | Test SMTP | Real SMTP | Production SMTP |
| **Logging** | DEBUG | INFO | WARN/INFO |
| **CORS** | Localhost | Mixed | Domain only |
| **JWT Expiry** | 1 hour | 12 hours | 12 hours |
| **Security** | Low | Medium | High |
| **Performance** | Development | Development | Optimized |

## 🚀 Deployment Workflow

### For Development/Testing:

```bash
# 1. Switch to testing environment
./switch-env.sh  # Choose option 1

# 2. Start services
docker-compose -f docker-compose.fullstack.yml up -d

# 3. Verify deployment
docker-compose -f docker-compose.fullstack.yml ps

# 4. Access applications
# Frontend: http://localhost:3000
# Backend: http://localhost:8080
# PgAdmin: http://localhost:5050
```

### For Production Deployment:

```bash
# 1. Switch to production environment
./switch-env.sh  # Choose option 2

# 2. Configure production secrets in deployment platform
# Set all ${VARIABLE} values

# 3. Deploy with production profile
docker-compose -f docker-compose.fullstack.yml --profile production up -d

# 4. Verify production deployment
curl https://your-domain.com/actuator/health
```

## 🔧 Environment Variables Reference

### Database Configuration
```bash
POSTGRES_DB=your_database_name
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
```

### External Services
```bash
# Email
MAIL_USERNAME=your-email@gmail.com
BREVO_API_KEY=your-brevo-key

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key

# Authentication
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-oauth-id
```

## 🛠️ Troubleshooting

### Common Issues

**1. Environment file not found**
```bash
ls -la .env.*
# Ensure .env.testing and .env.production exist
```

**2. Services not starting**
```bash
# Check environment file syntax
cat .env | grep -v '^#' | grep -v '^$'

# Check for missing variables
docker-compose -f docker-compose.fullstack.yml config
```

**3. Database connection issues**
```bash
# Verify database credentials
docker-compose -f docker-compose.fullstack.yml logs db

# Test database connection
psql -h localhost -U postgres -d assetdb
```

## 📝 Best Practices

### ✅ Do's
- 🔄 Use environment-specific configurations
- 🔒 Keep production secrets secure
- 📝 Document environment requirements
- 🧪 Test in staging before production
- 📊 Monitor production performance

### ❌ Don'ts
- 🚫 Commit `.env` files to version control
- 🚫 Use production credentials in testing
- 🚫 Mix testing and production data
- 🚫 Skip environment-specific testing

## 🎯 Next Steps

1. **Choose your environment** based on your needs
2. **Configure credentials** in the appropriate `.env` file
3. **Test thoroughly** in each environment
4. **Document your setup** for team members
5. **Set up monitoring** for production

---

**🎉 You're ready to deploy in any environment!**
