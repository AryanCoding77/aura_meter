# Google OAuth Login Troubleshooting Guide

## Current Issue
After selecting Google account, not redirecting to dashboard.

## Steps to Debug

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors when:
- Clicking "Continue with Google"
- After selecting Google account
- When redirected back to the app

Look for messages starting with:
- `Auth callback triggered`
- `Session data:`
- `Auth state changed:`

### 2. Verify Supabase Configuration

#### A. Check Redirect URLs in Supabase
Go to: https://supabase.com/dashboard/project/iycaqitoykonldxunjkl/auth/url-configuration

Should have:
```
http://localhost:8080/auth/callback
```

#### B. Check Site URL in Supabase
Should be:
```
http://localhost:8080/dashboard
```

### 3. Verify Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

Your OAuth 2.0 Client should have:

**Authorised JavaScript origins:**
```
http://localhost:8080
```

**Authorised redirect URIs:**
```
https://iycaqitoykonldxunjkl.supabase.co/auth/v1/callback
http://localhost:8080/auth/callback
```

### 4. Update Database Trigger

The trigger needs to handle Google's metadata format. Run this SQL in Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, plan, credits_remaining)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture'
    ),
    'free',
    0
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

This is also available in `supabase-update-trigger.sql`.

### 5. Clear Browser Data

1. Clear cookies for `localhost:8080`
2. Clear cookies for `supabase.co`
3. Clear localStorage
4. Try in incognito mode

### 6. Test the Flow

1. Go to `http://localhost:8080/login`
2. Click "Continue with Google"
3. Select your Google account
4. Watch the URL changes:
   - Should redirect to Google OAuth
   - Then to `https://iycaqitoykonldxunjkl.supabase.co/auth/v1/callback`
   - Then to `http://localhost:8080/auth/callback`
   - Finally to `http://localhost:8080/dashboard`

### 7. Check Console Logs

With the updated code, you should see these console logs:

```
Auth callback triggered
Session data: { ... }
Session found, redirecting to dashboard
Checking initial session...
Initial session: { ... }
Auth state changed: { ... }
User profile: { ... }
```

### 8. Common Issues

#### Issue: "No session found"
- **Cause**: OAuth callback didn't complete
- **Fix**: Check redirect URLs in both Supabase and Google Console

#### Issue: "Profile creation error"
- **Cause**: Database trigger not working
- **Fix**: Run the updated trigger SQL (step 4)

#### Issue: Stuck on callback page
- **Cause**: Navigation not working
- **Fix**: Check browser console for errors

#### Issue: Redirects to login instead of dashboard
- **Cause**: Session not being detected
- **Fix**: Check AuthContext is properly initialized

### 9. Manual Session Check

Open browser console on the login page and run:

```javascript
// Check if Supabase is initialized
console.log(window.location.origin);

// Try to get session manually
const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
const supabase = createClient(
  'https://iycaqitoykonldxunjkl.supabase.co',
  'YOUR_ANON_KEY'
);
const { data } = await supabase.auth.getSession();
console.log('Session:', data);
```

### 10. Check Supabase Auth Logs

1. Go to: https://supabase.com/dashboard/project/iycaqitoykonldxunjkl/auth/users
2. Check if your user appears after Google login
3. Go to Logs section to see auth events

## What to Share for Further Help

If still not working, share:
1. Browser console logs (all messages)
2. Network tab showing the redirect chain
3. Screenshot of Supabase Auth Users page
4. Any error messages from Supabase logs

## Quick Test Commands

Run these in browser console after attempting login:

```javascript
// Check localStorage
console.log('LocalStorage:', localStorage);

// Check session storage
console.log('SessionStorage:', sessionStorage);

// Check cookies
console.log('Cookies:', document.cookie);
```
