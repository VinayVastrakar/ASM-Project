# Testing Google OAuth Integration

## Quick Test Steps

### 1. Backend Test
```bash
# Start your Spring Boot application
cd Asset-Management-Application
mvn spring-boot:run
```

### 2. Frontend Test
```bash
# Start your React application
cd frontend
npm start
```

### 3. Environment Setup
Make sure you have these environment variables set:

**Backend (.env file in Asset-Management-Application):**
```bash
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

**Frontend (.env file in frontend):**
```bash
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### 4. Test Flow
1. Open http://localhost:3000
2. Go to login page
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected to the dashboard

### 5. Expected Results
- ✅ Google login button appears
- ✅ Google OAuth popup opens
- ✅ After successful login, you're redirected to dashboard
- ✅ User data is stored in database with Google fields
- ✅ JWT tokens are generated and stored

### 6. Database Verification
Check your database to see if the new user was created with Google fields:
```sql
SELECT id, name, email, google_id, profile_picture, auth_provider 
FROM users 
WHERE email = 'your-google-email@gmail.com';
```

### 7. Common Issues & Solutions

**Issue: "Google login button not appearing"**
- Solution: Check if `REACT_APP_GOOGLE_CLIENT_ID` is set correctly
- Solution: Verify GoogleOAuthProvider is wrapping your app in App.tsx

**Issue: "Invalid Google token" error**
- Solution: Check if `GOOGLE_CLIENT_ID` is set correctly in backend
- Solution: Verify Google Cloud Console configuration

**Issue: "Email not verified" error**
- Solution: User must verify their email with Google first

**Issue: "User account is not active" error**
- Solution: Admin needs to activate the user account in database

### 8. Debug Mode
Enable debug logging in backend:
```yaml
# Add to application.yml
logging:
  level:
    com.example.Assets.Management.App.service.GoogleOAuthService: DEBUG
```

### 9. API Endpoint Test
Test the Google login endpoint directly:
```bash
curl -X POST http://localhost:8080/api/auth/google-login \
  -H "Content-Type: application/json" \
  -d '{"idToken":"your-google-id-token"}'
```

### 10. Success Indicators
- ✅ No console errors in browser
- ✅ No errors in backend logs
- ✅ User appears in database with Google fields
- ✅ JWT tokens are generated
- ✅ User can access protected routes
