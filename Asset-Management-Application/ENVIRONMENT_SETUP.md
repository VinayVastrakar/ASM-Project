# Environment Variables Setup

This document explains how to set up environment variables for the Asset Management Application, particularly for email credentials.

## Email Configuration

The application uses Spring Boot's email functionality for sending notifications. You need to configure the following environment variables:

### Required Environment Variables

1. **MAIL_HOST** - SMTP server host (default: smtp.gmail.com)
2. **MAIL_PORT** - SMTP server port (default: 587)
3. **MAIL_USERNAME** - Your email address
4. **MAIL_PASSWORD** - Your email app password (not your regular password)

### Local Development Setup

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your actual email credentials:
   ```bash
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@gmail.com
   MAIL_PASSWORD=your-app-password
   ```

3. Run the application with the environment variables:
   ```bash
   export $(cat .env | xargs) && mvn spring-boot:run
   ```

### Gmail App Password Setup

If you're using Gmail, you need to create an App Password:

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account Settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this app password in your `MAIL_PASSWORD` environment variable

### GitHub Actions Setup

For CI/CD, add the following secrets in your GitHub repository:

1. Go to your repository Settings > Secrets and variables > Actions
2. Add the following repository secrets:
   - `MAIL_HOST`
   - `MAIL_PORT`
   - `MAIL_USERNAME`
   - `MAIL_PASSWORD`

### Docker Deployment

When deploying with Docker, pass environment variables:

```bash
docker run -e MAIL_HOST=smtp.gmail.com \
           -e MAIL_PORT=587 \
           -e MAIL_USERNAME=your-email@gmail.com \
           -e MAIL_PASSWORD=your-app-password \
           your-app-image
```

### Environment-Specific Configuration

The application supports different profiles:

- **Development**: `application-dev.yml`
- **Production**: `application-prod.yml`
- **Test**: Uses in-memory database for testing

To run with a specific profile:
```bash
mvn spring-boot:run -Dspring.profiles.active=dev
```

## Security Notes

- Never commit actual email passwords to version control
- Use app passwords instead of regular passwords for Gmail
- Consider using a dedicated email service for production (SendGrid, AWS SES, etc.)
- Rotate app passwords regularly 