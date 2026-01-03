# Supabase Redirect URL Configuration

## Issue
After Google OAuth login, users are being redirected back to the login page instead of the dashboard.

## Solution
You need to add the correct redirect URLs to your Supabase project settings.

## Steps to Fix

### 1. Update Supabase Redirect URLs

Go to your Supabase Dashboard:
1. Navigate to: https://supabase.com/dashboard/project/iycaqitoykonldxunjkl/auth/url-configuration
2. Under **"Redirect URLs"** section, click **"Add URL"**
3. Add the following URLs:

```
http://localhost:8080/auth/callback
http://localhost:8080/dashboard
```

4. Click **"Save"** to apply changes

### 2. Update Google OAuth Settings (if using Google Cloud Console)

If you configured Google OAuth directly in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Under **"Authorized redirect URIs"**, add:

```
https://iycaqitoykonldxunjkl.supabase.co/auth/v1/callback
http://localhost:8080/auth/callback
```

4. Click **"Save"**

### 3. Wait for Changes to Propagate

⚠️ **Important**: It may take 5-10 minutes for the settings to take effect.

## What Changed in the Code

1. **Added AuthCallback page** (`src/pages/AuthCallback.tsx`)
   - Handles OAuth redirect and extracts session
   - Redirects to dashboard on success

2. **Updated AuthContext** (`src/contexts/AuthContext.tsx`)
   - Added initial session check for OAuth redirects
   - Ensures session is properly loaded on page load

3. **Updated auth.ts** (`src/lib/auth.ts`)
   - Changed redirect URL from `/dashboard` to `/auth/callback`

4. **Updated App.tsx**
   - Added `/auth/callback` route

## Testing

After making these changes:

1. Clear your browser cache and cookies
2. Go to http://localhost:8080/login
3. Click "Continue with Google"
4. Select your Google account
5. You should be redirected to http://localhost:8080/auth/callback
6. Then automatically redirected to http://localhost:8080/dashboard

## Troubleshooting

If it still doesn't work:

1. **Check browser console** for errors
2. **Verify Supabase URL** in `.env` file matches your project
3. **Clear browser cache** completely
4. **Try incognito mode** to rule out cookie issues
5. **Wait 10 minutes** after changing Supabase settings
6. **Check Supabase logs** in the dashboard for auth errors

## Current Configuration

- **App Port**: 8080 (configured in `vite.config.ts`)
- **Supabase Project**: iycaqitoykonldxunjkl
- **Auth Callback Route**: `/auth/callback`
- **Dashboard Route**: `/dashboard`
