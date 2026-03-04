# Deployment Checklist

## Environment Variables (Required)
Add these to your deployment platform (Vercel, Netlify, etc.):

### Supabase Configuration
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Gemini AI
- `GEMINI_API_KEY`: Your Google Gemini API key

### App Configuration
- `APP_URL`: Your deployed app URL (e.g., https://your-app.vercel.app)

## Build Verification
- [ ] Run `npm run build` successfully
- [ ] Check `dist/index.html` is generated
- [ ] Verify all assets are in `dist/assets/`

## Common Issues & Solutions

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
3. Check Network tab for failed asset requests
4. Verify environment variables are loaded

## Performance Optimization
- [ ] Enable gzip compression on server
- [ ] Set up proper caching headers
- [ ] Monitor bundle size (currently ~500KB)

## Security Checklist
- [ ] Environment variables are not exposed in client code
- [ ] Supabase RLS policies are configured
- [ ] API keys are properly secured
- [ ] HTTPS is enabled
