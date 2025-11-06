# Back4App Cloud Code Deployment Guide

This guide will help you deploy the QuickStore Cloud Code to Back4App.

## Prerequisites

- Back4App account with QuickStore app created
- Back4App CLI installed (optional, for CLI deployment)
- Git (for version control)

## Deployment Methods

### Method 1: Using Back4App Dashboard (Recommended)

1. **Navigate to Cloud Code**
   - Go to your Back4App dashboard
   - Select your QuickStore app
   - Navigate to **Server Settings** → **Cloud Code**

2. **Upload Cloud Code**
   - Click on **Edit Cloud Code** or **Upload Files**
   - Upload the `cloud/main.js` file
   - Upload the `cloud/package.json` file (if needed)

3. **Deploy**
   - Click **Deploy** or **Save**
   - Wait for deployment to complete (usually takes 1-2 minutes)

4. **Verify Deployment**
   - Check the deployment logs for any errors
   - Test a Cloud Function (e.g., `getUserStats`)

### Method 2: Using Back4App CLI

1. **Install Back4App CLI**
   ```bash
   npm install -g back4app-cli
   ```

2. **Login**
   ```bash
   back4app login
   ```

3. **Navigate to Project**
   ```bash
   cd QuickStore
   ```

4. **Deploy Cloud Code**
   ```bash
   back4app deploy
   ```

### Method 3: Using Git (Advanced)

1. **Connect Repository**
   - In Back4App dashboard, go to **Server Settings** → **Cloud Code**
   - Enable **Git Integration**
   - Connect your GitHub/GitLab repository
   - Set the branch (usually `main` or `master`)
   - Set the path to `cloud/`

2. **Auto-Deploy**
   - Back4App will automatically deploy when you push to the connected branch

## Cloud Code Structure

```
cloud/
├── main.js          # Main Cloud Code file with all functions
└── package.json     # Dependencies (if any)
```

## Cloud Functions Available

### User Functions
- `getUserStats` - Get user statistics
- `exportUserData` - Export all user data (GDPR compliant)
- `deleteAccount` - Delete user account and all data

### Authentication Functions
- `sendVerificationEmail` - Send email verification token
- `verifyEmail` - Verify email with token
- `requestPasswordReset` - Request password reset
- `resetPassword` - Reset password with token

### Item Functions
- `searchItems` - Advanced search with filtering

### Admin Functions
- `getSystemStats` - Get system-wide statistics (admin only)

## Security Hooks

The Cloud Code includes automatic security hooks:

1. **User Validation**
   - Email format validation
   - Username validation (3-30 chars, alphanumeric + underscore)
   - Password strength (min 8 characters)
   - Default role assignment

2. **Item Validation**
   - Ownership verification
   - Title/content length limits
   - Type validation
   - URL format validation for links
   - Tag sanitization

3. **Folder Validation**
   - Ownership verification
   - Name validation
   - Duplicate name prevention

4. **Delete Protection**
   - Ownership verification before deletion

## Activity Logging

All user actions are automatically logged:
- Item creation/update/deletion
- Folder creation
- Email verification
- Password resets

## Rate Limiting

Built-in rate limiting prevents abuse:
- Item creation: 20 items per minute per user
- Search: Configurable limits

## Testing Cloud Functions

### Using Parse Dashboard

1. Go to **Cloud Code** → **Functions**
2. Select a function
3. Enter test parameters
4. Click **Run**

### Using JavaScript

```javascript
// Example: Get user stats
const stats = await Parse.Cloud.run('getUserStats');
console.log(stats);

// Example: Search items
const results = await Parse.Cloud.run('searchItems', {
    query: 'test',
    type: 'link',
    limit: 10
});
```

### Using cURL

```bash
curl -X POST https://parseapi.back4app.com/functions/getUserStats \
  -H "X-Parse-Application-Id: YOUR_APP_ID" \
  -H "X-Parse-Session-Token: USER_SESSION_TOKEN" \
  -H "Content-Type: application/json"
```

## Environment Variables

If you need environment variables:

1. Go to **Server Settings** → **Environment Variables**
2. Add your variables
3. Access in Cloud Code:
   ```javascript
   const apiKey = process.env.API_KEY;
   ```

## Email Configuration

To enable email sending:

1. Go to **Server Settings** → **Email Settings**
2. Configure SMTP settings
3. Update Cloud Code to use Parse.Cloud.sendEmail()

Example:
```javascript
await Parse.Cloud.sendEmail({
    to: user.get('email'),
    subject: 'Email Verification',
    text: `Your verification token: ${token}`
});
```

## Monitoring & Logs

### View Logs
- Go to **Server Settings** → **Logs**
- Filter by function name or error type

### Monitor Performance
- Check **Analytics** → **Cloud Functions**
- Monitor execution time and error rates

## Troubleshooting

### Common Issues

1. **Function Not Found**
   - Verify deployment completed successfully
   - Check function name spelling
   - Ensure Cloud Code is saved

2. **Permission Denied**
   - Check user authentication
   - Verify user has required role
   - Check ACLs (Access Control Lists)

3. **Validation Errors**
   - Check input format
   - Verify required fields
   - Check data types

4. **Rate Limit Errors**
   - Wait before retrying
   - Check rate limit settings
   - Contact support if persistent

### Debug Mode

Enable debug logging:
```javascript
Parse.Cloud.useMasterKey();
console.log('Debug info:', data);
```

## Best Practices

1. **Always validate input** - Never trust client data
2. **Use master key sparingly** - Only when necessary
3. **Log important actions** - For audit trails
4. **Handle errors gracefully** - Return meaningful messages
5. **Test thoroughly** - Before deploying to production
6. **Monitor performance** - Watch for slow functions
7. **Keep code updated** - Regular security updates

## Security Checklist

- [ ] All user inputs validated
- [ ] Ownership checks in place
- [ ] Rate limiting enabled
- [ ] Activity logging active
- [ ] Error messages don't leak sensitive info
- [ ] Master key used only when necessary
- [ ] Email verification implemented
- [ ] Password reset secure
- [ ] Data export GDPR compliant
- [ ] Account deletion secure

## Support

For issues:
- Check Back4App documentation
- Review Cloud Code logs
- Contact Back4App support
- Check Parse Server documentation

---

**Your Cloud Code is now production-ready! 🚀**

