# Deployment Checklist

## Deployment Steps (CRITICAL)
1. **Push Changes to GitHub**
   - All changes are now pushed to main branch
   - GitHub repository is up-to-date

2. **Trigger New Deployment**
   - **If using Vercel**: 
     - Go to vercel.com dashboard
     - Find your project
     - Click "Redeploy" or "Deployments" → "Redeploy"
   - **If using Netlify**:
     - Go to netlify.com dashboard
     - Find your site
     - Click "Deploy" → "Trigger deploy"
   - **If using other platform**: Check platform-specific redeploy options

3. **Verify Deployment**
   - Wait for deployment to complete (2-5 minutes)
   - Check deployment logs for any errors
   - Test the deployed URL

## Environment Variables (Required)
Add these to your deployment platform (Vercel, Netlify, etc.):

### Supabase Configuration
- `VITE_SUPABASE_URL`: Your Supabase project URL (e.g., https://your-project.supabase.co)
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key (public key)

### Gemini AI
- `GEMINI_API_KEY`: Your Google Gemini API key

### App Configuration
- `APP_URL`: Your deployed app URL (e.g., https://your-app.vercel.app)

## Build Verification
- [ ] Run `npm run build` successfully
- [ ] Check `dist/index.html` is generated
- [ ] Verify all assets are in `dist/assets/`

## Common Issues & Solutions

### Authentication "Fail to Fetch" Error
1. **Missing Environment Variables**
   - Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Check deployment platform environment variables section
   - Verify keys are correct (no extra spaces or quotes)

2. **CORS Issues**
   - In Supabase Dashboard → Settings → API
   - Add your deployed URL to "Additional Redirect URLs"
   - Format: `https://your-app.vercel.app/**`

3. **Supabase Project Issues**
   - Verify Supabase project is active (not paused)
   - Check if anon key has correct permissions
   - Ensure RLS policies allow access

4. **Network Issues**
   - Check if deployment platform blocks external requests
   - Verify firewall allows Supabase API calls
   - Test Supabase URL is accessible

### Blank Screen After Deployment
1. **Missing Environment Variables**
   - Ensure all required env vars are set in deployment platform
   - Check deployment logs for missing variable errors

2. **Supabase Connection Issues**
   - Verify Supabase URL and keys are correct
   - Check Supabase project is active

3. **Asset Loading Issues**
   - Verify base path is correct in deployment
   - Check if assets are loading in browser dev tools

4. **JavaScript Errors**
   - Check browser console for errors
   - Verify all imports are working

### Debugging Steps
1. Open browser dev tools on deployed site
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests (look for Supabase API calls)
4. Verify environment variables are loaded:
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
   console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)
   ```

## Performance Optimization
- [ ] Enable gzip compression on server
- [ ] Set up proper caching headers
- [ ] Monitor bundle size (currently ~500KB)

## Security Checklist
- [ ] Environment variables are not exposed in client code
- [ ] Supabase RLS policies are configured
- [ ] API keys are properly secured
- [ ] HTTPS is enabled

## Supabase Configuration Checklist
1. **Project Settings**
   - [ ] Project is active (not paused)
   - [ ] API settings allow anonymous access
   - [ ] CORS settings include your domain

2. **Authentication Settings**
   - [ ] Enable email/password auth
   - [ ] Configure SITE URL in Auth settings (must match deployed URL)
   - [ ] Add redirect URLs for login/signup
   - [ ] **DISABLE email confirmations (temporary fix)**
   - [ ] Go to Authentication → Settings → Email confirmations
   - [ ] Turn OFF "Enable email confirmations" toggle
   - [ ] This allows immediate login after signup

3. **Database Setup**
   - [ ] `reports` table exists with correct schema
   - [ ] RLS policies allow authenticated users to read/write
   - [ ] Test database connection

4. **Email Configuration CRITICAL**
   - [ ] Go to Authentication → Email Templates
   - [ ] Verify "Confirm signup" template is enabled
   - [ ] Check sender email is configured
   - [ ] Test email delivery with "Send test email"

## Testing Authentication
1. Open browser dev tools
2. Go to Network tab
3. Try to sign up/login
4. Check for requests to `https://your-project.supabase.co/auth/v1/`
5. Verify status codes (200 for success, not 401/403)

## Email Confirmation Issues
1. **Check Spam Folder**
   - Look for Supabase confirmation email in spam/junk folders
   - Add `noreply@supabase.co` to contacts

2. **Verify Email Settings**
   - In Supabase Dashboard → Authentication → Email Templates
   - Check if confirmation emails are enabled
   - Verify email template content is correct

3. **Test Email Flow**
   - Try signing up with a test email
   - Check browser console for any errors
   - Verify the confirmation link works

4. **Common Solutions**
   - Ensure `SITE_URL` in Supabase settings matches your deployed URL
   - Check if email provider blocks Supabase emails
   - Try a different email provider for testing
