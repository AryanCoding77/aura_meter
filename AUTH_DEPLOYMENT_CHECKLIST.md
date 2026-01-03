# 🚀 Authentication Deployment Checklist

## Pre-Deployment

### Database Setup
- [ ] Run `supabase-schema.sql` in Supabase SQL Editor
- [ ] Verify `profiles` table exists
- [ ] Verify RLS policies are enabled
- [ ] Verify trigger `on_auth_user_created` exists
- [ ] Test profile creation manually

### Google OAuth Setup
- [ ] Create OAuth 2.0 Client ID in Google Cloud Console
- [ ] Add production redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
- [ ] Add development redirect URI: `http://localhost:5173/dashboard`
- [ ] Copy Client ID and Client Secret
- [ ] Enable Google provider in Supabase
- [ ] Paste credentials in Supabase
- [ ] Test Google login in development

### Supabase Configuration
- [ ] Add redirect URLs in Authentication → URL Configuration:
  - Development: `http://localhost:5173/dashboard`
  - Production: `https://yourdomain.com/dashboard`
- [ ] Set Site URL to production domain
- [ ] Verify email templates (optional)
- [ ] Configure email provider (optional)

### Environment Variables
- [ ] Development `.env` has correct values:
  ```
  VITE_SUPABASE_URL=https://xxx.supabase.co
  VITE_SUPABASE_ANON_KEY=xxx
  ```
- [ ] Production environment variables configured in hosting platform
- [ ] No secrets committed to git

## Testing

### Local Testing
- [ ] `npm run dev` starts without errors
- [ ] Navigate to `/login`
- [ ] Test email signup
  - [ ] User created in Supabase auth.users
  - [ ] Profile created in profiles table
  - [ ] Redirects to dashboard
- [ ] Test email login
  - [ ] Successful login
  - [ ] Session persists on refresh
  - [ ] Dashboard shows user info
- [ ] Test Google OAuth
  - [ ] Opens Google consent screen
  - [ ] Redirects back to dashboard
  - [ ] Profile created
- [ ] Test protected routes
  - [ ] `/dashboard` accessible when logged in
  - [ ] `/history` accessible when logged in
  - [ ] `/settings` accessible when logged in
  - [ ] Redirects to `/login` when not logged in
- [ ] Test logout
  - [ ] Clears session
  - [ ] Redirects to login
  - [ ] Can't access protected routes

### Mobile Testing
- [ ] Login page responsive
- [ ] Dashboard sidebar works on mobile
- [ ] All pages mobile-friendly
- [ ] Touch interactions work

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Build & Deploy

### Build
- [ ] Run `npm run build`
- [ ] No build errors
- [ ] Check build output size
- [ ] Test production build locally: `npm run preview`

### Deployment
- [ ] Deploy to hosting platform (Vercel/Netlify/etc)
- [ ] Set environment variables in hosting platform
- [ ] Verify deployment successful
- [ ] Check production URL loads

### Post-Deployment Testing
- [ ] Production site loads
- [ ] Login page accessible
- [ ] Test email signup in production
- [ ] Test email login in production
- [ ] Test Google OAuth in production
- [ ] Test protected routes in production
- [ ] Test logout in production
- [ ] Check browser console for errors
- [ ] Check Supabase logs for errors

## Security Verification

### Database Security
- [ ] RLS enabled on `profiles` table
- [ ] RLS policies tested
- [ ] Users can only access their own data
- [ ] No public access to sensitive data

### Auth Security
- [ ] Sessions stored securely
- [ ] Tokens refresh properly
- [ ] Logout clears all session data
- [ ] Protected routes can't be bypassed

### API Security
- [ ] Supabase anon key is public (safe)
- [ ] No service role key in frontend
- [ ] No secrets in client code
- [ ] CORS configured correctly

## Monitoring

### Setup Monitoring
- [ ] Enable Supabase logs
- [ ] Set up error tracking (Sentry/etc)
- [ ] Monitor auth success/failure rates
- [ ] Track user signups

### Health Checks
- [ ] Login flow works
- [ ] OAuth flow works
- [ ] Protected routes work
- [ ] Database queries work
- [ ] No errors in logs

## Documentation

- [ ] README updated with auth info
- [ ] Team knows how to access Supabase
- [ ] Google OAuth credentials documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide available

## Rollback Plan

### If Issues Occur
- [ ] Keep previous deployment available
- [ ] Document rollback procedure
- [ ] Have database backup
- [ ] Know how to revert changes

### Emergency Contacts
- [ ] Supabase support: support@supabase.io
- [ ] Google Cloud support
- [ ] Team contact list

## Post-Launch

### Week 1
- [ ] Monitor error rates
- [ ] Check user signup success rate
- [ ] Verify email delivery (if enabled)
- [ ] Collect user feedback

### Week 2-4
- [ ] Analyze auth metrics
- [ ] Optimize slow queries
- [ ] Fix any reported issues
- [ ] Plan improvements

## Optional Enhancements

### Email Features
- [ ] Enable email verification
- [ ] Customize email templates
- [ ] Add password reset flow
- [ ] Configure SMTP provider

### Additional OAuth
- [ ] Add GitHub OAuth
- [ ] Add Twitter OAuth
- [ ] Add Facebook OAuth

### User Experience
- [ ] Add "Remember me" option
- [ ] Add profile picture upload
- [ ] Add name editing
- [ ] Add account deletion

### Analytics
- [ ] Track signup sources
- [ ] Monitor conversion rates
- [ ] A/B test login page
- [ ] Track user retention

## Success Criteria

### Must Have
- ✅ Users can sign up
- ✅ Users can log in
- ✅ Sessions persist
- ✅ Protected routes work
- ✅ No security issues

### Nice to Have
- ✅ Google OAuth works
- ✅ Mobile responsive
- ✅ Fast load times
- ✅ Good UX
- ✅ Clear error messages

## Sign-Off

- [ ] Development team tested
- [ ] QA team approved
- [ ] Security review passed
- [ ] Product owner approved
- [ ] Ready for production

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Production URL**: _____________

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Check for errors
npm run lint
```

## Quick Links

- Supabase Dashboard: https://supabase.com/dashboard
- Google Cloud Console: https://console.cloud.google.com
- Production Site: [Your URL]
- Staging Site: [Your URL]

---

**Last Updated**: January 2, 2025
