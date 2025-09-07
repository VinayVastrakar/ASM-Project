# Environment Variables Setup

This document explains how to set up environment variables for the Asset Management Application.

## 🚀 Quick Start

1. **Copy the example file:**
   ```bash
   cp env.example .env
   ```

2. **Edit the `.env` file** with your actual values

3. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

## 📋 Required Environment Variables

### Database Configuration
```bash
# Production Database (Primary)
SPRING_DATASOURCE_URL=jdbc:postgresql://103.133.215.182:5432/gloitel_db_ams
SPRING_DATASOURCE_USERNAME=gloitel
SPRING_DATASOURCE_PASSWORD=gloitel123

# OR Local Development Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/assetdb
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=1234
```

### Email Configuration
```bash
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

### JWT Configuration
```bash
JWT_SECRET=your-super-secure-jwt-secret-key-here-make-it-long-and-random
JWT_EXPIRATION=43200000
JWT_REFRESH_EXPIRATION=172800000
```

### Google OAuth Configuration
```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 🔧 Environment-Specific Configuration

### Development Profile
```bash
# Set active profile
SPRING_PROFILES_ACTIVE=dev

# Run with development profile
mvn spring-boot:run -Dspring.profiles.active=dev
```

### Production Profile
```bash
# Set active profile
SPRING_PROFILES_ACTIVE=prod

# Run with production profile
mvn spring-boot:run -Dspring.profiles.active=prod
```

## 📧 Gmail App Password Setup

If you're using Gmail, you need to create an App Password:

1. **Enable 2-Factor Authentication** on your Google account
2. **Go to Google Account Settings** > Security > App passwords
3. **Generate a new app password** for "Mail"
4. **Use this app password** in your `MAIL_PASSWORD` environment variable

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Start with environment variables
docker-compose -f docker-compose.fullstack.yml up -d
```

### Using Docker Run
```bash
docker run -p 8080:8080 \
  --env-file .env \
  your-app-image
```

## ☁️ Cloud Deployment

### AWS ECS
```bash
# Set environment variables in ECS task definition
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://your-rds-endpoint:5432/dbname
SPRING_DATASOURCE_USERNAME=your-username
SPRING_DATASOURCE_PASSWORD=your-password
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
JWT_SECRET=your-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
```

### Heroku
```bash
# Set environment variables
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-url
heroku config:set MAIL_USERNAME=your-email@gmail.com
heroku config:set MAIL_PASSWORD=your-app-password
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set GOOGLE_CLIENT_ID=your-google-client-id
```

## 🔒 Security Best Practices

### JWT Secret Generation
```bash
# Generate a secure JWT secret
openssl rand -base64 64
```

### Environment Variable Security
- ✅ **Use `.env` files** for local development
- ✅ **Use cloud secrets** for production (AWS Secrets Manager, Azure Key Vault, etc.)
- ✅ **Never commit** `.env` files to version control
- ✅ **Rotate secrets** regularly
- ✅ **Use app passwords** instead of regular passwords for email

### File Permissions
```bash
# Set proper permissions for .env file
chmod 600 .env
```

## 🧪 Testing

### Local Testing
```bash
# Test with development profile
SPRING_PROFILES_ACTIVE=dev mvn spring-boot:run

# Test with production profile
SPRING_PROFILES_ACTIVE=prod mvn spring-boot:run
```

### Environment Variable Validation
The application will validate required environment variables on startup:
- ✅ Database connection
- ✅ Email configuration
- ✅ JWT secret
- ✅ Google OAuth client ID

## 🔍 Troubleshooting

### Common Issues

**Issue: "Database connection failed"**
```bash
# Check database environment variables
echo $SPRING_DATASOURCE_URL
echo $SPRING_DATASOURCE_USERNAME
echo $SPRING_DATASOURCE_PASSWORD
```

**Issue: "Email sending failed"**
```bash
# Check email environment variables
echo $MAIL_USERNAME
echo $MAIL_PASSWORD
```

**Issue: "JWT token invalid"**
```bash
# Check JWT secret
echo $JWT_SECRET
```

### Debug Mode
```bash
# Enable debug logging
LOGGING_LEVEL_COM_EXAMPLE_ASSETS_MANAGEMENT_APP=DEBUG mvn spring-boot:run
```

## 📚 Additional Configuration

### Optional Environment Variables

```bash
# Twilio SMS Configuration (if using SMS notifications)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_FROM_NUMBER=your-twilio-phone-number

# Cloudinary Configuration (if using file upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Logging Configuration
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_COM_EXAMPLE_ASSETS_MANAGEMENT_APP=DEBUG

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# File Upload Configuration
SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE=10MB
SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE=10MB
```

## 🔄 Migration from Hardcoded Values

If you're migrating from hardcoded values:

1. **Backup your current configuration**
2. **Create `.env` file** from `env.example`
3. **Update values** in `.env` file
4. **Test the application** with new configuration
5. **Remove hardcoded values** from application.yml files

## 📞 Support

For issues with environment setup:
1. Check the troubleshooting section above
2. Verify all required environment variables are set
3. Check application logs for specific error messages
4. Ensure database and email services are accessible 