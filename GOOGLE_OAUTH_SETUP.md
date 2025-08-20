# Google OAuth Setup Guide for Asset Management System

This guide will help you set up Google OAuth authentication for your asset management system.

## Prerequisites

1. A Google account
2. Access to Google Cloud Console
3. Your application running locally or deployed

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - App name: "Asset Management System"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes:
   - `openid`
   - `email`
   - `profile`
5. Add test users (your email addresses) if in testing mode

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)
6. Copy the **Client ID** - you'll need this for configuration

## Step 4: Backend Configuration

### Environment Variables

Add the following to your `.env` file:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Database Migration

The system will automatically create the necessary database columns when you restart the application. The new fields are:
- `google_id` - Google's unique user ID
- `profile_picture` - User's Google profile picture URL
- `auth_provider` - Authentication provider ("LOCAL" or "GOOGLE")

## Step 5: Frontend Configuration

### Environment Variables

Create a `.env` file in your frontend directory:

```bash
# Google OAuth Configuration
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Install Dependencies

The Google OAuth package is already included in your `package.json`:

```json
"@react-oauth/google": "^0.12.2"
```

## Step 6: Testing the Integration

1. Start your backend application
2. Start your frontend application
3. Go to the login page
4. Click "Continue with Google"
5. Sign in with your Google account
6. You should be redirected to the dashboard

## How It Works

### For New Users:
1. User clicks "Continue with Google"
2. Google OAuth popup appears
3. User signs in with Google
4. Backend receives the Google ID token
5. Backend verifies the token with Google
6. If valid, creates a new user account
7. Generates JWT tokens for the application
8. User is logged in and redirected to dashboard

### For Existing Users:
1. User clicks "Continue with Google"
2. Google OAuth popup appears
3. User signs in with Google
4. Backend receives the Google ID token
5. Backend verifies the token with Google
6. If valid, finds existing user by email
7. Updates Google-specific fields
8. Generates JWT tokens for the application
9. User is logged in and redirected to dashboard

## Security Features

1. **Token Verification**: All Google tokens are verified with Google's servers
2. **Email Verification**: Only users with verified Google emails can login
3. **JWT Tokens**: Standard JWT authentication for API access
4. **Account Locking**: Same account locking mechanism as regular login
5. **Session Management**: Proper session handling with refresh tokens

## Error Handling

The system handles various error scenarios:

- **Invalid Google Token**: Shows "Invalid Google token" error
- **Unverified Email**: Shows "Email not verified with Google" error
- **Inactive Account**: Shows "User account is not active" error
- **Network Issues**: Shows "Google login failed" error

## Production Deployment

### Environment Variables

Make sure to set the correct environment variables in production:

```bash
# Backend
GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com

# Frontend
REACT_APP_GOOGLE_CLIENT_ID=your-production-google-client-id.apps.googleusercontent.com
```

### Authorized Origins

Update your Google OAuth configuration to include your production domain:

1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add your production domain to authorized JavaScript origins
4. Add your production domain to authorized redirect URIs

## Troubleshooting

### Common Issues:

1. **"Invalid Google token" error**:
   - Check if your Google Client ID is correct
   - Ensure the token hasn't expired
   - Verify Google APIs are enabled

2. **"Email not verified" error**:
   - User must verify their email with Google
   - Check Google account settings

3. **"User account is not active" error**:
   - Admin needs to activate the user account
   - Check user status in database

4. **Google login button not appearing**:
   - Check if `REACT_APP_GOOGLE_CLIENT_ID` is set correctly
   - Verify GoogleOAuthProvider is wrapping your app

### Debug Mode:

Enable debug logging in your backend by adding to `application.yml`:

```yaml
logging:
  level:
    com.example.Assets.Management.App.service.GoogleOAuthService: DEBUG
```

## Support

If you encounter issues:

1. Check the browser console for frontend errors
2. Check the backend logs for server errors
3. Verify all environment variables are set correctly
4. Ensure Google Cloud Console configuration is correct
5. Test with a different Google account

## Security Best Practices

1. **Never commit Client IDs to version control**
2. **Use environment variables for all sensitive data**
3. **Regularly rotate Google OAuth credentials**
4. **Monitor OAuth consent screen for suspicious activity**
5. **Implement rate limiting for OAuth endpoints**
6. **Log authentication events for security monitoring**
